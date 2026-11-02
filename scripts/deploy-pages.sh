#!/usr/bin/env bash
# Publica la web en GitHub Pages sin GitHub Actions.
# Compila el proyecto y sube el contenido de dist/client a la rama gh-pages,
# que es la que sirve https://marinayjaime.github.io/boda/
# Uso: npm run deploy
set -euo pipefail

cd "$(dirname "$0")/.."

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Hay cambios sin guardar en git. Haz commit antes de publicar." >&2
  exit 1
fi

npm run check:content
npm run build

SRC_COMMIT="$(git rev-parse --short HEAD)"
TMP="$(mktemp -d)"
trap 'git worktree remove --force "$TMP" >/dev/null 2>&1 || true; rm -rf "$TMP"' EXIT

git fetch -q origin gh-pages 2>/dev/null || true
if git show-ref --verify --quiet refs/remotes/origin/gh-pages; then
  git worktree add -q -B gh-pages "$TMP" origin/gh-pages
else
  git worktree add -q --detach "$TMP"
  git -C "$TMP" checkout -q --orphan gh-pages
fi

# Sustituye todo el contenido de la rama por la compilación nueva
git -C "$TMP" rm -rq --ignore-unmatch . >/dev/null
cp -R dist/client/. "$TMP"/
rm -f "$TMP"/qa-responsive.html
touch "$TMP"/.nojekyll

git -C "$TMP" add -A
if git -C "$TMP" diff --cached --quiet; then
  echo "No hay cambios que publicar."
  exit 0
fi
git -C "$TMP" commit -q -m "Publica la web (desde $SRC_COMMIT)"
git -C "$TMP" push -q origin gh-pages
echo "Publicado. GitHub Pages tarda 1-2 minutos en actualizarse."
