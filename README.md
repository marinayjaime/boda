# Web de la boda — Marina & Jaime

Web de la boda del **3 de julio de 2027** (ceremonia en Palma, celebración en Alaró, Mallorca).
Publicada en **https://marinayjaime.github.io/boda/** (repo [marinayjaime/boda](https://github.com/marinayjaime/boda), rama `main`, GitHub Pages sirviendo desde la raíz `/`).

Diseño "Atlas de luz" (noviembre de 2026), hecho con React + Vite. Historial de cambios y decisiones: `CHANGELOG.md`.

## Cómo está organizado

- `codigo/` — **el código fuente**. Aquí se hacen los cambios:
  - `codigo/src/` — páginas, componentes y estilos (`App.jsx`, `styles.css`, `experience.css`…)
  - `codigo/src/content.json` — textos e información de la boda
  - `codigo/src/config.js` — URL del formulario (Google Sheets) y fecha/hora de la boda
  - `codigo/public/` — fotos, tipografías, escenas e `.ics` del calendario
- Raíz (`index.html`, `assets/`, `fonts/`, `models/`, `scenes/`…) — **la web ya compilada**, que es lo que sirve GitHub Pages. Se genera sola; no editar a mano.
- `google-apps-script.gs` — script de Google Sheets que recibe las confirmaciones y alimenta el contador.

## Hacer un cambio y publicarlo

```bash
cd "WEB BODA/codigo"
npm install        # solo la primera vez en cada ordenador
npm run dev        # ver en local mientras se edita (http://localhost:5173)
npm run build      # comprueba el contenido, compila y copia la web a la raíz
cd ..
git add -A
git commit -m "Describe aquí el cambio"
git push
```

GitHub Pages se actualiza en 1–2 minutos tras cada `push`. Si solo se cambia `CHANGELOG.md` o este README, no hace falta `npm run build`.

## Formulario (RSVP)

Envía cada confirmación como fila nueva a la hoja "Confirmaciones" de Google Sheets (nombre, email, asistencia, transporte, alergias, canción, mensaje) y muestra el contador en vivo. La URL del Apps Script está en `codigo/src/config.js`; `demo: true` desactiva los envíos para hacer pruebas.

Si se edita el script en Apps Script, hay que volver a **Implementar > Gestionar implementaciones > editar (lápiz) > Nueva versión** para que los cambios se apliquen a la URL publicada.
