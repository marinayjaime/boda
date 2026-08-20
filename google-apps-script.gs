/**
 * Script para recibir las confirmaciones del formulario de la web de la boda
 * y guardarlas como filas en esta misma Google Sheet.
 *
 * INSTALACIÓN (ver README.md para el paso a paso con capturas):
 * 1. Crea una Google Sheet nueva en Google Drive.
 * 2. Extensiones > Apps Script.
 * 3. Borra el contenido de Code.gs y pega este archivo entero.
 * 4. Guarda (icono del disquete).
 * 5. Implementar > Nueva implementación > tipo "Aplicación web".
 *    - Ejecutar como: Yo (tu cuenta)
 *    - Quién tiene acceso: Cualquier usuario
 * 6. Copia la URL que termina en /exec y pégala en script.js
 *    en la constante SHEET_SCRIPT_URL.
 */

const SHEET_NAME = 'Confirmaciones';
const ASISTE_VALUE = 'Sí, allí estaré';
const TRANSPORTE_VALUE = 'Sí';

// Responde a los contadores en vivo de la web: nº de personas confirmadas,
// nº que necesitan transporte y nº de canciones enviadas.
function doGet(e) {
  const sheet = getOrCreateSheet_();
  const values = sheet.getDataRange().getValues();
  let confirmados = 0;
  let transporte = 0;
  let canciones = 0;
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (row[3] === ASISTE_VALUE) confirmados++;
    if (row[4] === TRANSPORTE_VALUE) transporte++;
    if (row[6] && String(row[6]).trim() !== '') canciones++;
  }
  return ContentService.createTextOutput(JSON.stringify({ confirmados, transporte, canciones }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = getOrCreateSheet_();
  const p = e.parameter;

  // Anti-spam: si el campo oculto "_gotcha" viene relleno, es un bot.
  if (p['_gotcha']) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'ignored' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  sheet.appendRow([
    new Date(),
    p['Nombre'] || '',
    p['Email'] || '',
    p['Asistencia'] || '',
    p['Transporte'] || '',
    p['Alergias'] || '',
    p['Canción'] || '',
    p['Mensaje'] || '',
  ]);

  return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Fecha de envío',
      'Nombre',
      'Email',
      'Asistencia',
      'Transporte',
      'Alergias',
      'Canción',
      'Mensaje',
    ]);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, 8);
  }
  return sheet;
}
