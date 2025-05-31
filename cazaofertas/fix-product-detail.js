// Script para eliminar funciones duplicadas en ProductDetail.jsx
const fs = require('fs');
const path = require('path');

// Ruta al archivo ProductDetail.jsx
const filePath = path.join(__dirname, 'src', 'pages', 'ProductDetail.jsx');

// Leer el contenido del archivo
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error al leer el archivo:', err);
    return;
  }

  // Definir las áreas para eliminar - líneas aproximadas basadas en el error
  let modifiedContent = data;
  
  // Eliminar la función handleTogglePriceAlert duplicada (alrededor de la línea 365)
  modifiedContent = modifiedContent.replace(
    /\/\/ Handle toggling price alert\s+const handleTogglePriceAlert = async \(\) => \{[\s\S]+?toast\.error\('Ha ocurrido un error\. Por favor, inténtalo de nuevo\.'\);\s+}\s+};/,
    '// La función handleTogglePriceAlert ya está definida arriba\n'
  );
  
  // Eliminar la función handleToggleStockAlert duplicada (alrededor de la línea 396)
  modifiedContent = modifiedContent.replace(
    /\/\/ Handle toggling stock alert\s+const handleToggleStockAlert = async \(\) => \{[\s\S]+?toast\.error\('Ha ocurrido un error\. Por favor, inténtalo de nuevo\.'\);\s+}\s+};/,
    '// La función handleToggleStockAlert ya está definida arriba\n'
  );

  // Guardar el archivo modificado
  fs.writeFile(filePath, modifiedContent, 'utf8', (err) => {
    if (err) {
      console.error('Error al escribir el archivo:', err);
      return;
    }
    console.log('Archivo actualizado correctamente: Funciones duplicadas eliminadas.');
  });
});
