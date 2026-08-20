# Web de la boda — Marina & Jaime

Web estática (HTML/CSS/JS, sin build ni dependencias) para la boda del **3 de julio de 2027** en Alaró, Mallorca.

## Archivos

- `index.html` — contenido de la página
- `style.css` — estilos
- `script.js` — cuenta atrás, menú móvil, animaciones y envío del formulario
- `google-apps-script.gs` — script para pegar en Google Sheets (recibe las confirmaciones)

## Antes de publicarla

1. **Conectar el formulario de confirmación (RSVP) a Google Sheets**
   Cada confirmación se guardará como una fila nueva en una hoja de cálculo tuya. Es gratis, sin límite de envíos y no depende de servicios externos.

   - Ve a [sheets.google.com](https://sheets.google.com) y crea una hoja nueva (p. ej. "Confirmaciones boda").
   - En el menú, ve a **Extensiones > Apps Script**. Se abrirá un editor de código en una pestaña nueva.
   - Borra todo el contenido que haya en `Code.gs` y pega el contenido completo del archivo `google-apps-script.gs` de este proyecto.
   - Guarda con el icono del disquete (o Cmd+S).
   - Arriba a la derecha, pulsa **Implementar > Nueva implementación**.
     - Tipo: selecciona **Aplicación web** (haz clic en el icono de engranaje si no lo ves).
     - Ejecutar como: **Yo** (tu cuenta de Google).
     - Quién tiene acceso: **Cualquier usuario**.
     - Pulsa **Implementar**. La primera vez te pedirá autorizar permisos: acepta (es tu propio script, es seguro).
   - Copia la URL que te da, termina en `/exec`.
   - Abre `script.js` y busca esta línea, casi al principio del archivo:
     ```js
     const SHEET_SCRIPT_URL = 'PON_AQUI_TU_URL_DE_GOOGLE_APPS_SCRIPT';
     ```
     Sustituye el texto entre comillas por la URL que copiaste.
   - Cada vez que alguien confirme, aparecerá como fila nueva en la hoja "Confirmaciones" de tu Google Sheet, con fecha, nombre, email, asistencia, transporte, alergias, canción y mensaje.
   - Con la misma URL, la web también muestra un contador en vivo ("X personas ya han confirmado") justo encima del formulario — no requiere ningún paso adicional, se activa solo en cuanto pegues la URL.

   > Si más adelante editas el script en Apps Script, tendrás que volver a **Implementar > Gestionar implementaciones > editar (lápiz) > Nueva versión** para que los cambios se apliquen a la URL ya publicada. Esto es necesario ahora mismo la primera vez, porque el script incluye tanto el guardado (`doPost`) como el contador en vivo (`doGet`).

2. **Revisar la hora de la ceremonia**
   En `script.js`, línea con `WEDDING_DATE`, está puesta a modo de ejemplo a las 17:00. Ajústala si es necesario:
   ```js
   const WEDDING_DATE = new Date('2027-07-03T17:00:00+02:00').getTime();
   ```

3. **Personalizar textos**
   - El texto de "Nuestra historia" es un placeholder — cámbialo por vuestra historia.
   - El "código de vestimenta" y la fecha límite de confirmación (1 de mayo de 2027) son orientativos, edítalos a vuestro gusto en `index.html`.
   - Las respuestas de la FAQ (aparcamiento, niños, transporte...) están escritas ya con vuestras respuestas reales — revisadlas igualmente antes de publicar por si cambia algo.
   - Los alojamientos recomendados (sección "¿Dónde alojarse?") son una selección orientativa cerca de Alaró — comprobad disponibilidad antes de recomendarlos activamente a los invitados.

## Cómo verla en local

Abre `index.html` haciendo doble clic, o desde la terminal:

```bash
cd "WEB BODA"
python3 -m http.server 8000
```

y visita `http://localhost:8000`.

## Publicada en GitHub Pages

La web ya está publicada en: **https://marinayjaime.github.io/Boda-Marina-y-Jaime/**

Repo: [github.com/marinayjaime/Boda-Marina-y-Jaime](https://github.com/marinayjaime/Boda-Marina-y-Jaime) (rama `main`, GitHub Pages sirviendo desde la raíz `/`).

Para publicar cambios nuevos, desde la carpeta del proyecto:

```bash
git add -A
git commit -m "Describe aquí el cambio"
git push
```

GitHub Pages redespliega solo en 1–2 minutos tras cada `push` a `main`. Se puede conectar un dominio propio (tipo marinayjaime.com) desde **Settings > Pages > Custom domain** en el repo.

## Datos ya incluidos

- Mapa y botón "Cómo llegar" apuntan a: Carretera Alaró–Orient, Km 3, 07340 Alaró, Mallorca.
- El formulario pide: nombre, email, asistencia (sí/no), transporte, alergias, canción y mensaje — con protección básica anti-spam (honeypot).
- Botones "Guardar la fecha" (Google Calendar y descarga .ics para Apple/Outlook) debajo de la cuenta atrás.
- Sección "Tiempo previsto" con la media histórica de julio en Alaró (no existe predicción real a más de un año vista).
- Sección "¿Dónde alojarse?" con hoteles y casas rurales reales cerca de Alaró, enlazados a Google Maps.
- Sección de Preguntas frecuentes (FAQ) en formato acordeón.
- Contador en vivo de confirmaciones en la sección de RSVP (se activa solo al conectar Google Sheets).
