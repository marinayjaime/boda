import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const data=read('src/content.json'),original=read('reference/inventario-contenidos.json');
assert.deepEqual(data,original,'Los datos deben coincidir con el inventario extraído de la web original.');
assert.equal(data.stories.length,14);assert.equal(data.faq.length,7);assert.equal(data.stays.length,4);assert.equal(data.locations.length,2);
const assets=read('reference/assets-originales.json');
for(const a of assets){const bytes=fs.readFileSync('public/'+a.file);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),a.sha256,`Archivo original alterado: ${a.file}`);}
for(const story of data.stories)assert.ok(fs.existsSync('public/'+story.src));
const jsx=fs.readFileSync('src/App.jsx','utf8');
for(const name of ['Nombre','Email','Asistencia','Transporte','Alergias','Canción','Mensaje','_gotcha'])assert.ok(jsx.includes(`name="${name}"`),`Campo ausente: ${name}`);
const ics=fs.readFileSync('public/boda-marina-jaime.ics','utf8').replace(/\r?\n /g,'');assert.ok(ics.includes('DTSTART:20270703T150000Z'));assert.ok(ics.includes('DTEND:20270703T210000Z'));assert.ok(ics.includes('Boda de Marina & Jaime'));
console.log(`Correcto: ${assets.length} archivos originales intactos, 14 fotos de historia, 7 preguntas completas, 4 alojamientos, 2 ubicaciones, 7 campos y calendario.`);
