# Vídeo del trayecto Palma → Alaró — diseño

Fecha: 2026-11-02 · Proyecto: web de la boda de Marina y Jaime (`codigo/`)

## Intención

Sustituir la escena "El camino también cuenta" (carretera generada por IA + Ferrari 3D) que Jaime ve "falsísima". En su lugar: un **vídeo del trayecto real** desde la ceremonia (Parroquia de Santa Teresa del Niño Jesús, Carrer de Pilar Juncosa 13, Palma) hasta la celebración (Finca S'Olivaret, Ctra. Alaró–Orient km 3, Alaró), con el **nivel de acabado del vídeo de Turbi** (`~/Desktop/empresa/turbi-video`, hecho con onetake), que a Jaime le parece "espectacular". Referencia de concepto que dio él: "rollo Strava" — la ruta dibujándose sobre el mapa de cómo se llega.

El invitado debe *ver* el camino de verdad: la ciudad, la llanura, la sierra de Tramuntana acercándose, y llegar a la finca.

## Decidido por Jaime

- Herramienta: **onetake** (la misma del vídeo de Turbi).
- Se reproduce **como un vídeo** (no ligado al scroll).
- Recorre el trayecto **un autobús** (el transporte real de los invitados es un autobús Palma → Alaró → Palma).
- **Todo lo más real posible**: nada de figuras volumétricas ni geométricas, ni imágenes generadas por IA que imiten fotos. Objetos y paisajes reales.
- **Sin datos técnicos**: nada de desnivel, kilómetros, perfil de altura ni estadísticas.
- Lo construye Claude con material disponible (no habrá grabación propia del trayecto).

## Anti-objetivos (fracaso aunque funcione)

- Que parezca una maqueta, un render de videojuego o una "foto" generada por IA.
- Que el autobús parezca una pegatina pegada encima de un mapa.
- Que parezca un dashboard (cifras, gráficos, HUD).
- Inventar geografía: la ruta, la costa, la sierra y los dos puntos deben ser los reales.

## Material (real, con licencia que permite usarlo)

- **Fotografía aérea**: PNOA del Instituto Geográfico Nacional (WMTS `https://www.ign.es/wmts/pnoa-ma`, capa `OI.OrthoimageCoverage`, hasta ~25 cm/px). Licencia CC BY 4.0 → crédito visible "Ortofoto PNOA © Instituto Geográfico Nacional". Comprobado que sirve teselas de la zona de S'Olivaret.
- **Relieve**: modelo digital del terreno abierto (MDT del IGN o teselas Terrarium de AWS Open Data) para dar volumen real a la sierra en los planos inclinados. Crédito según la fuente usada.
- **Ruta**: trazado real por carretera de OpenStreetMap (OSRM). Comprobado: ~32,6 km, ~29 min, 963 puntos. Crédito "© OpenStreetMap contributors". Puntos: iglesia ≈ 39.5693, 2.6264; finca ≈ 39.7355, 2.8030 (verificar ambos sobre la ortofoto antes de componer).
- **Fotos propias ya en la web**: `public/assets/bus-route.png` (foto real de autocar que pasó Jaime en agosto), `stay-solivaret.jpg` (la finca), fotos de la pareja.

## Cómo se ve (propuesta; pendiente de visto bueno)

Duración ~18–22 s, 30 fps, sin sonido. Estructura en tres actos:

1. **Palma** (~4 s): la cámara empieza cerca, en picado sobre la iglesia de Santa Teresa en la ortofoto real; rótulo "La ceremonia · Palma". Aparece el autobús.
2. **El trayecto** (~12 s): la cámara se eleva e inclina (vista tipo Google Earth sobre relieve real) y sigue la ruta: la ciudad queda atrás, la llanura del Raiguer, la Tramuntana creciendo al frente. La ruta se dibuja como una estela fina detrás del autobús (la "transición Strava"), en el oliva de la web. Rótulos mínimos de lugar ("Palma", "Alaró") sin cifras.
3. **S'Olivaret** (~4 s): la cámara baja hacia la finca real (se reconoce la piscina y el edificio en la ortofoto) y cierra con "Nos vemos en Alaró" y la fecha.

Tipografía y color de la web: Lora para rótulos, Jost para etiquetas, marfil `#f5f1e8` / oliva `#8a7c55` / tinta `#272819`. Ortofoto con un ligero ajuste de color cálido para que case con la paleta, sin estilizarla (que siga siendo una foto).

**El autobús (decisión de Claude, revisable)**: en planos altos, el autobús se representa con la propia estela/cabeza de la ruta (un punto de luz), porque a esa escala un autobús real mediría menos de un píxel y cualquier icono grande parecería pegatina. El autobús real (foto `bus-route.png` recortada) aparece en los momentos de cerca — salida en Palma y llegada a la finca — integrado con sombra, escala correcta y orientación a la carretera. Si en la primera versión se ve como pegatina, se replantea antes de seguir.

## En la web

- Sustituye el bloque de la carretera/coche dentro de "Cómo llegar" (`DirectionsScene` en `src/WeddingChapters.jsx`, `BusJourney.jsx`, `CarModel.jsx`). Se eliminan el Ferrari, Three.js, las escenas generadas (`public/scenes/`, `public/models/`) y su código.
- Dos versiones del vídeo: **16:9** (ordenador) y **vertical 9:16** (móvil), elegidas con `<source media>`; H.264 MP4, objetivo ≤ 6 MB cada una; póster (primer fotograma bonito) en JPG.
- `muted playsinline`, empieza cuando el bloque entra en pantalla (IntersectionObserver), se reproduce **una vez** y se queda en el último fotograma, con botón de volver a ver. Con "reducir movimiento" o pausa global de animaciones: muestra el póster y solo reproduce si se pulsa.
- Se mantienen el título "Y después, ponemos rumbo a la fiesta", la info real del autobús Palma (iglesia) → Alaró (finca) → Palma, y los mapas/enlaces de las dos ubicaciones.
- Créditos de ortofoto, relieve y OSM en letra pequeña bajo el vídeo.
- `npm run check:content` debe seguir pasando (no se toca ningún contenido real ni foto original).

## Lo que queda al constructor

- Técnica de cámara 3D sobre ortofoto + relieve dentro de la composición onetake (p. ej. malla de terreno con textura PNOA, o capas 2.5D), resolución de teselas por plano, suavizado de la trayectoria de cámara.
- Ritmo exacto, curvas de movimiento y transiciones, según el vocabulario de onetake.
- Proceso: borrador 1080p → revisión con Jaime (fotogramas clave) → render final con desenfoque de movimiento.
