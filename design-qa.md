# Design QA · V2 · 2 de noviembre de 2026

**final result: passed**

Resultado referido a la interfaz y alternativa fotográfica comprobadas en Chrome. La rama GPU y Safari real quedan como huecos de validación explícitos, no se declaran probados.

## Fuente y evidencia

La corrección del usuario reemplaza el objetivo de reproducir la antigua maqueta: rechaza las formas geométricas y pide coche, carretera y bosque de aspecto fotográfico. Tonos claros y fotografías originales se mantienen. Fuentes visuales: `public/scenes/forest-road-v2.png` (1672×941) y `car-photo-v2.png` (1536×1024, alfa). La antigua `reference/propuesta-elegida.png` solo documenta el origen de la paleta y dirección editorial.

Comparación conjunta abierta e inspeccionada: `reference/comparacion-v2.jpg`, 1600×1200, con fuentes y capturas de escritorio y móvil en la misma lámina. La normalización mantiene proporciones; no es una comparación de igualdad de píxeles porque las fuentes son recursos, no una maqueta completa. En móvil se permite recorte lateral del paisaje para mantener coche y carretera visibles.

Capturas reales de implementación en `reference/qa-v2/`:
- `boda-v2-carretera.jpg`: 1348×926, coche al 15%, escritorio.
- `boda-v2-movil.jpg`: 390×844, recorte del marco responsive. Área de contenido de 375 px por scrollbar de escritorio, no emulación de Safari.
- `boda-v2-portada-abierta.jpg`: 1348×926, apertura completada, tarjeta a la derecha.
- `boda-v2-web-completa.jpg`: 1348×10444, animaciones pausadas. La zona de mapas se incorpora desde una segunda captura completa de idéntica página y dimensiones con los iframes visibles: el navegador suspendía su pintura fuera de pantalla. No se han sustituido fotos ni datos para esta captura.

## Hallazgos y correcciones

- P1, portada abierta: la tarjeta tapaba la cara de Marina. Se desplazó a la derecha en escritorio. La captura posterior confirma ambos rostros visibles.
- P2, botón de apertura: se sustituyó el desplazamiento nativo por ScrollToPlugin para sincronizar mejor el despliegue. La captura posterior muestra fotografía completa y confirmación.
- P2, galería: el estado de arrastre podía bloquear la siguiente apertura con teclado. Se limpia al suprimir el clic que sigue al arrastre. La navegación siguiente, ampliación, siguiente en diálogo y cierre funcionan.
- P2, fotografía original hero-derecha: ya no aparecía en el recorrido visible tras la reorganización. Se recuperó junto a la fotografía final. Sus bytes siguen intactos.
- P2, selector de lugares: añadida navegación mediante flechas/Home/End y tabulación al elemento activo.
- P2, retorno al scroll: restablece la posición real del ScrollTrigger y no un cero arbitrario. Se detiene la reproducción automática al salir de la escena o al ocultar la pestaña.

No quedan P0/P1/P2 visuales observados en los estados inspeccionados. No se ha evaluado una sesión completa en un dispositivo físico.

## Superficies revisadas

- Tipografía: mismas familias editoriales locales y sistema claro; títulos, controles y etiquetas legibles en escritorio y marcos 390/430. No se afirma fidelidad literal a la composición V1 rechazada.
- Ritmo: portada expansiva, galería horizontal, exploradores de lugares y hoteles, carretera a pantalla ancha; no se observó desbordamiento de body en 375/415 px de contenido ni escritorio.
- Color: marfil/oliva, contraste de texto sobre paneles claros; paisaje cálido. Se mantiene un panel de lectura sobre la imagen.
- Imágenes: se usan exactamente los nuevos recursos fotorealistas en la implementación; no se han sustituido por dibujos de CSS. Coche recortado conserva transparencia y sombra. Las fotos de la pareja y hoteles siguen siendo originales. El fondo no es una foto comprobada del trayecto.
- Contenido: `npm run check:content` confirma 26 archivos originales por SHA-256, 14 fotos de historia, 7 preguntas completas, 4 alojamientos, 2 ubicaciones, 7 campos y calendario. La información real del autobús se mantiene separada de la escena ilustrativa.

## Interacciones probadas

Apertura desde botón; avance del coche con scroll; slider Home/End/flecha (posición de 1% a 100% y cambio geométrico en DOM); iniciar reproducción; zoom; pausa global y reproducción deshabilitada en estado estático; menú móvil; siguiente recuerdo, ampliación, cambio de imagen en diálogo y cierre; selección de otro hotel con cambio de foto; FAQ de transporte; formulario demo completo con mensaje de éxito sin envío; carga visible de ambos mapas originales. La galería admite arrastre por código y desplazamiento nativo; no se ha verificado un gesto táctil físico.

Consola: revisión sin errores de la aplicación. Aparecen mensajes de una extensión del navegador ajenos al proyecto. No hay contexto WebGL2 disponible: se ha comprobado la alternativa fotográfica, no el render físico del modelo. No se han enviado formularios reales ni publicado nada.

## Huecos de validación y seguimiento

Safari/iPhone físico, render del modelo WebGL, importación efectiva del .ics, licencia original del modelo antes de publicación. El modelo y el recorte de reserva muestran coches distintos, documentado como diferencia aceptada en esta entrega local; no son vehículos contratados. La escena es fotografía en capas más modelo 3D opcional, no un bosque 3D recorrible.

Build y comprobación de contenido completados. Instrucciones actualizadas para Claude. El prototipo queda independiente.
