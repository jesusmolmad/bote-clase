window.BOTE_CONFIG = {
  spreadsheetId: "1Rv00cFZS9aUP-5anhkfh3uCOHH7x47vW_aWsRz56CsM",
  resumenSheet: "Resumen",
  movimientosSheet: "Movimientos",
  agendaSheet: "Agenda",

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
      },
    ],
    agenda: [
      { fecha: "19/10/2026", tipo: "Fecha límite", titulo: "Autorización · Castillo de Alcaudete", detalle: "Último día para responder la autorización. La actividad es voluntaria y gratuita.", importe: "", estado: "Pendiente", enlace: "" },
      { fecha: "19/10/2026", tipo: "Recordatorio", titulo: "Inicio de caligrafía", detalle: "Llevar «Letra a letra 1, cuadrícula», editorial Bruño, si aún falta.", importe: "", estado: "Pendiente", enlace: "" },
      { fecha: "19–23/10/2026", tipo: "Pago", titulo: "Dinero de excursión y tickets de Halloween", detalle: "La tutora ha indicado que deben llevarse durante esta semana. No consta un día exacto.", importe: "", estado: "Pendiente", enlace: "" },
      { fecha: "22/10/2026", tipo: "Fecha límite", titulo: "Confirmar asistencia a Halloween", detalle: "Comunicar por Séneca si se asistirá y cuántas personas irán.", importe: "3 €", estado: "Pendiente", enlace: "" },
      { fecha: "26/10/2026", tipo: "Evento", titulo: "Halloween en el colegio", detalle: "De 16:45 a 19:00 aprox. Cuentacuentos, merienda y pasillo del terror.", importe: "3 €", estado: "Próximo", enlace: "" },
      { fecha: "Sin fecha", tipo: "Pago", titulo: "Bote común de clase", detalle: "Queda 1 familia pendiente de aportar al bote común.", importe: "5 €", estado: "Pendiente", enlace: "" }
    ]
  }
};
