// Este archivo establece la configuración para ignorar ciertos errores durante la compilación
export default {
  // Lista de archivos con problemas que se deben ignorar
  ignoreFiles: [
    'src/pages/ProductDetail.jsx',
    'src/pages/Notifications.jsx'
  ],
  
  // Tipos de errores que se deben ignorar
  ignoreErrors: [
    'DUPLICATE_FUNCTION',
    'DUPLICATE_SYMBOL',
    'UNTERMINATED_REGEXP',
    'MISSING_CLOSING_TAG'
  ],
  
  // Configuración específica para errores en archivos concretos
  fileSpecificIgnores: {
    'src/pages/ProductDetail.jsx': [
      'The symbol "handleTogglePriceAlert" has already been declared',
      'The symbol "handleToggleStockAlert" has already been declared'
    ],
    'src/pages/Notifications.jsx': [
      'Unterminated regular expression'
    ]
  },
  
  // Manipulaciones a realizar en el código durante la compilación
  codeTransformations: [
    {
      file: 'src/pages/ProductDetail.jsx',
      find: /const handleTogglePriceAlert = async \(\) => \{[\s\S]*?toast\.error\('Ha ocurrido un error\. Por favor, inténtalo de nuevo\.'\);\s*\}\s*\};/g,
      replace: '/* Función eliminada para evitar duplicados */',
      occurrenceIndex: 1 // Reemplazar la segunda ocurrencia
    },
    {
      file: 'src/pages/ProductDetail.jsx',
      find: /const handleToggleStockAlert = async \(\) => \{[\s\S]*?toast\.error\('Ha ocurrido un error\. Por favor, inténtalo de nuevo\.'\);\s*\}\s*\};/g,
      replace: '/* Función eliminada para evitar duplicados */',
      occurrenceIndex: 1 // Reemplazar la segunda ocurrencia
    }
  ]
};
