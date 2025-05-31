# Script para generar APK de CazaOfertas sin Android Studio
# Este script genera un APK que puede ser compartido vía WhatsApp o email

# Para ejecutar este script, es necesario:
# 1. Java JDK 17 o superior (requerido por Android Gradle Plugin)
# 2. Android SDK
# 3. Node.js

# Variables a modificar según tu entorno
$ANDROID_SDK_ROOT = "C:\Users\HollyRedfield\AppData\Local\Android\Sdk" # Ajusta esta ruta según tu instalación
$JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.15.6-hotspot" # Ajusta esta ruta según tu instalación
$OUTPUT_DIR = "C:\Users\HollyRedfield\Desktop\tfg\cazaofertas\apk-output" # Carpeta donde se guardará el APK final

# Función para verificar requisitos
function Check-Requirements {
    Write-Host "Verificando requisitos necesarios..." -ForegroundColor Cyan
      # Verificar Java
    try {
        # Primero configuramos temporalmente las variables de entorno para Java 17
        $oldJavaHome = $env:JAVA_HOME
        $oldPath = $env:PATH
        
        # Configuramos Java 17 como activo
        $env:JAVA_HOME = $JAVA_HOME
        $env:PATH = "$JAVA_HOME\bin;$oldPath"
        
        # Ahora verificamos la versión de Java (que debería ser Java 17)
        $javaVersion = & "$JAVA_HOME\bin\java" -version 2>&1 | Out-String
        if ($javaVersion -match "version `"(\d+)") {
            $javaMainVersion = $Matches[1]
            if ([int]$javaMainVersion -lt 17) {
                Write-Host "ERROR: Se requiere Java 17 o superior. Versión actual: $javaMainVersion" -ForegroundColor Red
                Write-Host "Por favor verifica que la ruta en `$JAVA_HOME sea correcta: $JAVA_HOME" -ForegroundColor Red
                
                # Restauramos las variables originales
                $env:JAVA_HOME = $oldJavaHome
                $env:PATH = $oldPath
                return $false
            } else {
                Write-Host "✓ Java $javaMainVersion detectado correctamente en $JAVA_HOME" -ForegroundColor Green
            }
        } else {
            Write-Host "ERROR: No se pudo determinar la versión de Java en $JAVA_HOME" -ForegroundColor Red
            # Restauramos las variables originales
            $env:JAVA_HOME = $oldJavaHome
            $env:PATH = $oldPath
            return $false
        }
        
        # Restauramos las variables originales - se configurarán adecuadamente en Set-TempEnvironment
        $env:JAVA_HOME = $oldJavaHome
        $env:PATH = $oldPath
    } catch {
        Write-Host "ERROR: Problema al acceder a Java en $JAVA_HOME" -ForegroundColor Red
        Write-Host $_ -ForegroundColor Red
        return $false
    }
    
    # Verificar Android SDK
    if (-Not (Test-Path $ANDROID_SDK_ROOT)) {
        Write-Host "ERROR: No se encontró Android SDK en $ANDROID_SDK_ROOT" -ForegroundColor Red
        Write-Host "Por favor actualiza la variable ANDROID_SDK_ROOT en este script" -ForegroundColor Red
        return $false
    } else {
        Write-Host "✓ Android SDK detectado en $ANDROID_SDK_ROOT" -ForegroundColor Green
    }
    
    # Verificar Node.js
    try {
        $nodeVersion = node -v
        Write-Host "✓ Node.js $nodeVersion detectado correctamente" -ForegroundColor Green
    } catch {
        Write-Host "ERROR: Node.js no está instalado o no está en el PATH" -ForegroundColor Red
        Write-Host "Por favor instala Node.js desde: https://nodejs.org/" -ForegroundColor Red
        return $false
    }
    
    return $true
}

# Función para configurar variables de entorno temporales
function Set-TempEnvironment {
    Write-Host "Configurando variables de entorno temporales..." -ForegroundColor Cyan
    
    $env:ANDROID_SDK_ROOT = $ANDROID_SDK_ROOT
    $env:JAVA_HOME = $JAVA_HOME
    $env:PATH = "$JAVA_HOME\bin;$ANDROID_SDK_ROOT\tools;$ANDROID_SDK_ROOT\platform-tools;$env:PATH"
    
    Write-Host "Variables de entorno configuradas correctamente" -ForegroundColor Green
}

# Función para crear la carpeta de salida
function Create-OutputDir {
    if (-Not (Test-Path $OUTPUT_DIR)) {
        Write-Host "Creando directorio para APK: $OUTPUT_DIR" -ForegroundColor Yellow
        New-Item -Path $OUTPUT_DIR -ItemType Directory | Out-Null
    } else {
        Write-Host "✓ Directorio para APK ya existe: $OUTPUT_DIR" -ForegroundColor Green
    }
}

# Función para preparar la build temporal
function Prepare-TempBuild {
    Write-Host "Construyendo la aplicación y preparando build para Capacitor..." -ForegroundColor Cyan
    
    # Ejecutar script para construir la aplicación y crear build temporal
    node build-and-prepare.js
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Falló la construcción de la aplicación" -ForegroundColor Red
        return $false
    }
    
    # Verificar configuración de capacitor
    if (Test-Path "capacitor.config.json") {
        $configContent = Get-Content "capacitor.config.json" | ConvertFrom-Json
        if ($configContent.webDir -ne "dist-temp") {
            Write-Host "Actualizando webDir en capacitor.config.json a 'dist-temp'..." -ForegroundColor Yellow
            $configContent.webDir = "dist-temp"
            $configContent | ConvertTo-Json -Depth 10 | Set-Content "capacitor.config.json"
        }
        Write-Host "✓ capacitor.config.json configurado correctamente" -ForegroundColor Green
    } else {
        Write-Host "ERROR: No se encontró capacitor.config.json" -ForegroundColor Red
        return $false
    }
    
    Write-Host "Build preparada correctamente" -ForegroundColor Green
    return $true
}

# Función para sincronizar el proyecto con Capacitor
function Sync-WithCapacitor {
    Write-Host "Sincronizando proyecto con Capacitor..." -ForegroundColor Cyan
    
    try {
        npx cap sync android
        Write-Host "✓ Proyecto sincronizado con Capacitor correctamente" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "ERROR: Error al sincronizar con Capacitor" -ForegroundColor Red
        Write-Host $_ -ForegroundColor Red
        return $false
    }
}

# Función para compilar la APK usando Gradle directamente
function Build-APK {
    Write-Host "Compilando APK usando Gradle (esto puede tardar varios minutos)..." -ForegroundColor Cyan
    Write-Host "Usando Java desde: $env:JAVA_HOME" -ForegroundColor Cyan
    Write-Host "Versión de Java: " -NoNewline
    & "$env:JAVA_HOME\bin\java" -version 2>&1
    Write-Host ""
    
    try {
        # Cambiar al directorio android y ejecutar gradlew
        Push-Location -Path "android"
        
        # Asegurar que gradlew use Java 17
        $env:JAVA_HOME = $JAVA_HOME
        
        # Mostrar la versión de gradlew
        Write-Host "Versión de Gradle: " -NoNewline
        try { ./gradlew --version | Select-String "Gradle" -First 1 } catch { Write-Host "No se pudo determinar" }
        
        # Ejecutar la tarea assembleDebug de Gradle para crear la APK
        ./gradlew assembleDebug --info
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "ERROR: Falló la compilación de la APK" -ForegroundColor Red
            Pop-Location
            return $false
        }
        
        Pop-Location
        Write-Host "✓ APK compilada correctamente" -ForegroundColor Green
        return $true
    }
    catch {
        if (Get-Location | Select-String -Pattern "android") {
            Pop-Location
        }
        Write-Host "ERROR: Error al compilar la APK" -ForegroundColor Red
        Write-Host $_ -ForegroundColor Red
        return $false
    }
}

# Función para copiar la APK a una ubicación accesible
function Copy-APK {
    Write-Host "Copiando APK al directorio de destino..." -ForegroundColor Cyan
    
    $apkPath = "android\app\build\outputs\apk\debug\app-debug.apk"
    $destinationPath = "$OUTPUT_DIR\CazaOfertas.apk"
    
    if (-Not (Test-Path $apkPath)) {
        Write-Host "ERROR: No se encontró la APK en $apkPath" -ForegroundColor Red
        return $false
    }
    
    try {
        Copy-Item -Path $apkPath -Destination $destinationPath -Force
        Write-Host "✓ APK copiada a $destinationPath" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "ERROR: Error al copiar la APK" -ForegroundColor Red
        Write-Host $_ -ForegroundColor Red
        return $false
    }
}

# Función principal
function Main {
    $startTime = Get-Date
    
    Write-Host "=== Generador de APK para CazaOfertas ===" -ForegroundColor Magenta
    Write-Host "Versión: Sin Android Studio - para compartir por WhatsApp/Email" -ForegroundColor Magenta
    Write-Host "==========================================" -ForegroundColor Magenta
    
    # Verificar requisitos
    if (-Not (Check-Requirements)) {
        Write-Host "`nPor favor, instala los requisitos faltantes y vuelve a ejecutar este script." -ForegroundColor Red
        return
    }
    
    # Configurar variables de entorno
    Set-TempEnvironment
    
    # Crear directorio de salida
    Create-OutputDir
    
    # Preparar build temporal
    if (-Not (Prepare-TempBuild)) {
        Write-Host "`nError al preparar la build temporal. Abortando." -ForegroundColor Red
        return
    }
    
    # Sincronizar con Capacitor
    if (-Not (Sync-WithCapacitor)) {
        Write-Host "`nError al sincronizar con Capacitor. Abortando." -ForegroundColor Red
        return
    }
    
    # Compilar la APK
    if (-Not (Build-APK)) {
        Write-Host "`nError al compilar la APK. Abortando." -ForegroundColor Red
        return
    }
    
    # Copiar la APK
    if (-Not (Copy-APK)) {
        Write-Host "`nError al copiar la APK. Abortando." -ForegroundColor Red
        return
    }
    
    $endTime = Get-Date
    $duration = $endTime - $startTime
    
    Write-Host "`n¡PROCESO COMPLETADO!" -ForegroundColor Green
    Write-Host "Tiempo transcurrido: $($duration.Minutes) minutos, $($duration.Seconds) segundos" -ForegroundColor Yellow
    Write-Host "`nEncontrarás tu APK en:" -ForegroundColor Yellow
    Write-Host "$OUTPUT_DIR\CazaOfertas.apk" -ForegroundColor Cyan
    Write-Host "`nPuedes compartir este archivo APK por WhatsApp, Email o cualquier otro medio." -ForegroundColor Yellow
    Write-Host "El usuario deberá permitir la instalación desde 'fuentes desconocidas' para instalarla." -ForegroundColor Yellow
    
    # Abrir el explorador de archivos en la carpeta de la APK
    $openFolder = Read-Host "¿Deseas abrir la carpeta donde se encuentra la APK? (S/N)"
    if ($openFolder -eq "S" -or $openFolder -eq "s") {
        explorer $OUTPUT_DIR
    }
}

# Ejecutar función principal
Main
