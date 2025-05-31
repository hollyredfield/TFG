const fs = require('fs');
const path = require('path');

// Rutas importantes
const rootIndexPath = path.join(__dirname, 'index.html');
const distTempIndexPath = path.join(__dirname, 'dist-temp', 'index.html');

// Definición del viewport que permite zoom
const zoomViewportTag = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />';

function updateViewportInFile(filePath) {
  console.log(`Actualizando viewport en ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`El archivo ${filePath} no existe. Saltando...`);
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Reemplazar cualquier meta viewport existente
  const viewportRegex = /<meta\s+name=["']viewport["']\s+content=["'][^"']*["']\s*\/?>/i;
  
  if (viewportRegex.test(content)) {
    content = content.replace(viewportRegex, zoomViewportTag);
    fs.writeFileSync(filePath, content);
    console.log(`✅ Viewport actualizado con éxito en ${filePath}`);
    return true;
  } else {
    console.log(`⚠️ No se encontró meta viewport en ${filePath}`);
    
    // Intentar insertar después del meta charset si no se encontró
    const charsetRegex = /<meta\s+charset=["'][^"']*["']\s*\/?>/i;
    if (charsetRegex.test(content)) {
      content = content.replace(charsetRegex, `$&\n    ${zoomViewportTag}`);
      fs.writeFileSync(filePath, content);
      console.log(`✅ Viewport insertado después del meta charset en ${filePath}`);
      return true;
    } else {
      console.log(`❌ No se pudo actualizar viewport en ${filePath}`);
      return false;
    }
  }
}

// Función para buscar y actualizar el viewport en la carpeta Android
function updateAndroidViewport() {
  const androidPublicPath = path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public');
  
  if (fs.existsSync(androidPublicPath)) {
    const androidIndexPath = path.join(androidPublicPath, 'index.html');
    
    if (fs.existsSync(androidIndexPath)) {
      console.log('Encontrado index.html en carpeta de assets de Android');
      updateViewportInFile(androidIndexPath);
    } else {
      console.log('No se encontró index.html en carpeta de assets de Android');
    }
  } else {
    console.log('La carpeta de assets de Android no existe o no se ha sincronizado aún');
  }
}

// Función principal
function enableZoom() {
  console.log('Habilitando zoom en aplicación CazaOfertas...');
  
  // Actualizar archivos index.html
  updateViewportInFile(rootIndexPath);
  updateViewportInFile(distTempIndexPath);
  
  // Actualizar viewport en Android (si existe)
  updateAndroidViewport();
  
  console.log('Proceso completado.');
}

// Ejecutar función principal
enableZoom();
