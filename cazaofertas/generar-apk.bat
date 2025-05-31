@echo off
echo ===================================================
echo  CazaOfertas APK Generator - One-Click Solution
echo ===================================================
echo.
echo Este script generará un APK de CazaOfertas listo para compartir
echo por WhatsApp o email sin necesidad de Android Studio.
echo.
echo Presiona cualquier tecla para continuar...
pause > nul

echo.
echo [1/4] Ejecutando script para arreglar ProductDetail.jsx...
node fix-product-detail.js

echo.
echo [2/4] Construyendo la aplicación y creando build para Capacitor...
node build-and-prepare.js

echo.
echo [3/4] Iniciando generación de APK con Java 17...
PowerShell -ExecutionPolicy Bypass -Command "& {$env:JAVA_HOME='C:\Program Files\Eclipse Adoptium\jdk-17.0.15.6-hotspot'; $env:PATH='C:\Program Files\Eclipse Adoptium\jdk-17.0.15.6-hotspot\bin;' + $env:PATH; & '.\generate-apk-easy.ps1'}"

echo.
echo [4/4] Proceso completado!
echo.
echo Si todo ha ido bien, ahora deberías tener un archivo APK
echo que puedes compartir por WhatsApp o email.
echo.
echo Para más información, consulta el archivo:
echo guia-compartir-apk.md
echo.
pause
