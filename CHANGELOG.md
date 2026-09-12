# Changelog — INNOPAT · La Cartuja

Las versiones publicadas se conservan como hitos estables del prototipo.

## [4.0.0] — 2026-09-12
### Añadido
- Coordenadas de los 11 hitos importadas del KML facilitado por el equipo.
- Mapa Leaflet/OpenStreetMap con los 11 marcadores y ajuste automático de encuadre.
- Contenidos de los 11 hitos traducidos al inglés y al francés.
- Selector ES/EN/FR con persistencia local y URL compartible.
- Borrador de encuesta de visita basado en la estructura metodológica de VESTIGIUM.

### Cambiado
- El selector de recorrido queda reducido a Lista y Mapa.
- Se retira el plano SVG conceptual.
- La identificación pública del demostrador original pasa a «DP».
- El bloque institucional identifica la Consejería de Cultura, Patrimonio Histórico y Deporte y el IAPH.

## [3.4.0] — 2026-09-12
### Añadido
- Se incorpora temporalmente el mismo vídeo de YouTube como vídeo principal en las 11 paradas.
- El reproductor se adapta de forma responsive a móvil, tablet y escritorio.
- El vídeo queda identificado como recurso provisional para ser sustituido posteriormente en cada parada.

## [3.3.0] — 2026-09-12
### Añadido
- Las 11 paradas previstas sustituyen a los hitos genéricos.
- Cada ficha incluye nombre, subtítulo interpretativo y contenido estructurado.
- Nuevos bloques: Contenido principal, Ciencia/Geoarqueología, Anecdotario e Información extra/Multimedia.
- Todo se etiqueta como borrador pendiente de validación.
- La parada 11 queda marcada como incompleta porque el material recibido termina truncado.

### Importante
- No se consideran textos históricos definitivos.
- Coordenadas y localizaciones exactas siguen pendientes de validación.
- No se han completado por inferencia los fragmentos que faltaban.

## [3.2.0] — 2026-09-11
### Cambiado
- Se elimina el bloque repetido “PROYECTO INNOPAT” de la parte inferior.
- El contenido “Investigar, conservar y hacer comprensible el patrimonio” se integra en el primer bloque “Conoce INNOPAT”.
- Se mantiene el diseño visual del primer bloque, ajustándolo solo para albergar el contenido ampliado.

## [3.1.0] — 2026-09-11
### Cambiado
- Se reduce y equilibra visualmente la imagen institucional “Financia / Desarrolla”.
- Se ajusta su integración en la página para que no resulte dominante en escritorio ni en móvil.

## [3.0.0] — 2026-09-11
### Cambiado
- El logotipo oficial de INNOPAT facilitado por el proyecto pasa a ser la identidad principal de la cabecera.
- Se eliminan de la cabecera los logos institucionales verdes.
- Se añade un bloque inicial “Conoce INNOPAT” con enlace a la información oficial del proyecto.
- Los logos de financiación y desarrollo se trasladan al final de la página, antes del pie.
- Se mantienen sin cambios las funciones de la V2: Google Maps, GPS, lector QR, plano, listado y PWA.

## [2.0.0] — 2026-09-11
### Añadido
- Vista Google Maps preparada para mostrar las 11 paradas.
- Geolocalización opcional del visitante mediante permisos del navegador.
- Seguimiento de posición únicamente durante el uso; no se guarda el recorrido.
- Lector QR mediante cámara del móvil.
- Reconocimiento de `H01`–`H11`, `hito-01`–`hito-11` y URLs con `?hito=H01`.
- 11 códigos QR de prueba.
- Coordenadas provisionales de demostración para H01–H11, claramente marcadas como no definitivas.
- Mantenimiento del plano SVG y listado como alternativas accesibles.
- Preparación específica para publicación en GitHub Pages.

### Pendiente
- API key y Map ID institucionales de Google Maps.
- Coordenadas definitivas de las 11 paradas.
- Contenidos patrimoniales definitivos.
- Vídeos, subtítulos, transcripciones y modelos 3D finales.
- Plano validado del recinto.
- Encuesta institucional.
- Validación WCAG 2.2 AA y pruebas en dispositivos reales.

## [1.0.0] — 2026-09-11
### Añadido
- Primera maqueta funcional PWA.
- 11 hitos estructurados.
- Listado y plano SVG conceptual.
- Progreso de visita en `localStorage`.
- Base de accesibilidad y PWA/offline.
- Modelo de contenido preparado para futura integración con OpenCms.
