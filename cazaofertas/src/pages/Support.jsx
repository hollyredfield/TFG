import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaTicketAlt, FaPlus, FaQuestion, FaEnvelope, FaExclamationCircle, FaSpinner, FaArrowLeft, FaCommentAlt } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { createSupportTicket, getSupportTicketsByUser, addTicketResponse } from '../services/supabase';
import { NotificationService } from '../services/notificationService';
import toast from 'react-hot-toast';

const SupportPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets, setTickets] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    department: 'general',
    priority: 'normal',
    orderRef: searchParams.get('ref') === 'order' ? searchParams.get('id') : ''
  });
  const [responseMessage, setResponseMessage] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTickets();
      
      // Si hay un parámetro ref=order en la URL, abrir formulario de nuevo ticket
      if (searchParams.get('ref') === 'order') {
        setShowNewForm(true);
        setActiveTab('new');
      }
    }
  }, [user, searchParams]);

  const fetchTickets = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, success, error } = await getSupportTicketsByUser(user.id);
      
      if (success && data) {
        setTickets(data);
        // Si solo hay un ticket, mostrarlo automáticamente
        if (data.length === 1 && !activeTicket && !showNewForm) {
          setActiveTicket(data[0]);
        }
      } else {
        throw new Error(error?.message || 'Error al cargar los tickets');
      }
    } catch (error) {
      console.error('Error cargando tickets:', error);
      toast.error('No se pudieron cargar los tickets de soporte');
    } finally {
      setLoading(false);
    }
  };
  const handleSubmitNewTicket = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Si el asunto está vacío, usar un valor predeterminado
      const ticketData = {
        userId: user.id,
        subject: formData.subject || 'Consulta general',
        message: formData.message,
        department: formData.department,
        priority: formData.priority
      };

      const { data, success, error } = await createSupportTicket(ticketData);
      
      if (success && data) {
        toast.success('Ticket de soporte creado correctamente');
        
        // Crear notificación para el usuario
        await NotificationService.createNotification({
          userId: user.id,
          type: 'SUPPORT_TICKET_CREATED',
          title: 'Ticket de soporte creado',
          message: `Tu ticket "${data.asunto}" ha sido creado y será revisado en breve.`,
          data: {
            ticket_id: data.id,
            ticket_subject: data.asunto,
            priority: data.prioridad
          }
        });
        
        setFormData({
          subject: '',
          message: '',
          department: 'general',
          priority: 'normal',
          orderRef: ''
        });
        setShowNewForm(false);
        await fetchTickets();
        setActiveTicket(data);
        setActiveTab('tickets');
      } else {
        throw new Error(error?.message || 'Error al crear el ticket');
      }
    } catch (error) {
      console.error('Error creando ticket:', error);
      toast.error('No se pudo crear el ticket de soporte');
    } finally {
      setLoading(false);
    }
  };
  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!user || !activeTicket || !responseMessage.trim()) return;

    setLoading(true);
    try {
      const response = {
        message: responseMessage,
        userId: user.id
      };

      const { success, error } = await addTicketResponse(activeTicket.id, response);
      
      if (success) {
        toast.success('Respuesta enviada correctamente');
        
        // Crear notificación para el usuario
        await NotificationService.createNotification({
          userId: user.id,
          type: 'SUPPORT_TICKET_UPDATED',
          title: 'Actualización de ticket de soporte',
          message: `Has añadido una nueva respuesta a tu ticket "${activeTicket.asunto}".`,
          data: {
            ticket_id: activeTicket.id,
            ticket_subject: activeTicket.asunto,
            status: activeTicket.estado
          }
        });
        
        setResponseMessage('');
        await fetchTickets();
        
        // Actualizar el ticket activo con la nueva respuesta
        const updatedTicket = tickets.find(t => t.id === activeTicket.id);
        setActiveTicket(updatedTicket);
      } else {
        throw new Error(error?.message || 'Error al enviar la respuesta');
      }
    } catch (error) {
      console.error('Error enviando respuesta:', error);
      toast.error('No se pudo enviar la respuesta');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Helper para mostrar el estado del ticket con colores
  const getStatusInfo = (status) => {
    switch (status) {
      case 'abierto':
        return { label: 'Abierto', color: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400' };
      case 'en_proceso':
        return { label: 'En Proceso', color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-400' };
      case 'esperando_respuesta':
        return { label: 'Esperando Respuesta', color: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-400' };
      case 'resuelto':
        return { label: 'Resuelto', color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-400' };
      case 'cerrado':
        return { label: 'Cerrado', color: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400' };
      default:
        return { label: status, color: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400' };
    }
  };

  // Helper para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded-lg mb-4">
          <div className="flex items-center">
            <FaExclamationCircle className="mr-2" />
            <p>Debes iniciar sesión para acceder al soporte</p>
          </div>
        </div>
        <div className="flex space-x-4 mt-6">
          <Link to="/login" className="button-modern button-primary">
            Iniciar sesión
          </Link>
          <Link to="/" className="button-modern button-secondary">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Soporte al Cliente</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            ¿Tienes alguna pregunta o problema? Estamos aquí para ayudarte.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/preguntas-frecuentes" className="button-modern button-secondary inline-flex items-center">
            <FaQuestion className="mr-2" />
            Ver preguntas frecuentes
          </Link>
        </div>
      </div>

      {/* Pestañas */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('tickets');
              setShowNewForm(false);
            }}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'tickets' 
                ? 'border-primary text-primary dark:border-primary-light dark:text-primary-light' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-600'}
            `}
          >
            <FaTicketAlt className="inline mr-2" /> Mis Tickets
          </button>
          <button
            onClick={() => {
              setActiveTab('new');
              setShowNewForm(true);
              setActiveTicket(null);
            }}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'new' 
                ? 'border-primary text-primary dark:border-primary-light dark:text-primary-light' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-600'}
            `}
          >
            <FaPlus className="inline mr-2" /> Nuevo Ticket
          </button>
          <button
            onClick={() => {
              setActiveTab('contact');
              setShowNewForm(false);
              setActiveTicket(null);
            }}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'contact' 
                ? 'border-primary text-primary dark:border-primary-light dark:text-primary-light' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-600'}
            `}
          >
            <FaEnvelope className="inline mr-2" /> Contacto
          </button>
        </nav>
      </div>

      {loading && !showNewForm && !activeTicket && (
        <div className="flex justify-center items-center py-20">
          <FaSpinner className="animate-spin text-4xl text-primary" />
        </div>
      )}

      {/* Contenido de la pestaña activa */}
      {activeTab === 'tickets' && !showNewForm && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Lista de tickets */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Mis Tickets</h2>
                <button
                  onClick={() => {
                    setActiveTab('new');
                    setShowNewForm(true);
                    setActiveTicket(null);
                  }}
                  className="text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary-light/80"
                >
                  <FaPlus />
                </button>
              </div>

              {tickets.length === 0 ? (
                <div className="p-6 text-center">
                  <FaTicketAlt className="mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    No tienes tickets de soporte
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab('new');
                      setShowNewForm(true);
                    }}
                    className="button-modern button-primary text-sm"
                  >
                    Crear nuevo ticket
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {tickets.map(ticket => {
                    const { label, color } = getStatusInfo(ticket.estado);
                    return (
                      <button
                        key={ticket.id}
                        onClick={() => {
                          setActiveTicket(ticket);
                          setShowNewForm(false);
                        }}
                        className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${activeTicket?.id === ticket.id ? 'bg-gray-50 dark:bg-gray-700/30' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">
                            {ticket.asunto}
                          </h3>
                          <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color}`}>
                            {label}
                          </span>
                        </div>                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 truncate">
                          {ticket.mensaje ? ticket.mensaje.slice(0, 60) + '...' : 'No message content'}
                        </p>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {formatDate(ticket.created_at)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Detalle del ticket */}
          <div className="md:col-span-2">
            {activeTicket ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft h-full overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white">{activeTicket.asunto}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Creado el {formatDate(activeTicket.created_at)}
                      </p>
                    </div>
                    <div>
                      {(() => {
                        const { label, color } = getStatusInfo(activeTicket.estado);
                        return (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                            {label}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                <div className="p-6 h-full flex flex-col">
                  {/* Mensaje inicial */}
                  <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">Tú</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(activeTicket.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {activeTicket.mensaje}
                      </p>
                    </div>
                  </div>

                  {/* Respuestas (simuladas) */}
                  <div className="space-y-6 mb-6 flex-grow">
                    {activeTicket.estado === 'en_proceso' && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium text-blue-800 dark:text-blue-400">Soporte CazaOfertas</span>
                          <span className="text-xs text-blue-600 dark:text-blue-500">
                            {formatDate(new Date(Date.now() - 86400000))} {/* 24 horas antes */}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">
                          Hemos recibido tu consulta y estamos trabajando para ayudarte lo antes posible. Un miembro de nuestro equipo te responderá en breve.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Formulario para responder */}
                  <div className="mt-auto">
                    {activeTicket.estado !== 'cerrado' && activeTicket.estado !== 'resuelto' && (
                      <form onSubmit={handleSubmitResponse} className="mt-4">
                        <label htmlFor="response-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <FaCommentAlt className="mr-2 inline" />
                          Añadir respuesta
                        </label>
                        <textarea
                          id="response-message"
                          rows="3"
                          value={responseMessage}
                          onChange={(e) => setResponseMessage(e.target.value)}
                          placeholder="Escribe tu respuesta..."
                          className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-primary mb-3"
                          required
                        />
                        <div className="flex justify-end">
                          <button 
                            type="submit" 
                            disabled={loading || !responseMessage.trim()}
                            className="button-modern button-primary"
                          >
                            {loading ? (
                              <><FaSpinner className="animate-spin mr-2" /> Enviando...</>
                            ) : (
                              <>Enviar respuesta</>
                            )}
                          </button>
                        </div>
                      </form>
                    )}

                    {(activeTicket.estado === 'cerrado' || activeTicket.estado === 'resuelto') && (
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                        <p className="text-gray-500 dark:text-gray-400 mb-3">
                          Este ticket está {activeTicket.estado === 'cerrado' ? 'cerrado' : 'resuelto'} y no se pueden añadir más respuestas.
                        </p>
                        <button
                          onClick={() => {
                            setActiveTab('new');
                            setShowNewForm(true);
                            setActiveTicket(null);
                            // Pre-rellenar el asunto con "Re: " + asunto anterior
                            setFormData(prev => ({
                              ...prev,
                              subject: `Re: ${activeTicket.asunto}`
                            }));
                          }}
                          className="button-modern button-secondary"
                        >
                          Crear nuevo ticket
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft h-full flex flex-col items-center justify-center p-10 text-center">
                <FaTicketAlt className="text-5xl text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  Selecciona un ticket
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                  Selecciona un ticket de soporte de la lista para ver los detalles y responder,
                  o crea uno nuevo si necesitas ayuda.
                </p>
                <button
                  onClick={() => {
                    setActiveTab('new');
                    setShowNewForm(true);
                  }}
                  className="button-modern button-primary"
                >
                  <FaPlus className="mr-2" /> Crear nuevo ticket
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Formulario nuevo ticket */}
      {showNewForm && activeTab === 'new' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft overflow-hidden">
          <div className="p-4 md:p-6">
            <div className="flex items-center mb-6">
              <button
                onClick={() => {
                  setShowNewForm(false);
                  setActiveTab('tickets');
                }}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mr-3"
              >
                <FaArrowLeft />
              </button>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Crear nuevo ticket de soporte
              </h2>
            </div>

            <form onSubmit={handleSubmitNewTicket} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Asunto */}
                <div className="col-span-2">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Asunto
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Describe brevemente tu consulta"
                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-primary"
                    required
                  />
                </div>

                {/* Departamento */}
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Departamento
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-primary"
                  >
                    <option value="general">General</option>
                    <option value="ventas">Ventas</option>
                    <option value="tecnico">Soporte técnico</option>
                    <option value="facturacion">Facturación</option>
                    <option value="envios">Envíos y logística</option>
                  </select>
                </div>

                {/* Prioridad */}
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Prioridad
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-primary"
                  >
                    <option value="baja">Baja</option>
                    <option value="normal">Normal</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>

                {/* Referencia del pedido (opcional) */}
                <div className="col-span-2">
                  <label htmlFor="orderRef" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Referencia del pedido (si aplica)
                  </label>
                  <input
                    type="text"
                    id="orderRef"
                    name="orderRef"
                    value={formData.orderRef}
                    onChange={handleInputChange}
                    placeholder="Número de pedido (opcional)"
                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-primary"
                  />
                </div>

                {/* Mensaje */}
                <div className="col-span-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Describe tu problema o consulta con detalles para que podamos ayudarte mejor"
                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
              </div>

              {/* Botón de envío */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !formData.message.trim()}
                  className="button-modern button-primary"
                >
                  {loading ? (
                    <><FaSpinner className="animate-spin mr-2" /> Enviando...</>
                  ) : (
                    <>Enviar ticket</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Información de contacto */}
      {activeTab === 'contact' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Información de contacto
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Horario de atención</h3>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex justify-between">
                    <span>Lunes a Viernes</span>
                    <span className="font-medium">9:00 - 18:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sábados</span>
                    <span className="font-medium">10:00 - 14:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Domingos y festivos</span>
                    <span className="font-medium">Cerrado</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Teléfono de atención</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    <a href="tel:+34911234567" className="text-primary dark:text-primary-light">+34 911 23 45 67</a>
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Correo electrónico</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    <a href="mailto:soporte@cazaofertas.com" className="text-primary dark:text-primary-light">soporte@cazaofertas.com</a>
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Dirección</h3>
                  <address className="not-italic text-gray-700 dark:text-gray-300">
                    CazaOfertas S.L.<br />
                    Calle del Comercio, 21<br />
                    28001 Madrid, España
                  </address>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportPage;
