window.BOTE_CONFIG = {
  spreadsheetId: "1Rv00cFZS9aUP-5anhkfh3uCOHH7x47vW_aWsRz56CsM",
  resumenSheet: "Resumen",
  movimientosSheet: "Movimientos",

  // Datos de respaldo: se muestran si Google Sheets todavía no está publicado
  // o si temporalmente no se puede conectar.
  fallback: {
    aportacionFamilia: 5,
    familiasTotal: 16,
    familiasPagadas: 15,
    familiasPendientes: 1,
    aportacionPrevista: 80,
    totalIngresado: 75,
    totalGastado: 0,
    saldoActual: 75,
    compraEncargada: "16 bandejas apilables",
    precioBandeja: 1.90,
    costePrevisto: 30.40,
    estadoCompra: "Encargada · pendiente de pago",
    saldoComprometido: 44.60,
    movimientos: [
      {
        fecha: "15/10/2026",
        concepto: "Aportaciones de 15 familias",
        tipo: "Ingreso",
        importe: 75,
        observaciones: "15 de 16 familias han aportado 5 €. Queda 1 familia pendiente.",
        referencia: ""
      }
    ]
  }
};
