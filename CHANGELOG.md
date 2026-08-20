# Registro de cambios — Web de la boda

Historial de todo lo que se ha ido haciendo en el proyecto, sesión a sesión. Lo más reciente va arriba.

## Ideas propuestas, aún sin implementar

- Revisión de accesibilidad (contraste, navegación por teclado en menú y FAQ).

Descartadas (2026-08-20, decisión explícita del usuario, no reabrir sin que lo pida): email de confirmación automático al invitado, cierre automático del formulario tras el 1 de mayo de 2027, botón de compartir por WhatsApp.

## 2026-08-20 (estética y ambiente)

Ronda de mejoras visuales propuesta por Claude y aprobada en bloque por el usuario ("aplica esto"):

- **Sello de lacre "M&J"**: nuevo monograma con forma de sello de lacre orgánico (degradado terracota, borde irregular), definido una vez como símbolo SVG reutilizable. Se usa en tres sitios: **favicon** (retoma la idea que llevaba aparcada desde el 2026-08-18 — `assets/favicon.svg` + PNG de respaldo en 32px/180px), **footer** (sustituye al "M & J" de texto anterior), y como elemento central de los nuevos **separadores decorativos** (ramas de olivo a cada lado + el sello) insertados entre La boda→Detalles, Alojamiento→Cómo llegar y Confirmar→FAQ — antes el motivo de ramas de olivo solo aparecía en el hero, ahora es un hilo visual recurrente en toda la página.
- **Parallax sutil en las fotos del hero**: se desplazan ligeramente más lento que el resto del contenido al hacer scroll (±26px). Requirió envolver cada foto en un contenedor con overflow oculto y la imagen algo sobredimensionada (118% de alto) para que el desplazamiento no dejase huecos visibles en el marco.
- **Cuenta atrás con "vuelta de página"**: los números giran en 3D (rotateX) cada vez que cambian, en vez de sustituirse en seco — sensación de reloj mecánico/flip clock.
- **Sello de tinta al pulsar botones**: los botones (`.btn`) muestran un efecto de tinta expandiéndose desde el punto de clic, recortado a la forma de píldora, más una ligera compresión al pulsar.
- Todas las animaciones nuevas respetan `prefers-reduced-motion`.

## 2026-08-20 (continuación)

- **Hora de la ceremonia confirmada**: quitada la nota "(ajustar horario definitivo)" bajo "17:00h — ceremonia" en Detalles — las 17:00 ya no son un placeholder, es la hora definitiva.
- **Móvil: icono de "Guardar la fecha" simétrico y sin chocar con el scroll**: el icono "3 JUL" se pasó de ir a la izquierda del texto (envuelto en dos líneas y visualmente muy separado del icono) a ir apilado encima, centrado. También se aumentó el padding inferior del hero en móvil porque "Añadir a Apple Calendar" se solapaba con el cursor de scroll hacia abajo.
- **Autobús: sentido corregido y llega hasta los extremos**: la foto mira de fábrica hacia la izquierda, así que iba marcha atrás (morro hacia Palma) en el tramo Palma→Alaró — se invirtió qué tramo usa cada espejo. Además, el recorrido pasó a calcularse con `calc(var(--bus-w)/2)` en vez de un porcentaje fijo, para que el morro toque exactamente cada extremo (antes se quedaba corto) sin salirse del recuadro.
- **Autobús con foto real**: el usuario pasó un PNG de un autocar y se sustituyó el icono dibujado a mano por esa foto (recortada al bus y comprimida a `assets/bus-route.png`), con "M&J" superpuesto en el costado a modo de serigrafía. El texto tiene su propia animación de espejo sincronizada con el giro del bus, para que no se lea al revés en el viaje de vuelta. Se ajustó también el rango de recorrido (antes el bus se salía del recuadro por el borde con la foto, más ancha que el icono anterior) y el tamaño en móvil.
- **Fix: la web ya no se queda en "Confirmar asistencia" al refrescar** — pasaba porque el navegador restaura la posición de scroll y/o queda `#confirmar` en la URL tras usar el menú. Ahora cada carga fuerza scroll a inicio (`history.scrollRestoration = 'manual'`) y limpia el hash de la URL.
- **"Cómo llegar" → La celebración**: el título pasa de "Hotel Rural S'Olivaret & Spa" a **"Finca S'Olivaret"** (la sección "¿Dónde alojarse?" sigue usando el nombre completo del hotel, sin cambios ahí).

## 2026-08-20

- **Recuadro del autobús mucho más grande**: el usuario pidió agrandar todo el conjunto (recuadro, texto "Palma"/"Alaró" y el propio autobús). Se rediseñó para poner las dos ciudades en una fila arriba (space-between) en vez de a los lados de la línea, así el autobús puede ser bastante más grande (110px escritorio / 88px móvil) sin arriesgar solaparse con el texto en pantallas estrechas — con el diseño anterior (ciudades a los lados) sí llegaba a solaparse en 375px. Ofrecido también animar un PNG de autobús que el usuario pueda pasar, en vez del SVG dibujado a mano, si lo prefiere más adelante.
- **"Ver más alojamientos"** ya no apunta solo a Alaró sin fechas — ahora es una búsqueda en Booking.com de **Mallorca** con el checkin/checkout del 3 al 4 de julio de 2027 (la noche de la boda) ya rellenados.
- **Autobús animado más grande**, con una franja terracota en el costado rotulada "M&J" (serigrafía), a petición del usuario tras ver la primera versión.
- **Autobús animado**: en el aviso "Autobús organizado" de "Cómo llegar", un icono de autobús recorre en bucle una línea punteada de Palma a Alaró, se gira al llegar a cada extremo y vuelve — visualiza el trayecto de ida y vuelta descrito en el texto. Respeta `prefers-reduced-motion`.
- **FAQ**: la respuesta de "¿Cuál es el código de vestimenta?" ahora añade "(Si vienes en bañador no te juzgaremos)"; nueva pregunta "¿Hará mucho calor?" con respuesta graciosa sobre el peinado.
- **"Cómo llegar" rediseñada a dos columnas** lado a lado (La ceremonia / La celebración), igual que "Detalles del gran día" y "Tiempo previsto" — antes eran dos bloques apilados a todo lo ancho con mucho scroll vertical; ahora cada columna tiene su dirección, botón y mapa, con el aviso del autobús como franja compacta al final.
- **Ubicación de la ceremonia añadida (dato clave)**: la ceremonia es en la **Parroquia de Santa Teresa del Niño Jesús** (Carrer de Pilar Juncosa, 13, Ponent, 07014 Palma) — distinta de la finca de Alaró, donde solo se celebra el convite. "Cómo llegar" pasa de una ubicación a dos bloques (La ceremonia / La celebración), cada uno con su dirección, botón de Google Maps y mapa embebido, más un aviso de que hay **autobús organizado Palma (iglesia) → Alaró (finca) → Palma** de vuelta (confirmado por el usuario). Se actualizó también: la tarjeta "Lugar" en Detalles (ahora remite a "Cómo llegar" en vez de dar una sola dirección), la ubicación/descripción del evento de Google Calendar y del `.ics` (usan la dirección de la iglesia + mencionan ambos puntos), y la FAQ de transporte (antes decía "autobús desde el pueblo de Alaró", ya no era correcto).
- **Texto del código promocional** ajustado a "Código promocional para los asistentes de la boda: Próximamente".
- **Cache-busting** (`?v=4`) en los enlaces a `style.css`/`script.js` en `index.html`: GitHub Pages sirve estos archivos con `cache-control: max-age=600`, y el usuario vio una vez un cambio que no se reflejaba por caché del navegador. A partir de ahora, cada vez que se edite `style.css` o `script.js`, subir también la versión (`?v=N`) en `index.html` para forzar que el navegador pida la versión nueva.
- **Fotos del hero en móvil**: antes se encogían a 78px pegadas en las esquinas (casi invisibles); ahora se muestran a buen tamaño en una fila propia encima del nombre. Verificado sin desbordamiento horizontal en 320/375/428px.
- **"Guardar la fecha" más grande**: el texto pasa de 0.8rem a ~0.95–1.05rem.
- **"Guardar la fecha" con llamada de atención**: al cargar la web, los enlaces "Guardar en Google Calendar · Añadir a Apple Calendar" pulsan dos veces con un resplandor dorado suave (justo después del fundido de entrada del hero), para que el visitante se fije en que puede guardar la boda en su calendario. Respeta `prefers-reduced-motion`. De paso, el botón "Añadir a Apple / Outlook" se simplificó a "Añadir a Apple Calendar" (el archivo .ics generado sigue funcionando igual en Outlook, solo cambió la etiqueta visible).
- **Código promocional del hotel S'Olivaret**: aún no está confirmado por el hotel, así que se cambió `MARINAYJAIME27` por "Próximamente" en la tarjeta de alojamiento. Actualizar cuando el hotel lo confirme.
- **Repo renombrado a `boda`** (antes `Boda-Marina-y-Jaime`) para acortar la URL: ahora es https://marinayjaime.github.io/boda/. Actualizadas todas las referencias (meta tags OG/Twitter en `index.html`, `README.md`, remote de git local).
- **Miniatura simplificada**: se quitó el texto/nombre superpuesto de `assets/og-image.jpg` porque WhatsApp recorta la miniatura y solo se veía un fragmento del diseño con las letras cortadas. Ahora es directamente la foto de la pareja a pantalla completa (1200×630), sin texto.
- **Miniatura al compartir el enlace** (Open Graph/Twitter Card): diseñada una imagen a medida (`assets/og-image.jpg`, 1200×630) con la tipografía y paleta del sitio (Lora + Jost, tonos tierra/terracota/oliva) y una foto de la pareja, generada renderizando un HTML propio con Chrome headless. Añadidas las meta tags `og:*` y `twitter:*` en `index.html` apuntando a la URL pública de GitHub Pages. Ahora compartir el link por WhatsApp/email/redes muestra una tarjeta con foto en vez de nada.
- **Web publicada de verdad**: repo git creado (`boda`, antes no existía control de versiones) y desplegado en **GitHub Pages**. URL pública: https://marinayjaime.github.io/boda/ — repo en https://github.com/marinayjaime/boda. A partir de ahora, cualquier cambio se publica haciendo `git add -A && git commit -m "..." && git push` (GitHub Pages redespliega solo en 1–2 min). Instrucciones actualizadas en `README.md`.

## 2026-08-18

- **Fotos reales en "¿Dónde alojarse?"**: cada alojamiento tiene ahora su foto principal (sacadas de sus webs oficiales o, cuando esa web estaba rota/inaccesible, de fichas fiables como Trivago). La tarjeta de **Hotel Rural S'Olivaret & Spa** se destacó como tarjeta "featured" (a todo el ancho, con borde e insignia "Es la propia finca de la boda") porque coincide con la dirección exacta de la boda — es el sitio donde os casáis. Incluye el código promocional **MARINAYJAIME27** para quienes se alojen allí la noche de la boda.
- **FAQ movida**: ahora va después del formulario de confirmación (antes iba justo después de "Cómo llegar").
- **"Detalles del gran día" y "Tiempo previsto" fusionadas** en una sola sección de dos columnas (Detalles a la izquierda, Tiempo a la derecha) para reducir el scroll. El título de la columna de tiempo se acortó a "Tiempo previsto" (antes incluía la fecha, que ya se repite en la columna de al lado).
- **Nuevas secciones**: "¿Dónde alojarse?" (hoteles/casas rurales reales cerca de Alaró con enlaces a Google Maps), FAQ en acordeón (aparcamiento, niños, alojamiento, transporte de vuelta, vestimenta, fecha límite), botones "Guardar la fecha" (Google Calendar + descarga .ics) bajo la cuenta atrás, y contador en vivo de confirmaciones sobre el formulario (lee el nº de "Sí" desde Google Sheets vía un `doGet` nuevo en `google-apps-script.gs`).
- Quitada la frase explicativa bajo la sección "Tiempo previsto" (a petición del usuario, se dejaron solo las tarjetas de datos).
- Sección "Tiempo previsto para el 3 de julio de 2027" añadida con la media histórica real de julio en Alaró/Mallorca (no existe predicción real a más de un año vista): máx. 29–31°C, mín. 18–19°C, ~4% prob. de lluvia, ~11h de sol.
- Foto del footer ampliada mucho (hasta 460px), con marco y sombra más presentes.
- Quitado el arco decorativo de fondo del hero (a petición del usuario).
- Fotos del hero (izquierda/derecha) rediseñadas: ahora son más grandes y están perfectamente centradas — la distancia margen→foto es igual que foto→título en cualquier ancho de pantalla (se pasó de posicionamiento absoluto a flexbox con `order`).
- **Cambio de tipografía de títulos**: de Fraunces a **Lora** en toda la web. Motivo: Fraunces (y prácticamente cualquier serif elegante probada — Cormorant, Playfair, Bodoni, EB Garamond...) dibuja la "J" mayúscula con un gancho que baja de la línea base; es una convención tipográfica clásica pero al usuario no le convencía visualmente. Lora resuelve el problema (J apoyada en la línea base, en redonda y en cursiva) manteniendo el mismo nivel de elegancia. También se corrigió el símbolo "&" del hero, que con la cursiva de Fraunces se veía como una "e" estilizada.
- Quitado el campo "Número de acompañantes" del formulario RSVP (y de la columna correspondiente en Google Sheets).
- Arreglado un desalineado visual: la pregunta "¿Asistirás? *" no estaba alineada con el resto de campos del formulario (el `<fieldset>` traía relleno por defecto del navegador).
- Cambiadas las opciones de "¿Necesitarás transporte?" a simplemente Sí / No / Aún no lo sé.
- Añadidas fotos reales de la pareja: dos en el hero (marcos con forma de arco, izquierda y derecha) y una en el footer (marco circular). Imágenes convertidas de HEIC/PNG a JPEG optimizado en `assets/`.
- **Cambio de backend del formulario RSVP**: de Formspree a **Google Sheets** (vía Google Apps Script). Motivo: el plan gratuito de Formspree resultó no ser realmente gratis / demasiado limitado. Cada confirmación se guarda como fila en una Google Sheet propia del usuario, sin límite de envíos. Ver `google-apps-script.gs` y las instrucciones en `README.md`.
- Construcción inicial de la web: `index.html`, `style.css`, `script.js` — landing de una sola página estilo "elegante mediterráneo" (piedra caliza, olivo, terracota, oro), con hero + cuenta atrás, sección "La boda", "Detalles", mapa "Cómo llegar" con botón de ruta a Google Maps, y formulario de confirmación de asistencia.

## Decisiones y datos clave a tener en cuenta

- **Boda**: Marina & Jaime, 3 de julio de 2027, Carretera Alaró–Orient Km 3, 07340 Alaró, Mallorca. Hora de ceremonia puesta de forma provisional a las 17:00 (constante `WEDDING_DATE` en `script.js` y horario en el `.ics`/Google Calendar — hay que ajustarla si cambia).
- **Backend del RSVP**: Google Sheets vía Apps Script (no Formspree). La URL se pega en `SHEET_SCRIPT_URL` en `script.js`. Mientras no esté configurada, el formulario avisa y el contador en vivo no se muestra (comportamiento esperado, no es un bug).
- **Tipografía**: Lora (títulos) + Jost (cuerpo). No volver a Fraunces para los títulos sin resolver antes el problema de la "J" con descendente.
- Boda solo para adultos (sin niños) — así está reflejado en la FAQ.
- Habrá aparcamiento en el propio recinto y transporte organizado (autobús) de ida y vuelta desde el pueblo — reflejado en la FAQ y ya preguntado en el propio formulario RSVP.
- **La boda es en el Hotel Rural S'Olivaret & Spa** (misma dirección que la finca de la boda). Código promocional para invitados que se alojen ahí la noche de la boda: **MARINAYJAIME27** (ya en la sección "¿Dónde alojarse?").
