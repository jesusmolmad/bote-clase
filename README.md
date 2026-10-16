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
