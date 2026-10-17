# 1.º Primaria · CEIP Virgen del Castillo · Curso 2026/27

Panel informativo para las familias.

## Estructura de la web

- Agenda
- Últimas novedades
- Estado del bote común
- Compras y gastos previstos
- Movimientos
- Tickets y facturas
- Información útil

## Google Sheets

La web utiliza esta hoja:

https://docs.google.com/spreadsheets/d/1Rv00cFZS9aUP-5anhkfh3uCOHH7x47vW_aWsRz56CsM/edit

Pestañas:

### Resumen
Datos globales del bote.

### Movimientos
Solo ingresos y gastos que ya han ocurrido.

### Agenda
Columnas:
`Fecha | Tipo | Título | Detalle | Importe | Estado | Enlace`

Tipos recomendados:
- Evento
- Fecha límite
- Pago
- Recordatorio
- Aviso

Estados:
- Pendiente
- Próximo
- Completado
- Cancelado

Los elementos Completados o Cancelados no se muestran en la web.

### Novedades
Columnas:
`Fecha | Tipo | Título | Detalle | Destacar hasta | Enlace`

Mientras la fecha de `Destacar hasta` no haya pasado, aparece la etiqueta roja `NUEVO`.

### Compras previstas
Columnas:
`Fecha | Concepto | Unidades | Precio unidad | Coste total | Estado | Observaciones`

Estados:
- Prevista
- Encargada
- Pagada
- Cancelada

Cuando una compra se paga:
1. Añade el gasto real en `Movimientos`.
2. Cambia su estado en `Compras previstas` a `Pagada`.
Así deja de descontarse como compromiso y pasa a figurar como gasto real.

### Tickets y facturas
En `Movimientos`, pega el enlace público de Google Drive en `Justificante / referencia`.
La web mostrará automáticamente un botón para abrirlo.

## Publicación en GitHub Pages

Sustituye en tu repositorio los archivos:
- index.html
- styles.css
- app.js
- config.js
- logo.png
- README.md
- .nojekyll

Después haz `Commit changes`. GitHub Pages se actualizará automáticamente.

## Privacidad

No incluyas nombres de menores, familias, teléfonos u otros datos personales en las pestañas públicas.


## Versión V5

- La agenda utiliza la paleta del logo: verde, turquesa, crema/dorado, coral y gris azulado.
- Cada tipo de agenda tiene icono, color y bloque visual propio.
- Los accesos rápidos son botones.
- Los enlaces externos se presentan como botones de acción.
- El bloque del bote mantiene una explicación clara de saldo, ingresos, gastos y compras pendientes.


## Versión V6

- Se elimina el bloque separado de Novedades.
- La Agenda pasa a ser el bloque principal.
- Los elementos se ordenan automáticamente desde la fecha más cercana a la más lejana.
- La fecha es el elemento visual más destacado.
- La pestaña Agenda incorpora `Acción principal`, para resaltar exactamente qué hay que hacer: firmar, pagar, llevar material, confirmar asistencia, etc.
- Los elementos sin fecha concreta aparecen al final.


## Versión V6.2

Se ha cambiado la carga de datos para evitar el parpadeo de la agenda:
- La agenda permanece en `Cargando agenda…` hasta recibir Google Sheets.
- Cada pestaña se carga de forma independiente.
- Un fallo en Resumen, Movimientos o Compras ya no puede borrar la Agenda.
- Si la Agenda no responde, se muestran los seis elementos de respaldo, no solo uno.

## V7 · Caducidad visual de la agenda

- Hasta su fecha final, el aviso mantiene su color habitual.
- Durante los días 1, 2 y 3 posteriores a la fecha final se muestra en gris con el estado FINALIZADO.
- A partir del cuarto día posterior desaparece automáticamente de la web, pero permanece guardado en Google Sheets.
- Los intervalos (por ejemplo 19–23/10/2026) utilizan el último día como fecha final.
- Los avisos sin fecha permanecen visibles hasta que se marquen como Completado o Cancelado.
- El estado Completado/Cancelado oculta inmediatamente cualquier aviso.
