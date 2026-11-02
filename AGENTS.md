# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Decisiones de Jaime
- Dirección elegida: primera imagen mostrada, Atlas de luz, papel escultórico, tonos claros, oliva y tipografía editorial.
- Conservar todos los archivos fotográficos, textos reales, siete preguntas y respuestas, campos e integraciones de la web original.
- Entrega ZIP independiente para Claude. No publicar ni modificar el repositorio de producción.
- Probar RSVP en modo demo. La conexión original queda disponible en src/config.js.
- Ajuste posterior: autobús 3D real con geometría, ruedas, carretera, paisaje, control de reproducción, avance y cámara. Recorrido abstracto, no cartografía inventada. Mantener bus-route.png como alternativa accesible.

## Corrección de dirección · 2 de noviembre de 2026
- El usuario rechaza el aspecto de maqueta, árboles poligonales y la mera reorganización de la web.
- Escena fotorealista con coche y carretera entre bosque de aspecto natural. El entorno es ilustrativo, nunca una foto verificada del itinerario real.
- Interacciones sustanciales: apertura fotográfica al scroll, galería arrastrable, exploración de lugares/alojamientos, trayecto controlado por scroll y reproducción.
- Conservar todos los originales, contenido, FAQ y campos. La información real de transporte organizado en autobús se conserva, aunque la escena artística muestre un coche.
