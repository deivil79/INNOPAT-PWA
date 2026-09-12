# Auditoría del prototipo INNOPAT y hoja de ruta

Fecha de revisión: 12 de septiembre de 2026. Base examinada: `Parri98/INNOPAT_Pruebas`, versión declarada 3.4.0.

## Resumen ejecutivo

El prototipo demuestra que el recorrido puede resolverse con una aplicación web estática y contenidos desacoplados. Es una base útil para experimentar, pero no debe tratarse todavía como producto publicable ni como web conforme. La principal brecha no es visual: existe una diferencia relevante entre funciones demostradas, funciones simuladas y requisitos aún no validados.

Fortalezas reutilizables:

- HTML razonablemente semántico, enlace de salto, foco visible y diálogos nativos.
- Lista y plano como representaciones equivalentes de los 11 hitos.
- Contenido separado en JSON y configuración centralizada.
- PWA básica, estado local, GPS voluntario y lector QR.
- Avisos claros de que contenidos y posiciones son provisionales.

Decisión actualizada: mantener la arquitectura estática y el modelo de datos, simplificar el flujo principal y trabajar ya con los once hitos. La publicación sigue siendo provisional hasta validar el recorrido físico y los contenidos.

La variante incorpora Leaflet 1.9.4 con teselas estándar de OpenStreetMap como mapa de contexto sin clave. La carga es voluntaria, conserva la atribución visible y no precarga teselas. Para producción deberá revisarse el volumen previsto y, si crece, contratarse o desplegarse un servicio de teselas con garantías adecuadas.

## Hallazgos críticos — P0

1. **No existe una base suficiente para declarar conformidad.** WCAG 2.2 AA exige comprobaciones automáticas y manuales. El cumplimiento legal requiere además declaración de accesibilidad, mecanismo de comunicación y revisión periódica. Acción: usar lenguaje de objetivo y no de conformidad hasta superar auditoría experta.
2. **Multilingüismo aparente.** Cambiar `lang` a inglés o francés dejando la mayoría del contenido en español provoca pronunciación errónea en lectores de pantalla. Acción aplicada: mostrar ES como idioma disponible y reactivar selector solo cuando toda la interfaz y cada hito tengan traducción completa.
3. **Vídeo externo cargado sin decisión informada.** El iframe de YouTube se instanciaba en todos los hitos. Acción aplicada: carga bajo demanda mediante `youtube-nocookie.com`; antes de producción deben añadirse subtítulos, transcripción equivalente y política de privacidad validada.
4. **Datos provisionales presentados como funcionalidad cartográfica.** Google Maps estaba visible sin clave y con coordenadas de demostración. Acción aplicada: retirado del selector principal; se mantiene lista + plano + texto. Solo debe volver tras levantamiento y prueba de utilidad.
5. **Contenido esencial incompleto.** Vídeo, transcripciones, lectura fácil, 3D, derechos, encuesta, plano y coordenadas son borradores o placeholders. Acción: etiquetar el despliegue como prototipo y bloquear cualquier publicación institucional definitiva.

## Prioridad alta — P1

1. Crear páginas/URLs estables por hito y permitir apertura directa desde QR. La variante incorpora enlaces profundos por `slug`.
2. Completar H01 y H02 con contenido validado, localización textual, medios, derechos, subtítulos y transcripción.
3. Sustituir la imagen principal remota por un recurso local optimizado en AVIF/WebP/JPEG, con dimensiones explícitas y créditos.
4. Añadir declaración formal basada en el modelo europeo una vez realizada la evaluación; incluir contacto y procedimiento de reclamación reales.
5. Probar teclado completo, TalkBack, VoiceOver, NVDA, zoom al 200/400 %, reflow a 320 CSS px, orientación, contraste forzado y `prefers-reduced-motion`.
6. Revisar nombres accesibles después de cada cambio de estado, especialmente “visitado”, progreso, geolocalización, QR y audio.
7. Implementar manejo de errores visible y recuperable para JSON, service worker y recursos externos.
8. Cambiar la estrategia del service worker de cache-first indefinido a una política versionada: shell precacheado, contenido network-first con fallback y página offline explícita.

## Prioridad media — P2

1. Transformar las tarjetas en enlaces reales cuando exista una URL por hito; mantener botones solo para acciones.
2. Incorporar navegación anterior/siguiente sin volver a abrir el diálogo y anunciar el cambio de hito.
3. Añadir estado de “borrador / validado / publicado” al modelo y excluir borradores del despliegue de producción.
4. Sustituir `speechSynthesis` como solución de audio accesible: su resultado varía por navegador y no equivale a una audiodescripción producida.
5. Cargar el lector QR bajo demanda y alojar localmente la dependencia tras revisar licencia e integridad.
6. Añadir presupuestos de rendimiento: HTML+CSS+JS inicial menor de 200 KB comprimidos; imágenes adaptativas; ningún vídeo o GLB en carga inicial.
7. Separar configuración por entorno y evitar mensajes técnicos como `config.js` en la interfaz pública.
8. Añadir tests automáticos de HTML, ESLint, axe-core/Playwright y comprobación de enlaces en CI.

## Prioridad de mejora — P3

1. Refinar el sistema visual conforme a la identidad digital vigente de la Junta/IAPH; no inferir un manual completo a partir de logotipos.
2. Reducir el uso de estilos editoriales ajenos a la Junta y reservar el verde institucional para identidad y acciones relevantes.
3. Diseñar estados vacíos, carga lenta, offline, permisos denegados y medios no disponibles.
4. Añadir control para reiniciar la visita con confirmación y explicar qué se elimina de `localStorage`.
5. Instrumentar analítica agregada y exenta de identificadores solo cuando haya base jurídica y herramienta institucional aprobada.

## Criterios de aceptación de la siguiente iteración

- Inicio, lista, plano, H01 y H02 funcionan con teclado y lector de pantalla.
- No existe dependencia de GPS, cámara, mapa, vídeo o 3D para comprender el recorrido.
- No se realiza conexión a YouTube ni a la librería QR antes de una acción explícita.
- El sitio conserva su funcionalidad a 320 CSS px y con zoom del 400 % sin desplazamiento bidimensional en contenido textual.
- Contraste mínimo AA; foco siempre visible y no oculto; objetivos táctiles de al menos 24 × 24 CSS px y preferentemente 44 × 44.
- H01/H02 incluyen subtítulos, transcripción, alternativa al 3D y derechos.
- Cada QR abre una dirección estable y recuperable sin depender del estado previo.
- La prueba offline distingue con claridad contenido disponible y medios externos no descargados.
- La evaluación incluye comprobación automática y manual; un resultado Lighthouse 100 no se acepta como prueba suficiente.

## Dictamen

La base de DP merece conservarse como demostrador técnico. Su mayor valor es haber convertido la documentación en algo navegable con rapidez. La nueva versión mantiene ese alcance de once hitos y concentra la siguiente inversión en profundidad, validación física, contenidos y pruebas de accesibilidad.
