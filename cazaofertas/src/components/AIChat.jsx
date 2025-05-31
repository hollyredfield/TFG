import React, { useState, useEffect, useRef } from 'react';
import { 
  FaPaperPlane, FaRobot, FaUser, FaExclamationTriangle, 
  FaShoppingCart, FaChartLine, FaTags, FaCheck, FaEdit, FaTimes // Added FaTimes
} from 'react-icons/fa';
import { generateAssistantResponse } from '../services/openrouter';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import supabase from '../services/supabase'; // Added Supabase import

// Respuestas de fallback para preguntas comunes
const fallbackResponses = {
  'mejores ofertas de tecnología': 'Actualmente, tenemos grandes ofertas en portátiles, smartphones y auriculares inalámbricos. Te recomiendo visitar la categoría de Tecnología donde encontrarás descuentos de hasta el 40% en marcas como Samsung, Apple y Xiaomi. Las ofertas más populares esta semana son en tarjetas gráficas y monitores gaming.',
  'recibir notificaciones': 'Para recibir notificaciones de ofertas, debes iniciar sesión en tu cuenta y luego ir a "Mi Perfil > Preferencias > Notificaciones". Allí puedes activar las alertas para categorías específicas, establecer un rango de precios y decidir si quieres recibir notificaciones por email, navegador o ambas.',
  'plan compras': 'Para crear tu plan de compras, por favor indícame:\n- Presupuesto disponible\n- Número de personas\n- Categorías de interés\n- Marcas preferidas si las hay',
  'crear plan': 'Puedo ayudarte a crear un plan de compras. Necesito saber:\n- Tu presupuesto\n- Cantidad de personas\n- Tipos de productos que buscas\n- Preferencias específicas',
  'subir una oferta': 'Para subir una oferta a la plataforma, debes estar registrado y hacer clic en el botón "Publicar Oferta" que aparece en la parte superior de la página. Luego completa el formulario con los detalles del producto, precio original, precio en oferta, enlace a la tienda y una imagen. Tu oferta será revisada brevemente antes de publicarse.',
  'hola': '¡Hola! Soy el asistente virtual de CazaOfertas. Estoy aquí para ayudarte a encontrar las mejores ofertas y resolver cualquier duda sobre la plataforma. ¿En qué puedo asistirte hoy?'
};

// Función para encontrar la respuesta de fallback más adecuada
const getFallbackResponse = (query) => {
  const normalizedQuery = query.toLowerCase();
  
  // Buscar coincidencias parciales en las claves de fallback
  for (const [key, response] of Object.entries(fallbackResponses)) {
    if (normalizedQuery.includes(key)) {
      return response;
    }
  }
  
  // Respuesta genérica si no hay coincidencias
  return 'Lo siento, no puedo proporcionar información específica sobre eso en este momento. Te sugiero buscar ofertas usando los filtros de categorías o la función de búsqueda en la parte superior del sitio.';
};

const AIChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 ¡Hola! Soy tu asistente de CazaOfertas. Puedo ayudarte a encontrar las mejores ofertas, resolver dudas sobre la plataforma o darte consejos de ahorro. ¿En qué puedo ayudarte hoy?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState(0); // Contador de errores de API
  const [useApi, setUseApi] = useState(true); // Toggle para usar API o respuestas locales
  const [planningMode, setPlanningMode] = useState(false);
  const [planDetails, setPlanDetails] = useState({
    budget: null,
    people: null,
    categories: [],
    preferences: []
  });
  const [suggestedQuestions, setSuggestedQuestions] = useState([
    '¿Cuáles son las mejores ofertas de tecnología?',
    '¿Cómo puedo recibir notificaciones de ofertas?',
    '¿Puedes crear un plan de compras personalizado?',
    '¿Cómo subir una oferta a la plataforma?'
  ]);
  
  const messagesEndRef = useRef(null);
  const [apiMessages, setApiMessages] = useState([]);

  const fetchUserPersonalData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const authError = { message: "Usuario no autenticado. Por favor, inicia sesión." };
      return {
        profileResult: { error: authError },
        ordersResult: { error: authError },
        ticketsResult: { error: authError }
      };
    }

    let profileData;
    try {
      const { data, error, status } = await supabase
        .from('perfiles_usuario') // Correct table name
        .select('nombre_usuario, biografia, url_avatar') // Select specific fields
        .eq('id', user.id)
        .single();

      if (error && status !== 406) { // 406 means no rows found, which is not necessarily an error here
        console.error('Error fetching profile:', error);
        profileData = { error: { message: 'Error al cargar la información del perfil.' } };
      } else if (!data) { // No profile found for the user
        profileData = { status: 'nodata', message: 'No se encontró un perfil de usuario asociado a esta cuenta. Puedes crear uno en tu página de perfil.' };
      } else {
        profileData = { data };
      }
    } catch (error) {
      console.error('Exception fetching profile:', error);
      profileData = { error: { message: 'Ocurrió un problema al intentar obtener la información del perfil.' } };
    }

    // For orders and tickets, tables don't exist as per xd.sql.
    // Adhere to "No digas o informes que es simulado".
    const ordersData = { status: 'unavailable', message: 'La información de pedidos no está disponible en este momento.' };
    const ticketsData = { status: 'unavailable', message: 'La información de tickets de soporte no está disponible en este momento.' };

    return {
      profileResult: profileData,
      ordersResult: ordersData,
      ticketsResult: ticketsData
    };
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Detectar intención de crear un plan de compras
  const checkForPlanningIntent = (text) => {
    const planningKeywords = ['plan', 'compras', 'presupuesto', 'lista', 'shopping'];
    return planningKeywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  // Extraer información del plan de compras del mensaje
  const extractPlanInfo = (text) => {
    const budgetMatch = text.match(/\d+\s*(?:€|euros)/i);
    const peopleMatch = text.match(/\d+\s*(?:personas?|gente|family|familia)/i);
    const categoriesMatch = text.match(/(?:tecnología|ropa|hogar|alimentos|electrónica|deportes)/gi);

    if (budgetMatch || peopleMatch || categoriesMatch) {
      const newPlanDetails = { ...planDetails };
      if (budgetMatch) {
        newPlanDetails.budget = parseInt(budgetMatch[0]);
      }
      if (peopleMatch) {
        newPlanDetails.people = parseInt(peopleMatch[0]);
      }
      if (categoriesMatch) {
        newPlanDetails.categories = [...new Set([...newPlanDetails.categories, ...categoriesMatch])];
      }
      setPlanDetails(newPlanDetails);
      return true;
    }
    return false;
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestedQuestion = (question) => {
    setInput(question);
  };

  const toggleApiMode = () => {
    setUseApi(prev => !prev);
    setMessages(prev => [...prev, {
      role: 'system',
      content: `Modo ${!useApi ? 'API' : 'local'} activado.`
    }]);
  };

  const sendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    // Añadir mensaje del usuario
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    
    // Actualizar el historial de mensajes para la API
    const updatedApiMessages = [...apiMessages, userMessage];
    setApiMessages(updatedApiMessages);
    
    const userInputText = input; // Guardar una copia del input
    const userInputLower = input.toLowerCase(); // For keyword matching
    setInput('');
    setIsLoading(true);

    try {
      // Check for personal data request
      const personalDataKeywords = ['mi perfil', 'mis datos', 'mis pedidos', 'mis tickets', 'mi historial', 'mi información', 'mi cuenta'];
      const isPersonalDataRequest = personalDataKeywords.some(keyword => userInputLower.includes(keyword));

      if (isPersonalDataRequest) {
        if (!user) {
          const loginRequiredMessage = {
            role: 'assistant',
            content: 'Para acceder a tu información personal, por favor inicia sesión primero. Puedes hacerlo desde el menú de navegación.'
          };
          setMessages(prev => [...prev, loginRequiredMessage]);
          setApiMessages(prev => [...prev, loginRequiredMessage]);
          setIsLoading(false);
          return;
        }

        setMessages(prev => [...prev, { role: 'assistant', content: 'Consultando tu información...' }]);
        const fetchedData = await fetchUserPersonalData();
        let responseContent = 'Aquí tienes un resumen de tu información:\\n\\n';

        if (fetchedData && fetchedData.profileResult) {
          // Perfil
          if (fetchedData.profileResult.data) {
            const profile = fetchedData.profileResult.data;
            responseContent += `**Perfil:**\\n`;
            responseContent += `  - Email: ${user.email}\\n`;
            if (profile.nombre_usuario) {
              responseContent += `  - Nombre de usuario: ${profile.nombre_usuario}\\n`;
            } else {
              responseContent += `  - Nombre de usuario: Aún no lo has configurado. Puedes añadirlo en tu perfil.\\n`;
            }
            if (profile.biografia && profile.biografia.trim() !== '') {
              responseContent += `  - Biografía: ${profile.biografia}\\n`;
            } else {
              responseContent += `  - Biografía: Aún no has añadido una. ¡Anímate a compartir algo sobre ti en tu perfil!\\n`;
            }
            if (profile.url_avatar && profile.url_avatar.trim() !== '') {
              responseContent += `  - Avatar: Has configurado una imagen de perfil.\\n`;
            } else {
              responseContent += `  - Avatar: Aún no tienes una imagen de perfil. ¡Sube una para personalizar tu cuenta!\\n`;
            }
            responseContent += '\\n';
          } else if (fetchedData.profileResult.status === 'nodata') {
            responseContent += `**Perfil:**\\n  - Email: ${user.email}\\n  - ${fetchedData.profileResult.message}\\n\\n`;
          } else if (fetchedData.profileResult.error) {
            responseContent += `**Perfil:**\\n  - Email: ${user.email}\\n  - ${fetchedData.profileResult.error.message}\\n\\n`;
          } else { // Fallback for unexpected profileResult structure
            responseContent += `**Perfil:**\\n  - Email: ${user.email}\\n  - No se pudo obtener la información del perfil en este momento.\\n\\n`;
          }

          // Pedidos
          if (fetchedData.ordersResult && fetchedData.ordersResult.status === 'unavailable') {
            responseContent += `**Pedidos:**\\n  - ${fetchedData.ordersResult.message}\\n\\n`;
          } else if (fetchedData.ordersResult && fetchedData.ordersResult.error) { // Should ideally not be hit if user is authenticated
            responseContent += `**Pedidos:**\\n  - ${fetchedData.ordersResult.error.message}\\n\\n`;
          } else {
            responseContent += `**Pedidos:**\\n  - No se pudo obtener la información de pedidos.\\n\\n`;
          }

          // Tickets de Soporte
          if (fetchedData.ticketsResult && fetchedData.ticketsResult.status === 'unavailable') {
            responseContent += `**Tickets de Soporte:**\\n  - ${fetchedData.ticketsResult.message}\\n\\n`;
          } else if (fetchedData.ticketsResult && fetchedData.ticketsResult.error) { // Should ideally not be hit if user is authenticated
            responseContent += `**Tickets de Soporte:**\\n  - ${fetchedData.ticketsResult.error.message}\\n\\n`;
          } else {
            responseContent += `**Tickets de Soporte:**\\n  - No se pudo obtener la información de tickets de soporte.\\n\\n`;
          }
          responseContent += 'Puedes pedirme más detalles sobre un pedido o ticket específico (funcionalidad futura), o visitar las secciones correspondientes en tu perfil.';

        } else {
          responseContent = 'Lo siento, hubo un problema al intentar recuperar tu información personal. Por favor, inténtalo más tarde.';
        }
        
        // Remove the "Consultando tu información..." message
        setMessages(prev => prev.filter(msg => msg.content !== 'Consultando tu información...'));
        
        const assistantMessage = { role: 'assistant', content: responseContent };
        setMessages(prev => [...prev, assistantMessage]);
        setApiMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        return; 
      }

      // Verificar si es una solicitud de plan de compras
      const isPlanningRequest = checkForPlanningIntent(userInputText); // Use original case for planning intent
      if (isPlanningRequest) {
        setPlanningMode(true);
        const detailsExtracted = extractPlanInfo(userInputText);
        
        if (detailsExtracted) {
          // Si se extrajo información, mostrar resumen del plan
          const planSummary = {
            role: 'assistant',
            content: `He detectado los siguientes detalles para tu plan de compras:\n${
              planDetails.budget ? `💰 Presupuesto: ${planDetails.budget}€\n` : ''
            }${
              planDetails.people ? `👥 Personas: ${planDetails.people}\n` : ''
            }${
              planDetails.categories.length > 0 ? `🏷️ Categorías: ${planDetails.categories.join(', ')}\n` : ''
            }\n¿Quieres que te ayude a crear un plan de compras con estos detalles?`
          };
          setMessages(prev => [...prev, planSummary]);
          setApiMessages(prev => [...prev, planSummary]);
          setIsLoading(false);
          return;
        }
      }

      let assistantResponse;
      if (useApi) {
        // Intentar usar OpenRouter para una respuesta real
        try {
          assistantResponse = await generateAssistantResponse(updatedApiMessages);
          
          // Si la respuesta contiene un mensaje de error, aumentar el contador de errores
          if (assistantResponse.includes('Lo siento, ha ocurrido un error') || 
              assistantResponse.includes('hay un problema con la autenticación')) {
            setApiErrors(prev => prev + 1);
            
            // Si hay muchos errores consecutivos, cambiar a respuestas locales
            if (apiErrors >= 2) {
              setUseApi(false);
              console.log('Demasiados errores de API, cambiando a respuestas locales');
            }
            
            // Usar respuesta de fallback
            assistantResponse = getFallbackResponse(userInputText);
          } else {
            // Resetear el contador de errores si la API funciona correctamente
            setApiErrors(0);
          }
        } catch (error) {
          console.error('Error con OpenRouter:', error);
          setApiErrors(prev => prev + 1);
          
          // Si hay muchos errores consecutivos, cambiar a respuestas locales
          if (apiErrors >= 2) {
            setUseApi(false);
            console.log('Demasiados errores de API, cambiando a respuestas locales');
          }
          
          // Usar respuesta de fallback
          assistantResponse = getFallbackResponse(userInputText);
        }
      } else {
        // Modo sin API - usar respuestas locales
        assistantResponse = getFallbackResponse(userInputText); // Use original case for fallback
      }
      
      const assistantMessage = {
        role: 'assistant',
        content: assistantResponse
      };
      
      // Actualizar el estado de los mensajes para la UI y la API
      setMessages(prev => [...prev, assistantMessage]);
      setApiMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('Error general en el chat:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, inténtalo de nuevo.'
      };
      setMessages(prev => [...prev, errorMessage]);
      setApiMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[700px] rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-indigo-500/30">
      {/* Header del chat */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-4 flex items-center justify-between text-white">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-3">
            <FaRobot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Asistente IA CazaOfertas</h3>
            <p className="text-xs text-indigo-200">
              {user ? `Personalizado para ${user.email}` : 'Siempre disponible para ayudarte'}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          {!useApi && (
            <div className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-md mr-2 flex items-center">
              <FaExclamationTriangle className="mr-1" /> Modo local
            </div>
          )}
          <button 
            onClick={toggleApiMode} 
            className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md mr-2 transition-colors border border-gray-600"
            title="Cambiar entre modo API y modo local"
          >
            Modo {useApi ? 'API' : 'Local'}
          </button>
          <div className={`h-2 w-2 rounded-full ${useApi ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`}></div>
        </div>
      </div>

      {/* Panel de plan de compras (si está activo) */}
      {planningMode && (
        <div className="bg-indigo-900/30 border-b border-indigo-500/30 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-indigo-200 font-medium flex items-center">
              <FaShoppingCart className="mr-2" /> Plan de Compras Activo
            </h4>
            <button 
              onClick={() => setPlanningMode(false)} 
              className="text-indigo-300 hover:text-indigo-100"
            >
              <FaTimes />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-indigo-800/30 rounded p-2">
              <span className="text-indigo-300">Presupuesto:</span>
              <span className="float-right text-white">{planDetails.budget ? `${planDetails.budget}€` : 'No definido'}</span>
            </div>
            <div className="bg-indigo-800/30 rounded p-2">
              <span className="text-indigo-300">Personas:</span>
              <span className="float-right text-white">{planDetails.people || 'No definido'}</span>
            </div>
          </div>
          {planDetails.categories.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {planDetails.categories.map((cat, index) => (
                <span key={index} className="bg-indigo-700/50 text-indigo-200 px-2 py-1 rounded text-xs">
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-800/70 backdrop-blur-sm space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${
            message.role === 'user' 
              ? 'justify-end' 
              : message.role === 'system' 
                ? 'justify-center' 
                : 'justify-start'
          }`}>
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-2 flex-shrink-0">
                <FaRobot className="h-4 w-4 text-white" />
              </div>
            )}
            <div className={`rounded-2xl p-4 max-w-[75%] shadow-md ${
              message.role === 'user' 
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-none' 
                : message.role === 'system'
                  ? 'bg-yellow-600/20 text-yellow-200 text-sm px-3 py-1'
                  : 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-100 rounded-tl-none border border-indigo-500/20'
            }`}>
              {message.content.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < message.content.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
              {message.role !== 'system' && (
                <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center ml-2 flex-shrink-0">
                <FaUser className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-2 flex-shrink-0">
              <FaRobot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-2xl p-4 max-w-[75%] rounded-tl-none shadow-md border border-indigo-500/20">
              <div className="flex space-x-2">
                <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></div>
                <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Sugerencias */}
      <div className="flex flex-wrap gap-2 px-4 py-3 bg-gray-900">
        {suggestedQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => handleSuggestedQuestion(question)}
            className="text-xs bg-indigo-900/50 text-indigo-100 px-3 py-1.5 rounded-full hover:bg-indigo-800 transition-colors border border-indigo-700/50"
          >
            {question}
          </button>
        ))}
      </div>

      {/* Input del chat */}
      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <div className="relative flex items-center">
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={planningMode 
              ? "Cuéntame más detalles sobre tu plan de compras..." 
              : "Escribe tu mensaje aquí..."}
            className="w-full resize-none rounded-xl bg-gray-800 text-gray-100 border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-4 pr-12 h-[60px] placeholder-gray-500"
            rows="1"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || input.trim() === ''}
            className={`absolute right-3 p-2 rounded-full ${
              isLoading || input.trim() === '' 
                ? 'bg-gray-700 text-gray-500' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500'
            } transition-all`}
          >
            <FaPaperPlane className="h-5 w-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          {planningMode 
            ? "Estoy aquí para ayudarte a crear un plan de compras personalizado 🛍️" 
            : "Las respuestas son generadas por IA y pueden no ser siempre precisas."}
        </p>
      </div>
    </div>
  );
};

export default AIChat;