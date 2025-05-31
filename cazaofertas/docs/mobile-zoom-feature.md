# Característica de Zoom para la APK de CazaOfertas

## Descripción

La característica de zoom permite a los usuarios acercar y alejar la interfaz de la aplicación en dispositivos móviles, permitiendo ver elementos que podrían quedar cortados o fuera de la vista en pantallas pequeñas, como la sección de perfil y el botón de cerrar sesión.

## Justificación

La implementación de la característica de zoom resuelve problemas de accesibilidad en la interfaz móvil:

- Algunos elementos como el botón de cerrar sesión y partes del perfil de usuario quedaban fuera del área visible en ciertos dispositivos
- La interfaz está optimizada para web pero no se adaptaba correctamente a todos los tamaños de pantalla móvil
- Los usuarios necesitaban acceder a ciertas partes de la interfaz que quedaban fuera de la vista

## Implementación

La característica de zoom se ha implementado mediante:

1. **Configuración de Meta Viewport**: Se ha modificado el tag viewport para permitir que el usuario pueda hacer zoom:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
   ```

2. **Estilos CSS especiales**: Se han añadido estilos que mejoran la experiencia de zoom:
   - Botones y áreas táctiles más grandes
   - Mejor espaciado entre elementos interactivos
   - Soporte para gestos táctiles (pinch to zoom)

3. **Script automatizado**: Se ha creado un script que asegura que estos cambios se aplican correctamente a la APK final.

## Cómo usar el zoom

En la APK, los usuarios pueden utilizar los gestos estándar de zoom:

- **Acercar (Zoom in)**: Separar dos dedos sobre la pantalla (gesto de "pinch out")
- **Alejar (Zoom out)**: Juntar dos dedos sobre la pantalla (gesto de "pinch in")
- **Desplazarse**: Arrastrar con un dedo para moverse por la interfaz ampliada

Esto permitirá acceder a elementos que antes quedaban fuera del área visible, como:
- El botón de cerrar sesión
- La sección completa del perfil
- Contenido que pueda quedar cortado en pantallas pequeñas

## Notas técnicas

- Esta solución mantiene la interfaz original sin rediseñarla
- No afecta a la experiencia web del sitio
- Es específica para la versión APK
- El zoom máximo está limitado a 5x para evitar problemas de usabilidad

## Generación de APK con zoom

Para generar la APK con el zoom habilitado:

1. Ejecuta el script `generate-apk-with-zoom.ps1`:
   ```powershell
   .\generate-apk-with-zoom.ps1
   ```

2. El script realizará automáticamente:
   - Construcción de la aplicación React
   - Aplicación de la configuración de zoom
   - Generación de la APK con Capacitor
   
3. Encontrarás la APK generada en la carpeta `apk-output`
