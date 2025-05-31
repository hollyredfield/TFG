# CazaOfertas

Aplicación web/móvil para encontrar y compartir las mejores ofertas en tiempo real.

## Características principales

- Descubre ofertas de diferentes tiendas
- Comparte ofertas que encuentres
- Interactúa con la comunidad 
- Versión móvil disponible como APK

## Desarrollo con React + Vite

Este proyecto utiliza React con Vite para un desarrollo rápido y eficiente.

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) utiliza [Babel](https://babeljs.io/) para Fast Refresh
- [Tailwind CSS](https://tailwindcss.com/) para estilos modernos y responsive
- [Capacitor](https://capacitorjs.com/) para generar la versión móvil

## Generación de APK

Para generar la APK, puedes utilizar los siguientes scripts:

- `generate-apk.ps1` - Script completo con verificaciones
- `generate-apk-easy.ps1` - Versión simplificada
- `generate-apk-with-zoom.ps1` - Genera APK con capacidad de zoom habilitada

## Versión móvil con zoom

La versión más reciente de la APK incluye capacidad de zoom, lo que permite ver completamente elementos como:
- La sección de perfil de usuario
- El botón de cerrar sesión
- Otros elementos que podrían quedar cortados en algunas pantallas

Para generar la APK con zoom habilitado, ejecuta:
```powershell
.\generate-apk-with-zoom.ps1
```
