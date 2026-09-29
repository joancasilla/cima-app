# CIMA APP — SEMS Ingeniería

**Construcción Industrializada y Montaje Ágil**

Aplicación web para gestión de preempacado de materiales de construcción y generación de etiquetas térmicas 4×6".

## Stack

- **Frontend:** HTML5 + Tailwind CSS + SheetJS (hospedado en GitHub Pages)
- **Backend:** Google Apps Script como API (escribe en Google Sheets)
- **Dominio:** cima.sems.com.do

## Nueva plantilla de preempacados

Columnas: `Apto`, `Código del preempacado`, `Fase`, `Codigo` (material),
`Descripcion`, `Unidad`, `Cantidad` y `Cantidad a empacar`.

- Los encabezados pueden aparecer después del título del archivo; se buscan en las primeras 50 filas.
- Cada código del preempacado forma un grupo y debe tener el mismo Apto y Fase en todas sus filas.
- `Cantidad` indica material por paquete. `Cantidad a empacar` se repite por fila y se toma una sola vez por grupo; nunca se suma.
- Las cantidades de paquetes distintas dentro de un mismo grupo se rechazan con el número de fila. Corrige el Excel y vuelve a cargarlo.
- Si no hay cantidad a empacar, se propone 1 y se indica en Kits. Los valores vacíos no reemplazan una cantidad informada en otra fila del grupo.
- En Kits se puede modificar **Paquetes a imprimir**, siempre como entero mayor que cero. El total y las etiquetas usan ese valor.
- La etiqueta 4 × 6 conserva el código del Excel, Apto y Fase, y muestra `Paquete N de M`. El QR incluye estos datos y el proyecto.
- La plantilla descargable usa las nuevas ocho columnas. Se conserva el lector anterior cuando no se asigna Código del preempacado.
- Apps Script conserva `ping` y `registrarImpresion` y añade `guardarEmpaques` y `obtenerEmpaque`. Debe actualizarse `Code.gs` antes de usar los nuevos QR.

## QR con ficha móvil

Antes de imprimir se guarda una copia del contenido en `Empaques_CIMA`, en la misma hoja de cálculo del historial. Cada grupo recibe un identificador aleatorio; el número de paquete forma parte del enlace. La ficha mantiene su contenido original aunque se cargue otro Excel o se cambien las cantidades. Reintentar durante la misma sesión no duplica la ficha.

El QR se genera localmente con `vendor/qrcode.js` (qrcode-generator 1.4.4, MIT), sin enviar sus datos a un servicio externo. Abre `empaque.html`, que consulta el detalle mediante la API. Se necesita conexión a Internet. Quien tenga el QR o su enlace podrá ver esa ficha; no se publica un listado de empaques.

La app bloquea la impresión si no puede confirmar el guardado de las fichas. Después del diálogo de impresión pide confirmar si las etiquetas se imprimieron antes de registrarlas en el historial. Si falla el historial, lo indica; los enlaces guardados siguen disponibles.

Pruebas de lectura y validación: `node --test tests/preempacados.test.cjs`.
La revisión visual se realizó con los 24 grupos / 177 renglones de la plantilla de Crux Residences; los grupos de hasta 18 materiales caben completos. Verifica una etiqueta en la impresora térmica antes de una tirada completa.

## Configuración

### 1. GitHub Pages
- Settings → Pages → Branch: `main` / `root`
- Custom domain: `cima.sems.com.do`

### 2. DNS (Route 53)
- Record: `cima` → CNAME → `TU-USUARIO.github.io`

### 3. Google Apps Script
- Pegar `Code.gs` en el proyecto de Apps Script
- Deploy → Web App → Anyone
- Actualizar la implementación existente con una nueva versión de `Code.gs`, conservando su URL.
- La URL de la API y el dominio público de los QR se configuran en `config.js`.

## Estructura
```
index.html   → Aplicación completa (frontend)
empaque.html → Ficha móvil que abre el QR
config.js    → URL de API y dominio público
api.js       → Solicitudes a Apps Script
vendor/      → Generador de QR local
CNAME        → Dominio personalizado para GitHub Pages
Code.gs      → Backend (se pega en Google Apps Script, NO en este repo)
```
