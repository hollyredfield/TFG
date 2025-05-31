import axios from 'axios';

const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
const baseURL = 'https://openrouter.ai/api/v1';

// Cliente de axios para OpenRouter con configuración mejorada
export const openRouterClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'HTTP-Referer': window.location.origin,
    'X-Title': 'CazaOfertas'
  },
  timeout: 60000 // Timeout de 60 segundos para evitar peticiones colgadas
});

// Interceptor para logs de peticiones
openRouterClient.interceptors.request.use(request => {
  console.log('OpenRouter Request URL:', request.url);
  console.log('Request Headers:', request.headers);
  return request;
}, error => {
  console.error('Error en solicitud a OpenRouter:', error);
  return Promise.reject(error);
});

// Interceptor para logs de respuestas
openRouterClient.interceptors.response.use(response => {
  console.log('OpenRouter Status:', response.status);
  return response;
}, error => {
  console.error('Error en respuesta de OpenRouter:', error.response?.status, error.response?.data);
  return Promise.reject(error);
});

/**
 * Genera un título atractivo para una oferta basado en su descripción
 * @param {string} description - Descripción del producto
 * @returns {Promise<string>} Título generado
 */
export const generateOfferTitle = async (description) => {
  try {
    const response = await openRouterClient.post('/chat/completions', {
      model: 'anthropic/claude-3-haiku-20240307',
      messages: [
        {
          role: 'system',
          content: 'Eres un experto en marketing que crea títulos atractivos para ofertas en español. Genera títulos concisos, llamativos y que destaquen las características principales del producto.'
        },
        {
          role: 'user',
          content: `Crea un título atractivo y breve (máximo 70 caracteres) para esta oferta: ${description}`
        }
      ],
      max_tokens: 100
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generando título:', error);
    return '';
  }
};

/**
 * Genera una descripción mejorada para una oferta
 * @param {string} description - Descripción inicial del producto
 * @returns {Promise<string>} Descripción mejorada
 */
export const improveOfferDescription = async (description) => {
  try {
    const response = await openRouterClient.post('/chat/completions', {
      model: 'anthropic/claude-3-haiku-20240307',
      messages: [
        {
          role: 'system',
          content: 'Eres un especialista en redacción de descripciones de productos para ecommerce en español. Mejora las descripciones haciéndolas más atractivas, destacando características clave y beneficios para el usuario.'
        },
        {
          role: 'user',
          content: `Mejora esta descripción de producto, haciéndola más profesional y atractiva (máximo 200 palabras): ${description}`
        }
      ],
      max_tokens: 500
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error mejorando descripción:', error);
    return description;
  }
};

/**
 * Analiza sentimiento de comentarios de usuarios
 * @param {string} comment - Comentario del usuario
 * @returns {Promise<{sentiment: 'positive'|'neutral'|'negative', toxic: boolean}>} Análisis del comentario
 */
export const analyzeComment = async (comment) => {
  try {
    const response = await openRouterClient.post('/chat/completions', {
      model: 'anthropic/claude-3-haiku-20240307',
      messages: [
        {
          role: 'system',
          content: 'Eres un experto en análisis de sentimiento. Analiza el siguiente comentario y clasifícalo como "positive", "neutral" o "negative". También determina si es tóxico (true/false).'
        },
        {
          role: 'user',
          content: `Analiza este comentario: "${comment}"`
        }
      ],
      max_tokens: 100
    });

    const analysisText = response.data.choices[0].message.content.trim();
    
    // Extraer sentimiento y toxicidad
    const sentimentMatch = /sentimiento.*?(?:positive|neutral|negative)/i.exec(analysisText);
    const toxicMatch = /tóxico.*?(?:true|false)/i.exec(analysisText);
    
    return {
      sentiment: sentimentMatch 
        ? (sentimentMatch[0].includes('positive') 
            ? 'positive' 
            : sentimentMatch[0].includes('negative') 
              ? 'negative' 
              : 'neutral')
        : 'neutral',
      toxic: toxicMatch ? toxicMatch[0].includes('true') : false
    };
  } catch (error) {
    console.error('Error analizando comentario:', error);
    return { sentiment: 'neutral', toxic: false };
  }
};

/**
 * Genera recomendaciones personalizadas basadas en historial de compras y preferencias
 * @param {Array} purchaseHistory - Historial de compras del usuario
 * @param {Array} preferences - Preferencias del usuario
 * @returns {Promise<Array>} Lista de recomendaciones
 */
export const generateRecommendations = async (purchaseHistory, preferences) => {
  try {
    const response = await openRouterClient.post('/chat/completions', {
      model: 'anthropic/claude-3-haiku-20240307',
      messages: [
        {
          role: 'system',
          content: 'Eres un sistema de recomendación que sugiere productos basados en el historial de compras y preferencias de los usuarios. Las recomendaciones deben ser relevantes y personalizadas.'
        },
        {
          role: 'user',
          content: `Genera 5 recomendaciones de productos en formato JSON para un usuario con el siguiente historial de compras: ${JSON.stringify(purchaseHistory)} y estas preferencias: ${JSON.stringify(preferences)}`
        }
      ],
      max_tokens: 800
    });

    const content = response.data.choices[0].message.content.trim();
    
    // Extraer el JSON de la respuesta
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\[([\s\S]*?)\]/);
    const jsonString = jsonMatch ? jsonMatch[1] : content;
    
    try {
      return JSON.parse(jsonString);
    } catch {
      return JSON.parse(`[${jsonString}]`);
    }
  } catch (error) {
    console.error('Error generando recomendaciones:', error);
    return [];
  }
};

/**
 * Genera respuestas para el asistente IA de CazaOfertas
 * @param {Array} messages - Historial de mensajes en formato [{role: 'user'|'assistant', content: string}]
 * @returns {Promise<string>} Respuesta del asistente
 */
export const generateAssistantResponse = async (messages) => {
  try {
    console.log('API Key:', apiKey ? "Configurada (primeros caracteres: " + apiKey.substring(0, 5) + "...)" : "No configurada");
    
    // Filtrar y formatear los mensajes correctamente
    const formattedMessages = messages.filter(msg => 
      msg.role === 'user' || msg.role === 'assistant'
    ).map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Agregar el mensaje de sistema al inicio
    const systemMessage = {
      role: 'system',
      content: 'Eres el asistente virtual de CazaOfertas, una plataforma donde los usuarios comparten ofertas y descuentos. ' +
               'Tu objetivo es ayudar a los usuarios a encontrar las mejores ofertas, responder preguntas sobre la plataforma, ' +
               'y ofrecer consejos sobre cómo ahorrar dinero. Sé amigable, útil y conciso en tus respuestas. ' +
               'Mantén un tono conversacional en español.'
    };
    
    const finalMessages = [systemMessage, ...formattedMessages];
    
    console.log('Enviando solicitud a OpenRouter con:', finalMessages.length, 'mensajes');
    
    // Usando un modelo más compatible con OpenRouter
    const model = 'openai/gpt-3.5-turbo'; // Cambiamos a un modelo más estable
    
    console.log('Payload:', JSON.stringify({
      model: model,
      messages: finalMessages,
      max_tokens: 800,
      temperature: 0.7
    }, null, 2));
    
    const response = await openRouterClient.post('/chat/completions', {
      model: model, // Usamos el modelo más estable
      messages: finalMessages,
      max_tokens: 800,
      temperature: 0.7
    });

    console.log('Respuesta recibida de OpenRouter:', response.status);
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error detallado en el asistente IA:', error);
    
    // Mostrar más detalles sobre el error
    if (error.response) {
      console.error('Estado de error:', error.response.status);
      console.error('Datos de error:', error.response.data);
      console.error('Encabezados de error:', error.response.headers);
      
      // Mensaje específico basado en el código de error
      if (error.response.status === 400) {
        console.error('Datos enviados que causaron el error 400:', error.config?.data);
        return 'Lo siento, hay un problema con el formato de mi solicitud (Error 400). Por favor, intenta usar el modo local.';
      } else if (error.response.status === 401) {
        return 'Lo siento, hay un problema con la autenticación del asistente (Error 401). Por favor, contacta al administrador.';
      } else if (error.response.status === 429) {
        return 'Lo siento, hemos alcanzado el límite de solicitudes a la API (Error 429). Por favor, inténtalo de nuevo más tarde.';
      }
    } else if (error.request) {
      console.error('Error de solicitud (sin respuesta):', error.request);
      return 'Lo siento, no pude conectarme al servicio de IA. Por favor, verifica tu conexión a internet e inténtalo de nuevo.';
    }
    
    return 'Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, inténtalo de nuevo más tarde o usa el modo local.';
  }
};