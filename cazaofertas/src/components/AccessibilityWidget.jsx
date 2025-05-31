import React, { useState, useEffect } from 'react';
import { 
  FaUniversalAccess, 
  FaFont, 
  FaAdjust, 
  FaEye, 
  FaMoon, 
  FaSun, 
  FaTimes, 
  FaLowVision, 
  FaTextHeight
} from 'react-icons/fa';

const AccessibilityWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [settings, setSettings] = useState({
    highContrast: false,
    darkMode: false,
    largeText: false,
    dyslexicFont: false,
    reduceMotion: false,
    colorBlindMode: 'normal',
  });

  // Cargar configuración inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      try {
        const savedSettings = localStorage.getItem('accessibilitySettings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Error al cargar configuración de accesibilidad:', error);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Aplicar configuración
  useEffect(() => {
    if (!isLoaded) return;
    
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    document.documentElement.setAttribute('data-theme', settings.darkMode ? 'dark' : 'light');
    document.documentElement.setAttribute('data-high-contrast', settings.highContrast);
    document.documentElement.setAttribute('data-large-text', settings.largeText);
    document.documentElement.setAttribute('data-dyslexic-font', settings.dyslexicFont);
    document.documentElement.setAttribute('data-reduced-motion', settings.reduceMotion);
    document.documentElement.setAttribute('data-color-mode', settings.colorBlindMode);
  }, [settings, isLoaded]);

  const toggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const setColorBlindMode = (mode) => {
    setSettings(prev => ({
      ...prev,
      colorBlindMode: mode
    }));
  };

  if (!isLoaded) return null;

  return (
    <div className="fixed left-6 bottom-6 z-50">
      {/* Botón principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full p-4 shadow-xl glass-dark hover:scale-110 transition-transform duration-300"
        aria-label="Opciones de accesibilidad"
      >
        <FaUniversalAccess className="text-white text-2xl" />
      </button>

      {/* Panel de opciones */}
      <div
        className={`absolute left-0 bottom-20 w-[320px] rounded-lg overflow-hidden shadow-2xl glass-dark border border-gray-700 transition-all duration-300 transform ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white flex items-center">
            <FaUniversalAccess className="mr-2" />
            <span>Accesibilidad</span>
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-700/50"
            aria-label="Cerrar panel de accesibilidad"
          >
            <FaTimes className="text-white" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-4 space-y-4">
          {/* Modo oscuro */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {settings.darkMode ? 
                <FaMoon className="mr-3 text-xl text-indigo-400" /> : 
                <FaSun className="mr-3 text-xl text-yellow-400" />
              }
              <span className="text-gray-200">Modo oscuro</span>
            </div>
            <button
              onClick={() => toggleSetting('darkMode')}
              className={`w-12 h-6 rounded-full relative transition-colors ${
                settings.darkMode ? 'bg-indigo-600' : 'bg-gray-600'
              }`}
              aria-label="Alternar modo oscuro"
            >
              <span
                className={`absolute w-5 h-5 rounded-full bg-white shadow transition-transform transform ${
                  settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Alto contraste */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaAdjust className="mr-3 text-xl text-indigo-400" />
              <span className="text-gray-200">Alto contraste</span>
            </div>
            <button
              onClick={() => toggleSetting('highContrast')}
              className={`w-12 h-6 rounded-full relative transition-colors ${
                settings.highContrast ? 'bg-indigo-600' : 'bg-gray-600'
              }`}
              aria-label="Alternar alto contraste"
            >
              <span
                className={`absolute w-5 h-5 rounded-full bg-white shadow transition-transform transform ${
                  settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Texto grande */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaTextHeight className="mr-3 text-xl text-indigo-400" />
              <span className="text-gray-200">Texto grande</span>
            </div>
            <button
              onClick={() => toggleSetting('largeText')}
              className={`w-12 h-6 rounded-full relative transition-colors ${
                settings.largeText ? 'bg-indigo-600' : 'bg-gray-600'
              }`}
              aria-label="Alternar texto grande"
            >
              <span
                className={`absolute w-5 h-5 rounded-full bg-white shadow transition-transform transform ${
                  settings.largeText ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Fuente para dislexia */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaFont className="mr-3 text-xl text-indigo-400" />
              <span className="text-gray-200">Fuente para dislexia</span>
            </div>
            <button
              onClick={() => toggleSetting('dyslexicFont')}
              className={`w-12 h-6 rounded-full relative transition-colors ${
                settings.dyslexicFont ? 'bg-indigo-600' : 'bg-gray-600'
              }`}
              aria-label="Alternar fuente para dislexia"
            >
              <span
                className={`absolute w-5 h-5 rounded-full bg-white shadow transition-transform transform ${
                  settings.dyslexicFont ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Reducir movimiento */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaEye className="mr-3 text-xl text-indigo-400" />
              <span className="text-gray-200">Reducir movimiento</span>
            </div>
            <button
              onClick={() => toggleSetting('reduceMotion')}
              className={`w-12 h-6 rounded-full relative transition-colors ${
                settings.reduceMotion ? 'bg-indigo-600' : 'bg-gray-600'
              }`}
              aria-label="Alternar reducción de movimiento"
            >
              <span
                className={`absolute w-5 h-5 rounded-full bg-white shadow transition-transform transform ${
                  settings.reduceMotion ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Modos para daltonismo */}
          <div className="space-y-2">
            <div className="flex items-center">
              <FaLowVision className="mr-3 text-xl text-indigo-400" />
              <span className="text-gray-200">Modo para daltonismo</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setColorBlindMode('normal')}
                className={`px-3 py-2 rounded text-sm ${
                  settings.colorBlindMode === 'normal' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
                aria-label="Desactivar modo para daltonismo"
              >
                Normal
              </button>
              <button
                onClick={() => setColorBlindMode('protanopia')}
                className={`px-3 py-2 rounded text-sm ${
                  settings.colorBlindMode === 'protanopia' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
                aria-label="Activar modo para protanopia"
              >
                Protanopía
              </button>
              <button
                onClick={() => setColorBlindMode('deuteranopia')}
                className={`px-3 py-2 rounded text-sm ${
                  settings.colorBlindMode === 'deuteranopia' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
                aria-label="Activar modo para deuteranopía"
              >
                Deuteranopía
              </button>
              <button
                onClick={() => setColorBlindMode('tritanopia')}
                className={`px-3 py-2 rounded text-sm ${
                  settings.colorBlindMode === 'tritanopia' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
                aria-label="Activar modo para tritanopía"
              >
                Tritanopía
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityWidget;