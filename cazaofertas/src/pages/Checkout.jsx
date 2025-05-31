import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaShoppingCart, 
  FaArrowLeft, 
  FaCreditCard, 
  FaCcPaypal, 
  FaLock, 
  FaMoneyBillWave,
  FaTags,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../context/NotificationContext';
import NotificationService from '../services/notificationService';

const Checkout = () => {
  const { cartItems, subtotal, clearCart } = useShoppingCart();
  const { isAuthenticated, user } = useAuth();
  const { createNotification } = useNotifications();
  const navigate = useNavigate();
  
  const [activePaymentMethod, setActivePaymentMethod] = useState('creditCard');
  const [currentStep, setCurrentStep] = useState('cart'); // cart, shipping, payment, confirmation
  const [paymentInstallments, setPaymentInstallments] = useState(1);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.nombre_usuario || '',
    email: user?.email || '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  
  const handleShippingInfoChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePaymentInfoChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };
  
  const shippingFee = 4.99;
  const totalBeforeDiscount = subtotal + shippingFee;
  const totalAfterDiscount = totalBeforeDiscount - discount;
  
  const handleCouponApply = () => {
    // Simulamos la validación de cupones (en producción se haría una llamada a la API)
    if (couponCode.toUpperCase() === 'CAZAOFERTAS10') {
      setDiscount(subtotal * 0.1); // 10% descuento
      setCouponApplied(true);
    } else if (couponCode.toUpperCase() === 'WELCOME') {
      setDiscount(5); // 5€ de descuento
      setCouponApplied(true);
    } else {
      alert('Cupón no válido');
    }
  };
  
  const nextStep = () => {
    if (currentStep === 'cart') {
      setCurrentStep('shipping');
    } else if (currentStep === 'shipping') {
      // Validación simple
      if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode) {
        alert('Por favor, completa todos los campos obligatorios');
        return;
      }
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      processPayment();
    }
  };
  
  const prevStep = () => {
    if (currentStep === 'shipping') {
      setCurrentStep('cart');
    } else if (currentStep === 'payment') {
      setCurrentStep('shipping');
    }
  };
    const processPayment = () => {
    // Simulación de procesamiento de pago
    setPaymentProcessing(true);
    
    setTimeout(async () => {
      setPaymentProcessing(false);
      
      // 90% probabilidad de éxito
      if (Math.random() > 0.1) {
        setPaymentSuccess(true);
        setCurrentStep('confirmation');
        
        // Crear un ID de pedido simulado
        const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        // Crear notificación de pedido realizado con éxito
        if (user) {
          try {
            // Crear una estructura de pedido para la notificación
            const order = {
              id: orderId,
              total: totalAfterDiscount,
              items: cartItems,
              shipping: shippingInfo,
              payment: {
                method: activePaymentMethod,
                installments: paymentInstallments
              },
              date: new Date().toISOString()
            };
            
            // Enviar notificación de orden creada
            await NotificationService.notifyOrderCreated(user.id, order);
            
            // Enviar notificación de pago confirmado
            await NotificationService.notifyPaymentConfirmed(user.id, order);
          } catch (error) {
            console.error("Error al crear notificaciones:", error);
          }
        }
        
        clearCart();
      } else {
        setPaymentError(true);
        
        // Notificación de error en el pago
        if (user) {
          try {
            // Crear una estructura de pedido para la notificación
            const order = {
              id: `ORD-FAIL-${Date.now()}`,
              total: totalAfterDiscount,
              payment: {
                method: activePaymentMethod
              }
            };
            
            // Enviar notificación de fallo en el pago
            await NotificationService.notifyPaymentFailed(
              user.id, 
              order, 
              'La transacción fue rechazada por la entidad bancaria'
            );
          } catch (error) {
            console.error("Error al crear notificación de fallo:", error);
          }
        }
      }
    }, 2000);
  };
  
  if (cartItems.length === 0 && currentStep === 'cart') {
    return (
      <div className="min-h-screen pt-24 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <FaShoppingCart className="text-gray-600 text-5xl mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">Tu carrito está vacío</h1>
            <p className="text-gray-400 mb-8">Parece que aún no has añadido productos a tu carrito</p>
            <Link
              to="/ofertas"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Explorar ofertas
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
            <Link to="/" className="hover:text-indigo-400">Inicio</Link>
            <span>/</span>
            <span className="text-indigo-400">Checkout</span>
          </div>
          
          {/* Steps progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              <div className={`flex flex-col items-center ${currentStep === 'cart' ? 'text-indigo-400' : currentStep !== 'cart' ? 'text-green-500' : 'text-gray-500'}`}>
                <div className={`w-10 h-10 flex items-center justify-center rounded-full mb-2 ${currentStep === 'cart' ? 'bg-indigo-600' : currentStep !== 'cart' ? 'bg-green-600' : 'bg-gray-700'}`}>
                  1
                </div>
                <span className="text-xs">Carrito</span>
              </div>
              <div className={`flex-1 h-1 mx-2 ${currentStep !== 'cart' ? 'bg-green-600' : 'bg-gray-700'}`}></div>
              <div className={`flex flex-col items-center ${currentStep === 'shipping' ? 'text-indigo-400' : currentStep === 'payment' || currentStep === 'confirmation' ? 'text-green-500' : 'text-gray-500'}`}>
                <div className={`w-10 h-10 flex items-center justify-center rounded-full mb-2 ${currentStep === 'shipping' ? 'bg-indigo-600' : currentStep === 'payment' || currentStep === 'confirmation' ? 'bg-green-600' : 'bg-gray-700'}`}>
                  2
                </div>
                <span className="text-xs">Envío</span>
              </div>
              <div className={`flex-1 h-1 mx-2 ${currentStep === 'payment' || currentStep === 'confirmation' ? 'bg-green-600' : 'bg-gray-700'}`}></div>
              <div className={`flex flex-col items-center ${currentStep === 'payment' ? 'text-indigo-400' : currentStep === 'confirmation' ? 'text-green-500' : 'text-gray-500'}`}>
                <div className={`w-10 h-10 flex items-center justify-center rounded-full mb-2 ${currentStep === 'payment' ? 'bg-indigo-600' : currentStep === 'confirmation' ? 'bg-green-600' : 'bg-gray-700'}`}>
                  3
                </div>
                <span className="text-xs">Pago</span>
              </div>
              <div className={`flex-1 h-1 mx-2 ${currentStep === 'confirmation' ? 'bg-green-600' : 'bg-gray-700'}`}></div>
              <div className={`flex flex-col items-center ${currentStep === 'confirmation' ? 'text-green-500' : 'text-gray-500'}`}>
                <div className={`w-10 h-10 flex items-center justify-center rounded-full mb-2 ${currentStep === 'confirmation' ? 'bg-green-600' : 'bg-gray-700'}`}>
                  4
                </div>
                <span className="text-xs">Confirmación</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content - changes based on step */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                {/* Cart items step */}
                {currentStep === 'cart' && (
                  <div>
                    <div className="p-6 border-b border-gray-700">
                      <h2 className="text-xl font-semibold text-white flex items-center">
                        <FaShoppingCart className="mr-2" /> 
                        Tu Carrito
                      </h2>
                    </div>
                    <div className="p-6">
                      {cartItems.map((item, index) => (
                        <div key={item.id} className={`flex py-4 ${index !== cartItems.length - 1 ? 'border-b border-gray-700' : ''}`}>
                          <div className="w-20 h-20 flex-shrink-0 bg-gray-700 rounded overflow-hidden">
                            <img 
                              src={item.image_url} 
                              alt={item.title} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://via.placeholder.com/80?text=${encodeURIComponent(item.title.charAt(0))}`;
                              }}
                            />
                          </div>
                          <div className="ml-4 flex-grow">
                            <h3 className="text-white font-medium">{item.title}</h3>
                            <p className="text-sm text-gray-400">{item.store}</p>
                            <div className="flex justify-between items-end mt-2">
                              <div className="text-sm text-gray-400">
                                {formatPrice(item.current_price)} x {item.quantity}
                              </div>
                              <div className="text-indigo-400 font-semibold">
                                {formatPrice(item.current_price * item.quantity)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Shipping info step */}
                {currentStep === 'shipping' && (
                  <div>
                    <div className="p-6 border-b border-gray-700">
                      <h2 className="text-xl font-semibold text-white">
                        Información de Envío
                      </h2>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            Nombre completo *
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            value={shippingInfo.fullName}
                            onChange={handleShippingInfoChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            required
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            Email *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={shippingInfo.email}
                            onChange={handleShippingInfoChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            required
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            Dirección *
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={shippingInfo.address}
                            onChange={handleShippingInfoChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            Ciudad *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={shippingInfo.city}
                            onChange={handleShippingInfoChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            Código postal *
                          </label>
                          <input
                            type="text"
                            name="postalCode"
                            value={shippingInfo.postalCode}
                            onChange={handleShippingInfoChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            required
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            Teléfono
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={shippingInfo.phone}
                            onChange={handleShippingInfoChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Payment step */}
                {currentStep === 'payment' && (
                  <div>
                    <div className="p-6 border-b border-gray-700">
                      <h2 className="text-xl font-semibold text-white">
                        Método de Pago
                      </h2>
                    </div>
                    <div className="p-6">
                      {/* Payment method selection */}
                      <div className="flex flex-wrap gap-4 mb-6">
                        <button
                          type="button"
                          onClick={() => setActivePaymentMethod('creditCard')}
                          className={`flex items-center p-4 rounded-lg border ${
                            activePaymentMethod === 'creditCard' 
                              ? 'border-indigo-500 bg-indigo-900/30' 
                              : 'border-gray-700 bg-gray-800'
                          }`}
                        >
                          <FaCreditCard className={`text-xl mr-2 ${
                            activePaymentMethod === 'creditCard' ? 'text-indigo-400' : 'text-gray-400'
                          }`} />
                          <span className={activePaymentMethod === 'creditCard' ? 'text-white' : 'text-gray-300'}>
                            Tarjeta de crédito
                          </span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setActivePaymentMethod('paypal')}
                          className={`flex items-center p-4 rounded-lg border ${
                            activePaymentMethod === 'paypal' 
                              ? 'border-indigo-500 bg-indigo-900/30' 
                              : 'border-gray-700 bg-gray-800'
                          }`}
                        >
                          <FaCcPaypal className={`text-xl mr-2 ${
                            activePaymentMethod === 'paypal' ? 'text-indigo-400' : 'text-gray-400'
                          }`} />
                          <span className={activePaymentMethod === 'paypal' ? 'text-white' : 'text-gray-300'}>
                            PayPal
                          </span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setActivePaymentMethod('financing')}
                          className={`flex items-center p-4 rounded-lg border ${
                            activePaymentMethod === 'financing' 
                              ? 'border-indigo-500 bg-indigo-900/30' 
                              : 'border-gray-700 bg-gray-800'
                          }`}
                        >
                          <FaMoneyBillWave className={`text-xl mr-2 ${
                            activePaymentMethod === 'financing' ? 'text-indigo-400' : 'text-gray-400'
                          }`} />
                          <span className={activePaymentMethod === 'financing' ? 'text-white' : 'text-gray-300'}>
                            Financiación
                          </span>
                        </button>
                      </div>
                      
                      {/* Credit card form */}
                      {activePaymentMethod === 'creditCard' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                              Número de tarjeta
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                name="cardNumber"
                                placeholder="XXXX XXXX XXXX XXXX"
                                value={paymentInfo.cardNumber}
                                onChange={handlePaymentInfoChange}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-4 pr-10 py-2 text-white focus:outline-none focus:border-indigo-500"
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <FaCreditCard className="text-gray-500" />
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                              Titular de la tarjeta
                            </label>
                            <input
                              type="text"
                              name="cardHolder"
                              placeholder="Nombre como aparece en la tarjeta"
                              value={paymentInfo.cardHolder}
                              onChange={handlePaymentInfoChange}
                              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">
                                Fecha de caducidad
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  name="expiryDate"
                                  placeholder="MM/YY"
                                  value={paymentInfo.expiryDate}
                                  onChange={handlePaymentInfoChange}
                                  className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-4 pr-10 py-2 text-white focus:outline-none focus:border-indigo-500"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <FaCalendarAlt className="text-gray-500" />
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">
                                CVV
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  name="cvv"
                                  placeholder="XXX"
                                  value={paymentInfo.cvv}
                                  onChange={handlePaymentInfoChange}
                                  className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-4 pr-10 py-2 text-white focus:outline-none focus:border-indigo-500"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <FaLock className="text-gray-500" />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Installments */}
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                              Número de plazos
                            </label>
                            <select
                              value={paymentInstallments}
                              onChange={(e) => setPaymentInstallments(Number(e.target.value))}
                              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            >
                              <option value={1}>Pago único</option>
                              <option value={3}>3 plazos sin intereses</option>
                              <option value={6}>6 plazos con 2% interés</option>
                              <option value={12}>12 plazos con 5% interés</option>
                            </select>
                            
                            {paymentInstallments > 1 && (
                              <div className="mt-2 bg-indigo-900/30 border border-indigo-500/30 rounded-lg p-3">
                                <p className="text-sm text-gray-300">
                                  {paymentInstallments === 3 ? (
                                    <>Pagarás 3 cuotas de {formatPrice(totalAfterDiscount / 3)} sin intereses</>
                                  ) : paymentInstallments === 6 ? (
                                    <>Pagarás 6 cuotas de {formatPrice((totalAfterDiscount * 1.02) / 6)} (total: {formatPrice(totalAfterDiscount * 1.02)})</>
                                  ) : (
                                    <>Pagarás 12 cuotas de {formatPrice((totalAfterDiscount * 1.05) / 12)} (total: {formatPrice(totalAfterDiscount * 1.05)})</>
                                  )}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* PayPal */}
                      {activePaymentMethod === 'paypal' && (
                        <div className="space-y-4">
                          <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-lg p-4 text-center">
                            <FaCcPaypal className="text-4xl text-blue-400 mx-auto mb-3" />
                            <p className="text-gray-300 mb-4">
                              Serás redirigido a PayPal para completar tu compra de forma segura.
                            </p>
                            <button
                              type="button"
                              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors inline-flex items-center"
                            >
                              <FaCcPaypal className="mr-2" />
                              Pagar con PayPal
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Financing */}
                      {activePaymentMethod === 'financing' && (
                        <div className="space-y-4">
                          <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-lg p-4">
                            <h3 className="text-lg font-medium text-white mb-2">Opciones de financiación</h3>
                            <p className="text-gray-300 mb-4">
                              Elige el número de meses que mejor se adapte a tus necesidades.
                            </p>
                            
                            <div className="space-y-3">
                              <label className="flex items-center p-3 border border-gray-700 rounded-lg hover:bg-gray-700/50 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name="financing" 
                                  value="3" 
                                  checked={paymentInstallments === 3}
                                  onChange={() => setPaymentInstallments(3)}
                                  className="mr-3 text-indigo-600"
                                />
                                <div>
                                  <p className="font-medium text-white">3 meses sin intereses</p>
                                  <p className="text-sm text-gray-400">3 cuotas de {formatPrice(totalAfterDiscount / 3)}</p>
                                </div>
                              </label>
                              
                              <label className="flex items-center p-3 border border-gray-700 rounded-lg hover:bg-gray-700/50 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name="financing" 
                                  value="6" 
                                  checked={paymentInstallments === 6}
                                  onChange={() => setPaymentInstallments(6)}
                                  className="mr-3 text-indigo-600"
                                />
                                <div>
                                  <p className="font-medium text-white">6 meses (2% interés)</p>
                                  <p className="text-sm text-gray-400">6 cuotas de {formatPrice((totalAfterDiscount * 1.02) / 6)}</p>
                                </div>
                              </label>
                              
                              <label className="flex items-center p-3 border border-gray-700 rounded-lg hover:bg-gray-700/50 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name="financing" 
                                  value="12" 
                                  checked={paymentInstallments === 12}
                                  onChange={() => setPaymentInstallments(12)}
                                  className="mr-3 text-indigo-600"
                                />
                                <div>
                                  <p className="font-medium text-white">12 meses (5% interés)</p>
                                  <p className="text-sm text-gray-400">12 cuotas de {formatPrice((totalAfterDiscount * 1.05) / 12)}</p>
                                </div>
                              </label>
                              
                              <label className="flex items-center p-3 border border-gray-700 rounded-lg hover:bg-gray-700/50 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name="financing" 
                                  value="18" 
                                  checked={paymentInstallments === 18}
                                  onChange={() => setPaymentInstallments(18)}
                                  className="mr-3 text-indigo-600"
                                />
                                <div>
                                  <p className="font-medium text-white">18 meses (8% interés)</p>
                                  <p className="text-sm text-gray-400">18 cuotas de {formatPrice((totalAfterDiscount * 1.08) / 18)}</p>
                                </div>
                              </label>
                            </div>
                          </div>
                          
                          <div className="bg-gray-700/50 rounded-lg p-4">
                            <p className="text-sm text-gray-300">
                              *Financiación sujeta a aprobación. Necesitarás presentar documentación adicional para continuar con el proceso.
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* Payment error/success states */}
                      {paymentProcessing && (
                        <div className="mt-6 text-center py-4">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                          <p className="text-gray-300">Procesando tu pago...</p>
                        </div>
                      )}
                      
                      {paymentError && !paymentProcessing && (
                        <div className="mt-6 bg-red-900/30 border border-red-500/30 rounded-lg p-4 text-center">
                          <FaTimesCircle className="text-red-500 text-3xl mx-auto mb-2" />
                          <p className="text-red-300 mb-2">Error al procesar el pago</p>
                          <p className="text-sm text-gray-300">
                            Ha ocurrido un problema al procesar tu pago. Por favor, verifica los datos o intenta con otro método.
                          </p>
                          <button
                            type="button"
                            onClick={() => setPaymentError(false)}
                            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                          >
                            Intentar de nuevo
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Confirmation step */}
                {currentStep === 'confirmation' && (
                  <div>
                    <div className="p-6 border-b border-gray-700">
                      <h2 className="text-xl font-semibold text-white">
                        Pedido Confirmado
                      </h2>
                    </div>
                    <div className="p-6 text-center">
                      <div className="w-20 h-20 mx-auto bg-green-600 rounded-full flex items-center justify-center mb-6">
                        <FaCheckCircle className="text-white text-4xl" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-4">¡Gracias por tu compra!</h3>
                      
                      <p className="text-gray-300 mb-8">
                        Tu pedido ha sido procesado correctamente. Hemos enviado un email con los detalles a {shippingInfo.email}.
                      </p>
                      
                      <div className="bg-gray-700/50 rounded-lg p-6 max-w-md mx-auto text-left mb-8">
                        <h4 className="font-medium text-white mb-3">Resumen del pedido:</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Número de pedido:</span>
                            <span className="text-white">#CZ-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Fecha:</span>
                            <span className="text-white">{new Date().toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Total:</span>
                            <span className="text-white">{formatPrice(totalAfterDiscount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Método de pago:</span>
                            <span className="text-white">
                              {activePaymentMethod === 'creditCard' ? 'Tarjeta de crédito' : 
                               activePaymentMethod === 'paypal' ? 'PayPal' : 'Financiación'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link
                          to="/"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                        >
                          Volver al inicio
                        </Link>
                        <Link
                          to="/ofertas"
                          className="bg-transparent border border-indigo-500 text-indigo-400 hover:bg-indigo-500/10 font-medium py-3 px-6 rounded-lg transition-colors"
                        >
                          Ver más ofertas
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Order summary */}
            {currentStep !== 'confirmation' && (
              <div className="lg:col-span-1">
                <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden sticky top-24">
                  <div className="p-6 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-white">
                      Resumen del pedido
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Subtotal</span>
                        <span className="text-white">{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Gastos de envío</span>
                        <span className="text-white">{formatPrice(shippingFee)}</span>
                      </div>
                      
                      {couponApplied && (
                        <div className="flex justify-between text-green-400">
                          <span>Descuento</span>
                          <span>-{formatPrice(discount)}</span>
                        </div>
                      )}
                      
                      <div className="border-t border-gray-700 pt-4 flex justify-between font-semibold">
                        <span className="text-white">Total</span>
                        <span className="text-xl text-indigo-400">{formatPrice(totalAfterDiscount)}</span>
                      </div>
                      
                      {/* Cupón de descuento */}
                      {!couponApplied && (
                        <div className="pt-4">
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            Código promocional
                          </label>
                          <div className="flex">
                            <input
                              type="text"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                              className="flex-grow bg-gray-700 border border-gray-600 rounded-l-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                              placeholder="CAZAOFERTAS10"
                            />
                            <button
                              type="button"
                              onClick={handleCouponApply}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-r-lg transition-colors"
                            >
                              <FaTags />
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Botones de navegación */}
                      <div className="pt-6 space-y-3">
                        <button
                          type="button"
                          onClick={nextStep}
                          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3 px-4 rounded-lg transition-all"
                        >
                          {currentStep === 'cart' ? 'Proceder al envío' :
                           currentStep === 'shipping' ? 'Proceder al pago' :
                           currentStep === 'payment' ? 'Realizar pedido' : ''}
                        </button>
                        
                        {currentStep !== 'cart' && (
                          <button
                            type="button"
                            onClick={prevStep}
                            className="w-full bg-transparent border border-gray-600 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                          >
                            <FaArrowLeft className="mr-2" />
                            Volver
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
