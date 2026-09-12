# INNOPAT · La Cartuja · PWA de visita

**Variante accesible de evaluación: 1.0.0 — 12 de septiembre de 2026**

Prototipo funcional mobile-first preparado para GitHub Pages y para servir posteriormente como frontend desacoplado de OpenCms.

Esta variante parte del demostrador de David Parrilla y aplica la auditoría documentada en [`docs/AUDITORIA_Y_HOJA_DE_RUTA.md`](docs/AUDITORIA_Y_HOJA_DE_RUTA.md). No declara conformidad legal: su objetivo es proporcionar una base más rigurosa para la validación.

## Cambios principales

- Identidad cromática alineada con el verde institucional de la Junta, pendiente de validación con el manual corporativo vigente.
- Interfaz en español; el selector multilingüe volverá cuando existan traducciones completas.
- Google Maps retirado mientras las coordenadas sean provisionales.
- Mapa de contexto con Leaflet 1.9.4 y OpenStreetMap, sin clave y cargado bajo petición.
- Vídeo de YouTube en modo de privacidad mejorada y solo bajo petición.
- Librería QR cargada solo cuando se solicita.
- Progreso semántico con `progress`, enlaces profundos por hito y ajustes para 320–360 CSS px y contraste forzado.

## Mapa Leaflet

Leaflet se aloja localmente en `vendor/leaflet`. Las teselas se solicitan a OpenStreetMap solo al pulsar «Cargar mapa» y no se precargan ni se guardan para uso offline. El proveedor y la atribución se configuran en `config.js`.

Actualmente se marca el conjunto monumental. Los hitos aparecerán cuando cada registro de `content/hitos.json` incluya coordenadas validadas: `{ "coordinates": { "lat": 0, "lng": 0 } }`.

> Prototipo de desarrollo: los contenidos, coordenadas y determinados recursos deben validarse antes de producción.

## Prueba local

`python -m http.server 8000`

Después, abre `http://localhost:8000`.

## Antes de producción

1. Completar y validar H01 y H02.
2. Incorporar vídeos, WebVTT, transcripciones y alternativas 3D.
3. Sustituir el plano conceptual por el plano validado.
4. Configurar la encuesta institucional y los textos legales.
5. Alojar localmente los recursos institucionales y el lector QR.
6. Ejecutar auditoría WCAG 2.2 AA manual y automática, con tecnologías de asistencia y personas usuarias.

## Integración OpenCms

Sustituye `contentEndpoint` en `config.js` por un endpoint que entregue el mismo modelo que `content/hitos.json`. La interfaz, el estado local, el plano, Leaflet, GPS y 3D quedan en el frontend.
