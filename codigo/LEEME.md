# Marina & Jaime · Atlas de luz · V2

Copia independiente para Claude. Esta revisión sustituye el autobús y los árboles geométricos por una escena fotorealista y añade interacciones a la portada, la galería y los lugares. No se ha publicado ni modificado la web original.

Entrega el ZIP a Claude y pídele que lea `PARA_CLAUDE.txt`.

## Ejecutar

Node.js 20.19+ (o 22.12+), npm y navegador moderno.

```sh
npm ci
npm run dev -- --host 0.0.0.0
```

Para compilar y verificar el contenido:

```sh
npm run check:content
npm run build
npm run preview -- --host 0.0.0.0
```

`dist/client/` incluye la compilación. También puede servirse con `python3 -m http.server 8080 --directory dist/client`. Debe abrirse por HTTP, no mediante doble clic en index.html.

## Interacciones V2

- Portada: la fotografía original se despliega al avanzar; el botón inicia esa transición.
- Recuerdos: tira horizontal de las 14 fotos originales, arrastre, flechas, teclado y ampliación en diálogo.
- Lugares: selector entre ceremonia y celebración con datos y enlaces originales.
- Alojamientos: cuatro opciones que cambian la fotografía y despliegan sus datos completos.
- Trayecto: coche que se aleja hacia la curva mediante scroll, reproducción/pausa, avance manual, zoom y retorno al scroll. El fondo es una imagen fotorealista; no es un bosque reconstruido completamente en 3D.
- En navegadores con WebGL2, se carga un modelo volumétrico de coche de Three.js. Sin WebGL, se utiliza un recorte fotorealista animado. Son dos vehículos ilustrativos diferentes; ninguno representa el transporte contratado. La rama WebGL necesita revisión visual en hardware real.
- Con animaciones pausadas o movimiento reducido, los controles manuales y el contenido siguen accesibles y el recorrido automático se detiene.

Las dos imágenes nuevas son generadas. No son fotografías verificadas de la ruta Palma–Alaró. Los lugares, enlaces y la información del autobús organizado son los originales. Créditos y procedencia: `reference/escena-v2-creditos.txt`.

## Conservación

Los 26 archivos gráficos originales están intactos, verificados con SHA-256. Se conservan las 14 fotos y su orden, los pies originales (incluidos «Texto pendiente.»), las fotos de portada, medallón, pie y alojamientos. El gráfico del autobús original queda archivado, sustituido visualmente por petición del usuario.

Se mantienen fecha, hora, direcciones, vestimenta, datos climáticos, cuatro alojamientos, código «Próximamente», enlaces, transporte organizado, siete preguntas y respuestas, siete campos y opciones de RSVP, Google Calendar y archivo .ics. El fin a las 23:00 del calendario procede del original; no se presenta como hora confirmada de fin de fiesta.

## Formulario

Arranca en **modo demo**: no envía ni guarda respuestas ni inventa contadores. La conexión original está en `src/config.js`. Cambiar `RSVP_CONFIG.demo` a false solo cuando Jaime pida activar los envíos reales.

Se conserva POST con FormData y mode no-cors: el cliente no puede confirmar que Google haya guardado la fila. No se realizaron envíos reales en las pruebas.

## Archivos principales

- `src/HeroExperience.jsx`, `src/PhotoReel.jsx`, `src/WeddingChapters.jsx`: nuevas interacciones.
- `src/BusJourney.jsx`: recorrido fotográfico, nombre conservado por compatibilidad.
- `src/CarModel.jsx`: modelo WebGL con carga diferida y alternativa fotográfica.
- `src/experience.css`: estilos V2 sobre la base de `src/styles.css`.
- `src/App.jsx`: formulario, FAQ, navegación y composición.
- `src/content.json`, `reference/inventario-contenidos.json`: inventario original.
- `reference/qa-v2/`: capturas reales del navegador.
- `design-qa.md`: alcance de las pruebas y límites.

La referencia antigua `reference/propuesta-elegida.png` documenta la elección inicial de tonos claros; la corrección posterior del usuario prima sobre esa composición. Las escenas antiguas de papel, si aparecen como código sin usar, no forman parte de la V2.

## Pendiente en dispositivo real

Safari/iPhone, apariencia e iluminación del coche WebGL, rendimiento GPU e importación del calendario en la app de Apple. La revisión móvil usa marcos de navegador de 390 y 430 px, no un iPhone real. Antes de publicación, verificar la licencia del modelo según los créditos incluidos. No publicar ni hacer push sin petición explícita.
