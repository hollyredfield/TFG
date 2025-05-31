# Guía para generar y compartir APK de CazaOfertas

Este documento explica cómo generar un APK de CazaOfertas y compartirlo fácilmente por WhatsApp o email sin necesidad de Android Studio.

## Requisitos previos

1. **Java JDK 11 o superior**
   - Descarga: https://adoptium.net/temurin/releases/
   - Durante la instalación, asegúrate de que se configuren las variables de entorno

2. **Android SDK**
   - Si no tienes Android Studio pero necesitas solo el SDK:
     - Descarga las Command Line Tools: https://developer.android.com/studio#command-tools
     - Extrae en una carpeta como C:\Android\Sdk
     - Ejecuta `sdkmanager --install "platform-tools" "platforms;android-33" "build-tools;33.0.2"`

3. **Node.js y npm**
   - Descarga: https://nodejs.org/
   - Recomendamos la versión LTS

## Instrucciones de uso

### Paso 1: Ajustar las variables del script

Edita el archivo `generate-apk-easy.ps1` y ajusta estas variables según tu entorno:

```powershell
$ANDROID_SDK_ROOT = "C:\Android\Sdk" # Ruta a tu SDK de Android
$JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-11" # Ruta a tu instalación de Java
$OUTPUT_DIR = "C:\Users\TuUsuario\Desktop\APK" # Carpeta donde quieres guardar el APK
```

### Paso 2: Ejecutar el script

1. Abre PowerShell como administrador
2. Navega hasta la carpeta del proyecto:
   ```
   cd c:\Users\HollyRedfield\Desktop\tfg\cazaofertas
   ```
3. Ejecuta el script:
   ```
   .\generate-apk-easy.ps1
   ```
4. Sigue las instrucciones en pantalla

### Paso 3: Compartir la APK

Una vez generado, el APK estará disponible en la carpeta que configuraste en `$OUTPUT_DIR`. Este archivo puede ser compartido:

- **Por WhatsApp**:
  1. Abre WhatsApp Web o la aplicación
  2. Selecciona un contacto o grupo
  3. Haz clic en el botón de adjuntar archivo y selecciona el APK

- **Por Email**:
  1. Crea un nuevo correo
  2. Adjunta el archivo APK
  3. Envía el correo

### Paso 4: Instrucciones para el receptor

La persona que reciba el APK deberá:

1. Descargar el archivo APK en su dispositivo Android
2. Tocar el archivo para iniciar la instalación
3. Si recibe una advertencia sobre "Fuentes desconocidas", deberá ir a Configuración > Seguridad y habilitar "Permitir instalación desde fuentes desconocidas" o similar (varía según la versión de Android)
4. Completar la instalación siguiendo las instrucciones en pantalla

## Solución de problemas

### Error: No se puede encontrar Java

**Problema**: El script no encuentra la instalación de Java.
**Solución**: Asegúrate de que Java está instalado y que la variable `$JAVA_HOME` en el script apunta a la ubicación correcta.

### Error: No se puede encontrar Android SDK

**Problema**: El script no encuentra el Android SDK.
**Solución**: Verifica que la variable `$ANDROID_SDK_ROOT` apunta a la ubicación correcta del SDK.

### Error: La compilación falla con errores de Gradle

**Problema**: El proceso de compilación falla con errores de Gradle.
**Solución**: 
1. Verifica que tienes los componentes necesarios del SDK instalados
2. Asegúrate de que la versión de Java es compatible (JDK 11+)
3. Mira los logs detallados en la carpeta `android/app/build/outputs/logs`

### La aplicación se instala pero muestra pantalla blanca o se cierra

**Problema**: La APK se instala pero no funciona correctamente.
**Solución**:
1. Verifica el archivo `dist-temp/index.html` para asegurarte de que tiene contenido válido
2. Ejecuta `adb logcat` mientras inicias la app para ver los errores específicos
3. Asegúrate de que la configuración en `capacitor.config.json` es correcta

## Notas importantes

- Esta APK es una versión de depuración, no está optimizada ni firmada para Google Play Store
- Para una distribución más amplia, considera generar una versión firmada y optimizada
- Recuerda que compartir aplicaciones APK debe respetar los términos de uso y licencias correspondientes
