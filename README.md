# SIMTELE-WEB | Mi Teleférico

Proyecto académico de Programación Web I construido con HTML, CSS y JavaScript.

## Archivos
- `index.html`: estructura y los cuatro módulos.
- `css/estilos.css`: diseño adaptable a escritorio y celular.
- `js/app.js`: acceso de demostración, gestión de cuenta y lógica de los módulos.
- `logo.png`: logotipo proporcionado para el proyecto.

## Cómo ejecutar
1. Descomprime la carpeta.
2. Abre `index.html` en un navegador.
3. Selecciona **Crear cuenta**, registra un usuario y contraseña de demostración.
4. Inicia sesión y explora los módulos.

## Módulos
1. Detención de emergencia: `d = (v / 3.6) × t`.
2. Mantenimiento: alta, edición, eliminación y tabla dinámica con arreglo de objetos.
3. Viento y oscilación: cinco mediciones, promedio, máximo y clasificación didáctica.
4. Sensores: validación del código con `/^SEN-\d{3}$/`, tipo y lectura numérica.

## Pruebas del documento
- Detención: 72 km/h y 3 s = 60 m.
- Viento: 10, 20, 30, 40, 50 = promedio 30 y máximo 50.
- Sensor: SEN-001 válido; SEN-1 inválido.
- Mantenimiento: agregar dos registros y eliminar uno.

## Publicar en GitHub Pages
1. Crea un repositorio público en GitHub.
2. Sube `index.html`, `logo.png`, `css/`, `js/` y este README.
3. En el repositorio abre **Settings > Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**, rama `main` y carpeta `/(root)`.
5. Guarda y espera la URL pública que GitHub Pages mostrará.

## Aviso importante
El inicio de sesión es únicamente una demostración local. Los datos se guardan en `localStorage` del navegador y la contraseña no está protegida como en un sistema real. No utilizar contraseñas reales. Para una autenticación de producción se necesita un backend y almacenamiento seguro.

Todos los umbrales y mediciones son didácticos. Este sitio no está conectado a Mi Teleférico ni a sistemas reales de operación, sensores o mantenimiento.
