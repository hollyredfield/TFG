import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaExclamationCircle, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    acceptTerms: false,
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Validación en tiempo real si el campo ha sido tocado
    if (touched[name]) {
      validateField(name, type === 'checkbox' ? checked : value);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    
    // Validar el campo cuando pierde el foco
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let fieldErrors = { ...errors };
    
    switch (name) {
      case 'email':
        if (!value) {
          fieldErrors.email = 'El email es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          fieldErrors.email = 'El email no es válido';
        } else {
          delete fieldErrors.email;
        }
        break;
        
      case 'password':
        if (!value) {
          fieldErrors.password = 'La contraseña es obligatoria';
        } else if (value.length < 6) {
          fieldErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        } else {
          delete fieldErrors.password;
        }
        
        // Validar también confirmPassword si ya ha sido tocado
        if (touched.confirmPassword) {
          if (value !== formData.confirmPassword) {
            fieldErrors.confirmPassword = 'Las contraseñas no coinciden';
          } else {
            delete fieldErrors.confirmPassword;
          }
        }
        break;
        
      case 'confirmPassword':
        if (!value) {
          fieldErrors.confirmPassword = 'Debes confirmar la contraseña';
        } else if (value !== formData.password) {
          fieldErrors.confirmPassword = 'Las contraseñas no coinciden';
        } else {
          delete fieldErrors.confirmPassword;
        }
        break;
        
      case 'username':
        if (!value) {
          fieldErrors.username = 'El nombre de usuario es obligatorio';
        } else if (value.length < 3) {
          fieldErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          fieldErrors.username = 'El nombre de usuario solo puede contener letras, números y guiones bajos';
        } else {
          delete fieldErrors.username;
        }
        break;
        
      case 'acceptTerms':
        if (!value) {
          fieldErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
        } else {
          delete fieldErrors.acceptTerms;
        }
        break;
        
      default:
        break;
    }
    
    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};
    let newTouched = {};
    
    // Marcar todos los campos como tocados
    Object.keys(formData).forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);
    
    // Validar email
    if (!formData.email) {
      newErrors.email = 'El email es obligatorio';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
      isValid = false;
    }
    
    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }
    
    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Debes confirmar la contraseña';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }
    
    // Validar nombre de usuario
    if (!formData.username) {
      newErrors.username = 'El nombre de usuario es obligatorio';
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'El nombre de usuario solo puede contener letras, números y guiones bajos';
      isValid = false;
    }
    
    // Validar términos y condiciones
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setServerError('');
    
    try {
      console.log('Intentando registro con:', { 
        email: formData.email, 
        username: formData.username,
        passwordLength: formData.password?.length || 0
      });
      
      const result = await register(
        formData.email, 
        formData.password, 
        formData.username
      );
      
      console.log('Resultado de registro:', { 
        success: !result.error,
        hasData: !!result.data,
        hasMessage: !!result.message
      });
      
      if (result.error) {
        console.error('Error de registro:', result.error);
        setServerError(result.error.message);
      } else {
        // Registro exitoso con verificación por correo electrónico
        console.log('Mostrando éxito de registro');
        setRegistrationSuccess(true);
        setSuccessMessage(result.message || 'Te hemos enviado un correo de verificación. Por favor, revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.');
        
        // Limpiar el formulario
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          username: '',
          acceptTerms: false,
        });
        
        // Asegurarnos de que la interfaz se actualiza
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
      }
    } catch (error) {
      console.error('Error en registro (excepción):', error);
      setServerError(error.message || 'Ha ocurrido un error durante el registro. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-custom py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-primary py-4 px-6">
          <h1 className="text-white text-xl font-bold text-center">Crea tu cuenta en CazaOfertas</h1>
        </div>
        
        <div className="p-6">          {/* Mensaje de éxito */}
          {registrationSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-start">
              <FaCheckCircle className="mr-2 mt-1 flex-shrink-0 text-green-500" size={20} />
              <div>
                <p className="font-medium text-lg">¡Registro exitoso!</p>
                <p className="my-2">{successMessage}</p>
                <div className="mt-3 flex flex-col space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-300 rounded">
                    <p className="text-sm text-gray-700 mb-2">
                      ¿No has recibido el correo de verificación?
                    </p>
                    <Link 
                      to="/login" 
                      state={{ showResendOption: true, resendEmail: formData.email }}
                      className="w-full inline-block text-center text-white bg-primary hover:bg-opacity-90 py-2 px-4 rounded-md text-sm font-medium"
                    >
                      Reenviar correo de verificación
                    </Link>
                  </div>
                  <p className="mt-2 text-center">
                    <Link to="/login" className="text-primary hover:underline">
                      Volver a la página de inicio de sesión
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}          {/* Mensaje de error */}
          {serverError && !registrationSuccess && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-start">
              <FaExclamationCircle className="mr-2 mt-1 flex-shrink-0" size={20} />
              <div>
                <p className="font-medium">Error al registrarse</p>
                <span>{serverError}</span>
              </div>
            </div>
          )}
          
          {/* Formulario (solo mostrar si no hay registro exitoso) */}
          {!registrationSuccess && (
            <form onSubmit={handleSubmit} noValidate>
              {/* Nombre de usuario */}
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.username ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                    placeholder="Tu nombre de usuario"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.username && touched.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>
              
              {/* Email */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                    placeholder="tu@email.com"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && touched.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              {/* Contraseña */}
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                    placeholder="Mínimo 6 caracteres"
                    disabled={isSubmitting}
                    autoComplete="new-password"
                  />
                </div>
                {errors.password && touched.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              
              {/* Confirmar Contraseña */}
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                    placeholder="Repite tu contraseña"
                    disabled={isSubmitting}
                    autoComplete="new-password"
                  />
                </div>
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
              
              {/* Términos y condiciones */}
              <div className="mb-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="acceptTerms"
                      name="acceptTerms"
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                      Acepto los <Link to="/terminos" className="text-primary hover:underline">términos y condiciones</Link> y la <Link to="/privacidad" className="text-primary hover:underline">política de privacidad</Link>
                    </label>
                    {errors.acceptTerms && touched.acceptTerms && (
                      <p className="mt-1 text-sm text-red-600">{errors.acceptTerms}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Botón de registro */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 transition-colors"
              >
                {isSubmitting && <FaSpinner className="animate-spin" />}
                {isSubmitting ? 'Registrando...' : 'Crear cuenta'}
              </button>
            </form>
          )}
          
          {/* Enlace a iniciar sesión (solo si no hay registro exitoso) */}
          {!registrationSuccess && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Inicia sesión
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;