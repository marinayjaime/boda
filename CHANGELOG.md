# Registro de cambios — Web de la boda

Historial de todo lo que se ha ido haciendo en el proyecto, sesión a sesión. Lo más reciente va arriba.

## Ideas propuestas, aún sin implementar

Sugeridas el 2026-08-18, pendientes de que el usuario diga cuáles quiere:

- **Vista previa al compartir el enlace** (meta tags Open Graph/Twitter Card + imagen): ahora mismo compartir el link por WhatsApp/email no muestra ninguna tarjeta con foto. Prioridad alta, fácil de hacer.
- **Email de confirmación automático al invitado** al rellenar el RSVP (vía `MailApp` en el mismo Apps Script), además de guardarlo en la Sheet.
- Favicon (icono de pestaña del navegador) — no tiene ninguno todavía.
- Cerrar el formulario automáticamente pasado el 1 de mayo de 2027, con mensaje de plazo terminado.
- Botón para compartir directamente por WhatsApp.
- Revisión de accesibilidad (contraste, navegación por teclado en menú y FAQ).
## 2026-08-20

- **Web publicada de verdad**: repo git creado (`Boda-Marina-y-Jaime`, antes no existía control de versiones) y desplegado en **GitHub Pages**. URL pública: https://marinayjaime.github.io/Boda-Marina-y-Jaime/ — repo en https://github.com/marinayjaime/Boda-Marina-y-Jaime. A partir de ahora, cualquier cambio se publica haciendo `git add -A && git commit -m "..." && git push` (GitHub Pages redespliega solo en 1–2 min). Instrucciones actualizadas en `README.md`.

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
