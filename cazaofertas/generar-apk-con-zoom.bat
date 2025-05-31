@echo off
echo ========================
echo  GENERAR APK CON ZOOM
echo ========================
echo.
echo Este script generara la APK de CazaOfertas con capacidad de zoom
echo permitiendo ver el perfil y boton de cerrar sesion.
echo.
echo Presiona cualquier tecla para comenzar...
pause > nul

powershell -ExecutionPolicy Bypass -File .\generate-apk-with-zoom.ps1

echo.
if %ERRORLEVEL% NEQ 0 (
    echo Ocurrio un error al generar la APK. Por favor revisa los mensajes de error.
) else (
    echo APK generada correctamente!
    echo Puedes encontrarla en la carpeta apk-output
)
echo.
echo Presiona cualquier tecla para salir...
pause > nul
