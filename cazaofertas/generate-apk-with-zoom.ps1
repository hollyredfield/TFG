# Script para generar APK con capacidad de zoom habilitada
Write-Host "Generando APK de CazaOfertas con capacidad de zoom..." -ForegroundColor Cyan

# Paso 1: Construir la aplicación React y prepararla para Capacitor
Write-Host "Paso 1: Construyendo aplicación y preparando para Capacitor..." -ForegroundColor Green
node build-and-prepare.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error al construir la aplicación. Abortando." -ForegroundColor Red
    exit 1
}

# Paso 2: Aplicar configuración de zoom
Write-Host "Paso 2: Aplicando configuración de zoom..." -ForegroundColor Green
node enable-zoom.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "Advertencia: Error al aplicar configuración de zoom." -ForegroundColor Yellow
    # Continuamos a pesar del error, ya que el script principal puede haber hecho los cambios necesarios
}

# Paso 3: Generar APK utilizando el script existente
Write-Host "Paso 3: Generando APK con configuraciones aplicadas..." -ForegroundColor Green
& .\generate-apk-easy.ps1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error al generar APK. Por favor, revise los errores anteriores." -ForegroundColor Red
    exit 1
}

Write-Host "`n¡APK con capacidad de zoom generada correctamente!" -ForegroundColor Cyan
Write-Host "Ahora podrás ver la sección de perfil y el botón de cerrar sesión haciendo zoom en la aplicación." -ForegroundColor Green
