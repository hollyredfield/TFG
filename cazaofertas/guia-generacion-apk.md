# Guía para generar APK de CazaOfertas

## Requisitos previos
- Android SDK instalado y configurado
- Java Development Kit (JDK) 11 o superior
- Node.js y npm

## Pasos para generar la APK

### 1. Preparación del entorno

**Instala JDK 11 o superior si aún no lo tienes:**
1. Descarga JDK desde: https://adoptium.net/temurin/releases/
2. Instala seleccionando la versión de 64 bits de JDK 11 o superior
3. Configura la variable de entorno JAVA_HOME apuntando a la ruta de instalación del JDK

**Instala Android Studio:**
1. Descarga desde: https://developer.android.com/studio
2. Instala siguiendo las instrucciones del asistente
3. Asegúrate de instalar al menos una versión del SDK de Android (recomendado API 30-33)

### 2. Configuración del proyecto

1. Asegúrate de que el archivo `capacitor.config.json` contenga la configuración correcta:
```json
{
  "appId": "io.cazaofertas.app",
  "appName": "CazaOfertas",
  "webDir": "dist-temp",
  "server": {
    "androidScheme": "https"
  },
  "android": {
    "backgroundColor": "#FFFFFF",
    "allowMixedContent": true,
    "captureInput": true,
    "webContentsDebuggingEnabled": true
  }
}
```

2. Si has realizado cambios en el código web, asegúrate de que la carpeta `dist-temp` contiene un `index.html` válido.

### 3. Generación de la APK

**Para generar una APK de depuración:**
1. Abre Android Studio
2. Selecciona "Open an existing project"
3. Navega a la carpeta `android` del proyecto y ábrela
4. Espera a que se sincronice el proyecto
5. Ve al menú "Build" y selecciona "Build Bundle(s) / APK(s)" > "Build APK(s)"
6. La APK se generará en `android/app/build/outputs/apk/debug/app-debug.apk`

**Para generar una APK de producción:**
1. Necesitarás crear una keystore para firmar la APK
2. En Android Studio, ve a "Build" > "Generate Signed Bundle / APK"
3. Sigue las instrucciones del asistente para generar y firmar tu APK

### 4. Instalación en dispositivo Android

**Método 1: Usando adb (Android Debug Bridge):**
```
adb install ruta/a/app-debug.apk
```

**Método 2: Transferencia directa:**
1. Transfiere el archivo APK al dispositivo Android (email, USB, etc.)
2. En el dispositivo, navega al archivo y tócalo para instalarlo
3. Es posible que necesites habilitar "Fuentes desconocidas" en la configuración de seguridad

## Solución de problemas

**Problema: Error de versión de Java**
- Asegúrate de tener instalado JDK 11 o superior
- Configura correctamente JAVA_HOME en las variables de entorno

**Problema: Error al sincronizar el proyecto en Android Studio**
- Asegúrate de tener instalado el SDK de Android apropiado
- Verifica que Gradle esté utilizando la versión correcta de JDK

**Problema: La APK se instala pero muestra pantalla en blanco**
- Verifica que el archivo index.html en dist-temp sea válido
- Comprueba los logs con `adb logcat` para identificar errores

**Problema: Error "Package conflicts with existing package"**
- Desinstala la aplicación anterior del dispositivo antes de instalar la nueva versión

## Recursos adicionales
- Documentación de Capacitor: https://capacitorjs.com/docs
- Guía de Android Developer: https://developer.android.com/studio/build
