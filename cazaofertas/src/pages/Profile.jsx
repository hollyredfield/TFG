import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaEnvelope, FaCheck, FaSpinner, FaExclamationCircle, FaCamera, FaClock, FaMapMarkerAlt, FaTags, FaBell, FaLock, FaUpload, FaEdit, FaInfoCircle, FaLink, FaTwitter, FaTelegram, FaStar } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useProfileStats } from '../hooks/useProfileStats';
import { supabase } from '../services/supabase';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, profile, setProfile } = useAuth();
  const { stats, loading: loadingStats } = useProfileStats(user?.id);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const [profileData, setProfileData] = useState({
    nombre_usuario: '',
    bio: '',
    sitio_web: '',
    ubicacion: '',
    intereses: [],
    redes_sociales: {
      twitter: '',
      telegram: ''
    },
    preferencias: {
      notificaciones_email: true,
      notificaciones_push: true,
      perfil_publico: true
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    if (profile) {
      setProfileData(currentData => {
        // Initialize with the structure of currentData, ensuring only defined fields are populated
        const newFormData = {
          nombre_usuario: profile.nombre_usuario !== undefined ? profile.nombre_usuario : currentData.nombre_usuario,
          bio: profile.bio !== undefined ? profile.bio : currentData.bio,
          sitio_web: profile.sitio_web !== undefined ? profile.sitio_web : currentData.sitio_web,
          ubicacion: profile.ubicacion !== undefined ? profile.ubicacion : currentData.ubicacion,
          intereses: profile.intereses !== undefined ? profile.intereses : currentData.intereses, // Assumes 'intereses' is an editable field
          redes_sociales: {
            twitter: profile.redes_sociales?.twitter !== undefined ? profile.redes_sociales.twitter : currentData.redes_sociales.twitter,
            telegram: profile.redes_sociales?.telegram !== undefined ? profile.redes_sociales.telegram : currentData.redes_sociales.telegram,
          },
          preferencias: {
            notificaciones_email: profile.preferencias?.notificaciones_email !== undefined ? profile.preferencias.notificaciones_email : currentData.preferencias.notificaciones_email,
            notificaciones_push: profile.preferencias?.notificaciones_push !== undefined ? profile.preferencias.notificaciones_push : currentData.preferencias.notificaciones_push,
            perfil_publico: profile.preferencias?.perfil_publico !== undefined ? profile.preferencias.perfil_publico : currentData.preferencias.perfil_publico,
          },
        };
        return newFormData;
      });
    }
  }, [profile]);

  useEffect(() => {
    // Efecto para hacer desaparecer el mensaje de éxito después de 3 segundos
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Math.random().toString(36).slice(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const avatarUrl = `${supabase.supabaseUrl}/storage/v1/object/public/avatars/${fileName}`;
      
      const { error: updateError } = await supabase
        .from('perfiles_usuario')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile(prev => ({
        ...prev,
        avatar_url: avatarUrl
      }));

      toast.success('Foto de perfil actualizada correctamente');
    } catch (error) {
      console.error('Error al actualizar el avatar:', error);
      toast.error('No se pudo actualizar la foto de perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setProfileData(prev => ({
        ...prev,
        preferencias: {
          ...prev.preferencias,
          [name.replace('preferencias.', '')]: checked
        }
      }));
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Construct the object with only the fields that should be updated
      const updateData = {
        nombre_usuario: profileData.nombre_usuario,
        bio: profileData.bio,
        sitio_web: profileData.sitio_web,
        ubicacion: profileData.ubicacion,
        intereses: profileData.intereses, // Assuming 'intereses' is an array of strings or simple values
        redes_sociales: {
          twitter: profileData.redes_sociales.twitter,
          telegram: profileData.redes_sociales.telegram,
        },
        preferencias: {
          notificaciones_email: profileData.preferencias.notificaciones_email,
          notificaciones_push: profileData.preferencias.notificaciones_push,
          perfil_publico: profileData.preferencias.perfil_publico,
        },
        // Ensure non-updatable fields like id, user_id, email, created_at, avatar_url are NOT included
      };

      const { error } = await supabase
        .from('perfiles_usuario')
        .update(updateData) // Use the cleaned updateData object
        .eq('id', user.id);
      
      if (error) throw error;
      
      setProfile(prev => ({
        ...prev,
        ...profileData
      }));
      
      setIsEditing(false);
      toast.success('Perfil actualizado correctamente');
    } catch (err) {
      console.error('Error actualizando el perfil:', err);
      setError('No se pudo actualizar el perfil. Por favor, inténtalo de nuevo más tarde.');
      toast.error('No se pudo actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded-lg mb-4">
          <div className="flex items-center">
            <FaExclamationCircle className="mr-2" />
            <p>Debes iniciar sesión para acceder a tu perfil</p>
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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mi Perfil</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Administra tu información personal y preferencias
          </p>
        </div>
        {!isEditing && (
          <div className="mt-4 lg:mt-0">
            <button 
              onClick={() => setIsEditing(true)}
              className="button-modern button-secondary inline-flex items-center"
            >
              <FaEdit className="mr-2" /> Editar perfil
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6 flex items-start">
          <FaExclamationCircle className="mt-1 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg mb-6 flex items-center">
          <FaCheck className="mr-2" />
          <p>{successMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info perfil */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center mb-8">
              <div className="relative mb-4 md:mb-0 md:mr-8">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaUser className="text-gray-400 text-4xl" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <button 
                    onClick={handleAvatarClick} 
                    className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow-md hover:bg-primary-dark"
                    disabled={isLoading}
                  >
                    {isLoading ? <FaSpinner className="animate-spin" /> : <FaCamera />}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                  {profile?.nombre_usuario || user?.email?.split('@')[0]}
                </h2>
                <div className="flex items-center text-gray-500 dark:text-gray-400 mb-3">
                  <FaEnvelope className="mr-2" />
                  <span>{user?.email}</span>
                </div>
                {profile?.bio && !isEditing && (
                  <p className="text-gray-600 dark:text-gray-300">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre de usuario
                  </label>
                  <input
                    type="text"
                    name="nombre_usuario"
                    value={profileData.nombre_usuario}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Tu nombre de usuario"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Biografía
                  </label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Cuéntanos un poco sobre ti..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    name="ubicacion"
                    value={profileData.ubicacion}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Tu ubicación"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sitio Web
                  </label>
                  <input
                    type="url"
                    name="sitio_web"
                    value={profileData.sitio_web}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://tu-sitio-web.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Twitter
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 bg-gray-100 dark:bg-gray-600 border border-r-0 border-gray-300 dark:border-gray-500 rounded-l-md text-gray-500 dark:text-gray-400">
                        <FaTwitter />
                      </span>
                      <input
                        type="text"
                        name="redes_sociales.twitter"
                        value={profileData.redes_sociales.twitter}
                        onChange={handleChange}
                        className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-r-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="@usuario"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Telegram
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 bg-gray-100 dark:bg-gray-600 border border-r-0 border-gray-300 dark:border-gray-500 rounded-l-md text-gray-500 dark:text-gray-400">
                        <FaTelegram />
                      </span>
                      <input
                        type="text"
                        name="redes_sociales.telegram"
                        value={profileData.redes_sociales.telegram}
                        onChange={handleChange}
                        className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="@usuario"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Preferencias</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        name="preferencias.notificaciones_email"
                        checked={profileData.preferencias.notificaciones_email}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div>
                        <p className="font-medium">Notificaciones por email</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Recibe alertas de ofertas y actualizaciones en tu correo</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        name="preferencias.notificaciones_push"
                        checked={profileData.preferencias.notificaciones_push}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div>
                        <p className="font-medium">Notificaciones push</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Recibe alertas directamente en tu navegador</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        name="preferencias.perfil_publico"
                        checked={profileData.preferencias.perfil_publico}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div>
                        <p className="font-medium">Perfil público</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Permite que otros usuarios vean tu perfil y actividad</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex space-x-4 pt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="button-modern button-primary flex items-center"
                  >
                    {isLoading && <FaSpinner className="animate-spin mr-2" />}
                    Guardar cambios
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="button-modern button-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6 mt-8">
                {profile?.ubicacion && (
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="mt-1 mr-3 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Ubicación</p>
                      <p className="text-gray-900 dark:text-white">{profile.ubicacion}</p>
                    </div>
                  </div>
                )}
                
                {profile?.sitio_web && (
                  <div className="flex items-start">
                    <FaLink className="mt-1 mr-3 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Sitio Web</p>
                      <a 
                        href={profile.sitio_web} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-dark dark:hover:text-primary-light"
                      >
                        {profile.sitio_web}
                      </a>
                    </div>
                  </div>
                )}
                
                {profile?.redes_sociales && (Object.values(profile.redes_sociales).some(val => val)) && (
                  <div className="flex items-start">
                    <FaUser className="mt-1 mr-3 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Redes Sociales</p>
                      <div className="flex space-x-3 mt-1">
                        {profile.redes_sociales.twitter && (
                          <a 
                            href={`https://twitter.com/${profile.redes_sociales.twitter.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FaTwitter className="text-xl" />
                          </a>
                        )}
                        {profile.redes_sociales.telegram && (
                          <a 
                            href={`https://t.me/${profile.redes_sociales.telegram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FaTelegram className="text-xl" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {profile?.preferencias && (
                  <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Preferencias</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-3 ${
                          profile.preferencias.notificaciones_email ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`} />
                        <span className="text-gray-700 dark:text-gray-300">
                          Notificaciones por email {profile.preferencias.notificaciones_email ? 'activadas' : 'desactivadas'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-3 ${
                          profile.preferencias.notificaciones_push ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`} />
                        <span className="text-gray-700 dark:text-gray-300">
                          Notificaciones push {profile.preferencias.notificaciones_push ? 'activadas' : 'desactivadas'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-3 ${
                          profile.preferencias.perfil_publico ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`} />
                        <span className="text-gray-700 dark:text-gray-300">
                          Perfil {profile.preferencias.perfil_publico ? 'público' : 'privado'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Acciones rápidas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/mis-ofertas" className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 rounded-lg flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-full mb-3">
                  <FaTags className="text-blue-600 dark:text-blue-400 text-xl" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white">Mis Ofertas</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Gestiona tus ofertas publicadas</p>
              </Link>
              
              <Link to="/guardadas" className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 rounded-lg flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-full mb-3">
                  <FaStar className="text-purple-600 dark:text-purple-400 text-xl" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white">Ofertas Guardadas</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Revisa tus ofertas favoritas</p>
              </Link>
              
              <Link to="/notificaciones" className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/30 rounded-lg flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-full mb-3">
                  <FaBell className="text-amber-600 dark:text-amber-400 text-xl" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white">Notificaciones</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Centro de notificaciones</p>
              </Link>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link
                to="/recuperar-password" // Changed from /cambiar-password
                className="button-modern button-secondary w-full inline-flex items-center justify-center"
              >
                <FaLock className="mr-2" />
                Cambiar contraseña
              </Link>
            </div>          </div>
        </div>
        
        {/* Panel derecho con stats */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Estadísticas</h3>
            
            {loadingStats ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin h-8 w-8 border-3 border-primary rounded-full border-t-transparent"></div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Ofertas publicadas</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{stats?.ofertas_count || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (stats?.ofertas_count || 0) / 10 * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Ofertas guardadas</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{stats?.guardadas_count || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (stats?.guardadas_count || 0) / 20 * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Comentarios</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{stats?.comentarios_count || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (stats?.comentarios_count || 0) / 30 * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                {stats?.fecha_registro && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <FaClock className="mr-2" />
                    <span>
                      Miembro desde {new Date(stats.fecha_registro).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-xl p-6 relative overflow-hidden">
            <FaInfoCircle className="absolute top-3 right-3 text-primary/50 dark:text-primary-light/50" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">¿Necesitas ayuda?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Si tienes algún problema con tu cuenta o necesitas asistencia, no dudes en contactarnos.
            </p>
            <Link to="/contacto" className="button-modern button-primary w-full">
              Contactar soporte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;