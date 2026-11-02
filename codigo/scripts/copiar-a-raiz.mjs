// Copia la web compilada (dist/client) a la raíz del repositorio,
// que es lo que sirve GitHub Pages. Uso: npm run build (desde codigo/)
import { cpSync, existsSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const codigo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const raiz = resolve(codigo, '..');
const dist = join(codigo, 'dist', 'client');

if (!existsSync(join(dist, 'index.html'))) {
  console.error('No existe dist/client/index.html: la compilación ha fallado.');
  process.exit(1);
}

// Solo se tocan estos nombres en la raíz; CHANGELOG, README, codigo/, etc. no se tocan.
const generados = ['index.html', 'assets', 'fonts', 'fonts.css', 'models', 'scenes', 'boda-marina-jaime.ics'];
const omitir = new Set(['qa-responsive.html']);

for (const nombre of generados) rmSync(join(raiz, nombre), { recursive: true, force: true });

for (const nombre of readdirSync(dist)) {
  if (omitir.has(nombre)) continue;
  if (!generados.includes(nombre)) {
    console.error(`Aviso: "${nombre}" no está en la lista de archivos generados; añádelo a copiar-a-raiz.mjs para que se limpie en la próxima compilación.`);
  }
  cpSync(join(dist, nombre), join(raiz, nombre), { recursive: true });
}
writeFileSync(join(raiz, '.nojekyll'), '');
console.log('Web copiada a la raíz del repositorio. Ahora: commit y push.');
