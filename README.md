# INNOPAT · La Cartuja · PWA de visita

**Variante accesible de evaluación: 4.0.0 — 12 de septiembre de 2026**

Prototipo funcional mobile-first preparado para GitHub Pages y para servir posteriormente como frontend desacoplado de OpenCms.

Esta variante parte del demostrador de DP y aplica la auditoría documentada en [`docs/AUDITORIA_Y_HOJA_DE_RUTA.md`](docs/AUDITORIA_Y_HOJA_DE_RUTA.md). No declara conformidad legal: su objetivo es proporcionar una base más rigurosa para la validación.

## Cambios principales de esta variante

- Identidad cromática alineada con el verde institucional de la Junta, pendiente de validación con el manual corporativo vigente.
- Versiones completas de los contenidos de los 11 hitos en español, inglés y francés.
- Mapa del recorrido con Leaflet 1.9.4, teselas OpenStreetMap y las coordenadas aportadas en el KML, sin clave API y cargado solo bajo petición.
- Navegación simplificada a dos vistas equivalentes: Lista y Mapa.
- Vídeo de YouTube en modo de privacidad mejorada y solo bajo petición.
- Librería QR cargada solo cuando se solicita.
- Progreso expuesto mediante el elemento nativo `progress`.
- Enlaces profundos a los hitos mediante su `slug`.
- Declaración de accesibilidad y privacidad provisionales, identificadas expresamente como no definitivas.
- Compatibilidad reforzada con contraste forzado y pantallas de 320–360 CSS px.

## Mapa Leaflet

Leaflet 1.9.4 se carga desde su distribución pública. Las teselas se solicitan a OpenStreetMap únicamente cuando la persona pulsa «Cargar mapa» y nunca se precargan ni se guardan para uso offline. El proveedor y la atribución se configuran en `config.js` para poder sustituirlos sin reescribir la aplicación.

Actualmente se marca solo el conjunto monumental. Los marcadores de hitos aparecerán automáticamente cuando cada registro de `content/hitos.json` incluya coordenadas validadas con la forma `{ "coordinates": { "lat": 0, "lng": 0 } }`.

> Esta versión es una prueba de desarrollo. Los contenidos, coordenadas de las paradas y determinados recursos son provisionales y deben validarse antes de producción.

## Qué incluye
- Inicio responsive con identidad INNOPAT/IAPH.
- 11 hitos en listado y plano SVG equivalente.
- Ruta lineal o exploración libre.
- Progreso de visita en `localStorage`.
- GPS opcional, sin guardar coordenadas.
- Diálogo de hito con vídeo bajo demanda (placeholder), transcripción y 3D bajo demanda (placeholder).
- Preferencias de accesibilidad: texto grande, alto contraste, enlaces subrayados y reducción de movimiento.
- Interfaz en español; arquitectura preparada para añadir traducciones completas.
- Manifest + service worker para PWA/offline básico.
- Contenido desacoplado en `content/hitos.json`.
- Configuración central en `config.js`.

## Publicar
Sube el contenido de esta carpeta a un servidor HTTPS conservando la estructura. No requiere build ni base de datos.

Para una prueba local:
`python -m http.server 8000`
y abre `http://localhost:8000`.

## Integración con OpenCms
En `config.js`, sustituye `contentEndpoint` por un endpoint de OpenCms que entregue un array con el mismo esquema que `content/hitos.json`.
La experiencia de usuario, estado local, plano, GPS y 3D quedan en el frontend.

## Antes de producción
1. Sustituir los 11 hitos de ejemplo por contenidos validados.
2. Incorporar vídeos, WebVTT y transcripciones.
3. Incorporar los 3 GLB optimizados y sus posters/fallbacks.
4. Sustituir el plano conceptual por el plano validado del recinto.
5. Configurar la encuesta institucional.
6. Localizar los recursos gráficos institucionales en el mismo dominio si se requiere funcionamiento visual completamente offline.
7. Ejecutar pruebas WCAG 2.2 AA, teclado, lector de pantalla, Android/iOS y red lenta.


## Geolocalización

El botón «Mostrar mi ubicación» solicita una lectura puntual únicamente tras una acción explícita y no persiste las coordenadas. La visita funciona completamente sin conceder el permiso.

## Lector QR
- Usa `html5-qrcode` 2.3.8 desde CDN y la carga solo al solicitar el lector. En producción debe alojarse localmente y verificarse su integridad.
- La cámara solo se solicita al pulsar “Abrir cámara”. Requiere HTTPS (o localhost).
- Reconoce `H01`–`H11`, `hito-01`–`hito-11` y URLs con `?hito=H01`.


## Versionado
- `VERSION` contiene la versión estable actual.
- `CHANGELOG.md` registra los cambios entre versiones.
- La Versión 2 corresponde a `v2.0.0`.
- La Versión 3 corresponde a `v3.0.0`.
- La Versión 3.1 corresponde a `v3.1.0`.
- La Versión 3.2 corresponde a `v3.2.0`.
- Las siguientes evoluciones se conservarán como `v3.0.0`, `v4.0.0`, etc., sin sustituir los paquetes anteriores.

## GitHub Pages
Consulta [`docs/GITHUB_PAGES.md`](docs/GITHUB_PAGES.md) para publicar la aplicación directamente desde la rama `main`.

- La Versión 3.3 corresponde a `v3.3.0`.

- La Versión 3.4 corresponde a `v3.4.0`.
