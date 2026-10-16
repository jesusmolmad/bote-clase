# Bote de clase · Curso 2026/27

Landing pública para consultar de forma sencilla el estado del bote de clase.

## Datos actuales incluidos como respaldo

- 16 familias.
- Aportación de 5 € por familia.
- 15 familias han pagado: 75 € ingresados.
- 1 familia pendiente.
- 16 bandejas apilables encargadas a 1,90 €: 30,40 € previstos.
- La compra aún no está pagada, por lo que el gasto real sigue en 0 €.
- Saldo actual: 75 €.
- Saldo tras reservar el compromiso: 44,60 €.

La web intenta leer estos datos directamente de Google Sheets. Si no puede conectar, muestra estos valores de respaldo.

---

## 1. Publicar la hoja para que la web pueda leerla

La hoja utilizada es:

https://docs.google.com/spreadsheets/d/1Rv00cFZS9aUP-5anhkfh3uCOHH7x47vW_aWsRz56CsM/edit

En Google Sheets:

1. Pulsa **Compartir**.
2. En **Acceso general**, selecciona **Cualquier persona con el enlace**.
3. Déjalo como **Lector**.
4. Guarda.

Esto no permite editar la hoja; solo hace posible que la landing consulte los datos.

Si la landing siguiera mostrando “datos de respaldo”, utiliza la alternativa:

1. En Sheets: **Archivo > Compartir > Publicar en la web**.
2. Publica el documento.
3. No hace falta cambiar el código: vuelve a probar primero con el acceso por enlace. Si tu cuenta bloquea el endpoint de Google, entonces habría que adaptar `config.js` a la URL publicada.

## 2. Subir a GitHub

En el repositorio que ya has preparado:

1. Entra en el repositorio.
2. **Add file > Upload files**.
3. Sube estos archivos a la raíz:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `config.js`
   - `logo.png`
   - `.nojekyll`
4. Pulsa **Commit changes**.

## 3. Activar GitHub Pages

1. En el repositorio, abre **Settings**.
2. En el menú lateral: **Pages**.
3. En **Build and deployment**, elige:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/(root)**
4. Pulsa **Save**.

En uno o dos minutos GitHub mostrará una URL como:

`https://TU-USUARIO.github.io/NOMBRE-DEL-REPOSITORIO/`

Esa es la URL que puedes enviar a las familias.

## 4. Cómo actualizar el bote

No tienes que tocar GitHub.

Edita únicamente la Google Sheet:

### Pestaña “Movimientos”

Añade una fila por cada movimiento:

| Fecha | Concepto | Tipo | Importe | Observaciones | Referencia |
|---|---|---|---:|---|---|
| 15/10/2026 | Aportaciones de 15 familias | Ingreso | 75 | 15 de 16 familias han pagado | |
| ... | ... | Gasto | ... | ... | ... |

En **Tipo** usa exactamente:
- `Ingreso`
- `Gasto`

La pestaña `Resumen` calcula automáticamente ingreso, gasto y saldo.

### Cuando pague la familia pendiente

Añade un nuevo movimiento:

- Concepto: `Aportación familia pendiente`
- Tipo: `Ingreso`
- Importe: `5`

Y cambia “Familias que han pagado” a `16` en la pestaña `Resumen`.

### Cuando pagues las bandejas

Añade un movimiento:

- Concepto: `16 bandejas apilables`
- Tipo: `Gasto`
- Importe: `30,40`

Después cambia el bloque de compra pendiente del `Resumen` para indicar que ya está pagada o elimina el compromiso. Así el saldo “tras compromisos” no descontará dos veces el mismo importe.

## Archivos

- `index.html`: estructura de la web.
- `styles.css`: diseño.
- `config.js`: ID de la hoja y datos de respaldo.
- `app.js`: conexión con Google Sheets y lógica.
- `logo.png`: imagen del grupo.
- `.nojekyll`: evita procesamiento innecesario de GitHub Pages.

## Privacidad

No publiques nombres de alumnado ni de familias en la pestaña `Movimientos`. La landing está pensada para mostrar importes y conceptos generales, no datos personales.
