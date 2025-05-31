const fs = require('fs');
const path = require('path');

// 1. Crear un directorio temporal para la compilación
const tempDir = path.join(__dirname, 'dist-temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// 2. Copiar los archivos HTML y CSS básicos para una compilación mínima
const indexHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CazaOfertas</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      text-align: center;
    }
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 80vh;
    }
    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border-left-color: #09f;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .loading-text {
      margin-top: 20px;
      font-size: 1.2em;
      color: #666;
    }
  </style>
</head>
<body>
  <div id="root">
    <div class="loading">
      <div class="spinner"></div>
      <div class="loading-text">Cargando CazaOfertas...</div>
    </div>
  </div>
  <script>
    // Capacitor JavaScript
    document.addEventListener('deviceready', function() {
      console.log('Capacitor está listo');
    }, false);
  </script>
</body>
</html>
`;

// 3. Escribir el archivo index.html en el directorio temporal
fs.writeFileSync(path.join(tempDir, 'index.html'), indexHtml);

// 4. Crear el archivo manifest.json para la PWA
const manifest = {
  "name": "CazaOfertas",
  "short_name": "CazaOfertas",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#6366f1",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
};

// 5. Escribir el archivo manifest.json en el directorio temporal
fs.writeFileSync(
  path.join(tempDir, 'manifest.json'),
  JSON.stringify(manifest, null, 2)
);

// 6. Informar que los archivos se han creado correctamente
console.log('Archivos de compilación temporal creados con éxito en', tempDir);
console.log('Ahora puedes usar estos archivos para compilar la APK con Capacitor');
