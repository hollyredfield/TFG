# Script para generar archivo APK con Capacitor

# Para ejecutar este script, es necesario tener instalado:
# 1. Java JDK 11 o superior
# 2. Android SDK
# 3. Node.js

# Variables a modificar según tu entorno
$ANDROID_SDK_ROOT = "C:\Android\Sdk" # Ajusta esta ruta según tu instalación
$JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-11" # Ajusta esta ruta según tu instalación

# Verificar si está instalado PowerShell 7 o superior (necesario para algunas características)
$PSVersion = $PSVersionTable.PSVersion.Major
if ($PSVersion -lt 7) {
    Write-Host "Se recomienda actualizar a PowerShell 7 o superior para mejores resultados." -ForegroundColor Yellow
}

# Función para verificar requisitos
function Check-Requirements {
    Write-Host "Verificando requisitos necesarios..." -ForegroundColor Cyan
    
    # Verificar Java
    try {
        $javaVersion = java -version 2>&1 | Out-String
        if ($javaVersion -match "version `"(\d+)") {
            $javaMainVersion = $Matches[1]
            if ([int]$javaMainVersion -lt 11) {
                Write-Host "ERROR: Se requiere Java 11 o superior. Versión actual: $javaMainVersion" -ForegroundColor Red
                Write-Host "Por favor instala JDK 11 o superior desde: https://adoptium.net/temurin/releases/" -ForegroundColor Red
                return $false
            } else {
                Write-Host "✓ Java $javaMainVersion detectado correctamente" -ForegroundColor Green
            }
        } else {
            Write-Host "ERROR: No se pudo determinar la versión de Java" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "ERROR: Java no está instalado o no está en el PATH" -ForegroundColor Red
        Write-Host "Por favor instala JDK 11 o superior desde: https://adoptium.net/temurin/releases/" -ForegroundColor Red
        return $false
    }
    
    # Verificar Android SDK
    if (-Not (Test-Path $ANDROID_SDK_ROOT)) {
        Write-Host "ERROR: No se encontró Android SDK en $ANDROID_SDK_ROOT" -ForegroundColor Red
        Write-Host "Por favor instala Android Studio desde: https://developer.android.com/studio" -ForegroundColor Red
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

# Función para preparar el proyecto
function Prepare-Project {
    Write-Host "Preparando proyecto para compilación de APK..." -ForegroundColor Cyan
    
    # Asegurar que dist-temp existe y tiene index.html
    if (-Not (Test-Path "dist-temp\index.html")) {
        Write-Host "Creando directorio dist-temp con archivos necesarios..." -ForegroundColor Yellow
        
        if (-Not (Test-Path "dist-temp")) {
            New-Item -Path "dist-temp" -ItemType Directory | Out-Null
        }
        
        # Crear un index.html básico si no existe
        if (-Not (Test-Path "dist-temp\index.html")) {
            $indexContent = @"
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CazaOfertas</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    .loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 80vh; }
    .spinner { border: 4px solid rgba(0,0,0,.1); width: 36px; height: 36px; border-radius: 50%; border-left-color: #6366f1; animation: spin 1s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .title { font-size: 24px; margin-bottom: 20px; color: #6366f1; }
  </style>
</head>
<body>
  <div class="loading">
    <h1 class="title">CazaOfertas</h1>
    <div class="spinner"></div>
    <p>Cargando aplicación...</p>
  </div>
  <script>document.addEventListener('deviceready', () => console.log('Capacitor ready'))</script>
</body>
</html>
"@
            Set-Content -Path "dist-temp\index.html" -Value $indexContent
            Write-Host "Archivo index.html creado en dist-temp" -ForegroundColor Green
        }
    } else {
        Write-Host "✓ dist-temp/index.html ya existe" -ForegroundColor Green
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
    
    return $true
}

# Función para generar APK
function Generate-APK {
    Write-Host "Sincronizando proyecto con Capacitor..." -ForegroundColor Cyan
    npx cap sync android
    
    Write-Host "`nPara compilar la APK:" -ForegroundColor Yellow
    Write-Host "1. Abre el proyecto Android en Android Studio con el siguiente comando:" -ForegroundColor Yellow
    Write-Host "   npx cap open android" -ForegroundColor Cyan
    Write-Host "2. En Android Studio, selecciona 'Build' > 'Build Bundle(s) / APK(s)' > 'Build APK(s)'" -ForegroundColor Yellow
    Write-Host "3. La APK se generará en android/app/build/outputs/apk/debug/app-debug.apk" -ForegroundColor Yellow
    
    $openStudio = Read-Host "¿Quieres abrir Android Studio ahora? (S/N)"
    if ($openStudio -eq "S" -or $openStudio -eq "s") {
        npx cap open android
    }
}

# Función principal
function Main {
    Write-Host "=== Generador de APK para CazaOfertas ===" -ForegroundColor Magenta
    
    # Verificar requisitos
    if (-Not (Check-Requirements)) {
        Write-Host "`nPor favor, instala los requisitos faltantes y vuelve a ejecutar este script." -ForegroundColor Red
        exit 1
    }
    
    # Configurar variables de entorno
    Set-TempEnvironment
    
    # Preparar proyecto
    if (-Not (Prepare-Project)) {
        Write-Host "`nError al preparar el proyecto. Abortando." -ForegroundColor Red
        exit 1
    }
    
    # Generar APK
    Generate-APK
    
    Write-Host "`n¡Proceso completado! Sigue las instrucciones anteriores para generar la APK." -ForegroundColor Green
}

# Ejecutar función principal
Main
