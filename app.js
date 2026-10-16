(() => {
  "use strict";

  const cfg = window.BOTE_CONFIG;
  const $ = (id) => document.getElementById(id);
  const money = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

  function setText(id, value) {
    const el = $(id);
    if (el) el.textContent = value;
  }

  function setSync(state, text) {
    const el = $("syncStatus");
    if (!el) return;
    el.className = "sync-pill sync-pill--" + state;
    el.innerHTML = '<span class="sync-dot"></span>' + text;
  }

  function render(data, connected) {
    setText("saldoActual", money.format(data.saldoActual || 0));
    setText("totalIngresado", money.format(data.totalIngresado || 0));
    setText("totalGastado", money.format(data.totalGastado || 0));
    setText("saldoComprometido", money.format(data.saldoComprometido ?? data.saldoActual ?? 0));

    setText("aportacionFamilia", money.format(data.aportacionFamilia || 0));
    setText("familiasPendientes", String(data.familiasPendientes ?? Math.max(0, (data.familiasTotal || 0) - (data.familiasPagadas || 0))));
    setText("aportacionPrevista", money.format(data.aportacionPrevista || 0));

    const total = Number(data.familiasTotal || 0);
    const pagadas = Number(data.familiasPagadas || 0);
    const pct = total > 0 ? Math.min(100, Math.max(0, (pagadas / total) * 100)) : 0;

    setText("familiasBadge", `${pagadas} / ${total}`);
    const h2 = document.querySelector(".contribution-panel h2");
    if (h2) h2.textContent = `${pagadas} de ${total} familias han pagado`;
    const bar = $("progressBar");
    if (bar) bar.style.width = pct + "%";

    setText("compraEncargada", data.compraEncargada || "Sin compras pendientes");
    setText("precioBandeja", money.format(data.precioBandeja || 0));
    setText("costePrevisto", money.format(data.costePrevisto || 0));
    setText("estadoCompra", data.estadoCompra || "Sin compras pendientes");

    renderMovements(data.movimientos || []);
    renderReceipts(data.movimientos || []);
    renderAgenda(data.agenda || []);

    const now = new Date();
    const time = new Intl.DateTimeFormat("es-ES", {
      dateStyle: "short",
      timeStyle: "short"
    }).format(now);

    setText(
      "lastSync",
      connected
        ? `Datos sincronizados con Google Sheets: ${time}.`
        : `Mostrando datos de respaldo. Último intento de conexión: ${time}.`
    );

    setSync(
      connected ? "ok" : "error",
      connected ? "Datos actualizados desde Google Sheets" : "Mostrando datos de respaldo"
    );
  }

  function renderMovements(items) {
    const box = $("movementsList");
    if (!box) return;

    if (!items.length) {
      box.innerHTML = '<div class="empty-state">Todavía no hay movimientos registrados.</div>';
      return;
    }

    box.innerHTML = items.map(item => {
      const isIncome = String(item.tipo || "").toLowerCase().includes("ingreso");
      const amount = Number(item.importe || 0);
      const sign = isIncome ? "+" : "−";
      const cls = isIncome ? "income" : "expense";
      const obs = item.observaciones ? `<p>${escapeHtml(item.observaciones)}</p>` : "";
      return `
        <article class="movement">
          <div class="movement__icon movement__icon--${cls}">${isIncome ? "+" : "−"}</div>
          <div class="movement__body">
            <div class="movement__top">
              <strong>${escapeHtml(item.concepto || "Movimiento")}</strong>
              <span class="movement__amount movement__amount--${cls}">${sign}${money.format(Math.abs(amount))}</span>
            </div>
            <div class="movement__meta">
              <span>${escapeHtml(item.fecha || "")}</span>
              <span>${escapeHtml(item.tipo || "")}</span>
            </div>
            ${obs}
          </div>
        </article>`;
    }).join("");
  }



  function renderAgenda(items) {
    const box = $("agendaList");
    if (!box) return;
    const visible = (items || []).filter(item => {
      const estado = String(item.estado || "").toLowerCase();
      return estado !== "cancelado" && estado !== "completado";
    });
    if (!visible.length) {
      box.innerHTML = '<div class="empty-state">No hay fechas próximas registradas.</div>';
      return;
    }
    function chipClass(tipo) {
      const t = String(tipo || "").toLowerCase();
      if (t.includes("pago")) return "payment";
      if (t.includes("evento")) return "event";
      if (t.includes("límite") || t.includes("limite")) return "deadline";
      return "reminder";
    }
    box.innerHTML = visible.map(item => {
      const amount = item.importe ? `<div class="agenda-amount">${escapeHtml(item.importe)}</div>` : '<div></div>';
      const link = item.enlace && /^https?:\/\//i.test(item.enlace)
        ? `<a class="agenda-link" href="${escapeAttribute(item.enlace)}" target="_blank" rel="noopener noreferrer">Abrir enlace</a>`
        : "";
      return `
        <article class="agenda-item">
          <div class="agenda-date">${escapeHtml(item.fecha || "Sin fecha")}</div>
          <div class="agenda-main">
            <strong>${escapeHtml(item.titulo || "Recordatorio")}</strong>
            <div class="agenda-meta">
              <span class="agenda-chip agenda-chip--${chipClass(item.tipo)}">${escapeHtml(item.tipo || "Recordatorio")}</span>
              ${item.estado ? `<span class="agenda-chip">${escapeHtml(item.estado)}</span>` : ""}
            </div>
            ${item.detalle ? `<p class="agenda-detail">${escapeHtml(item.detalle)}</p>` : ""}
            ${link}
          </div>
          ${amount}
        </article>`;
    }).join("");
  }

  function extractAgenda(payload) {
    const rows = payload.table.rows || [];
    return rows
      .filter(r => r.c?.some(Boolean))
      .map(r => ({
        fecha: r.c?.[0]?.f ?? r.c?.[0]?.v ?? "",
        tipo: r.c?.[1]?.f ?? r.c?.[1]?.v ?? "",
        titulo: r.c?.[2]?.f ?? r.c?.[2]?.v ?? "",
        detalle: r.c?.[3]?.f ?? r.c?.[3]?.v ?? "",
        importe: r.c?.[4]?.f ?? r.c?.[4]?.v ?? "",
        estado: r.c?.[5]?.f ?? r.c?.[5]?.v ?? "",
        enlace: r.c?.[6]?.f ?? r.c?.[6]?.v ?? ""
      }))
      .filter(a => a.titulo || a.fecha);
  }

  function renderReceipts(items) {
    const box = $("receiptsList");
    if (!box) return;

    const receipts = items.filter(item => {
      const ref = String(item.referencia || "").trim();
      return ref && /^https?:\/\//i.test(ref);
    });

    if (!receipts.length) {
      box.innerHTML = '<div class="empty-state">Todavía no hay justificantes disponibles.</div>';
      return;
    }

    box.innerHTML = receipts.map(item => {
      const isIncome = String(item.tipo || "").toLowerCase().includes("ingreso");
      const label = isIncome ? "Justificante" : "Ver ticket o factura";
      const amount = Number(item.importe || 0);

      return `
        <article class="receipt">
          <div class="receipt__info">
            <strong>${escapeHtml(item.concepto || "Compra")}</strong>
            <div class="receipt__meta">
              <span>${escapeHtml(item.fecha || "")}</span>
              <span>${money.format(Math.abs(amount))}</span>
            </div>
          </div>
          <a class="receipt__button"
             href="${escapeAttribute(item.referencia)}"
             target="_blank"
             rel="noopener noreferrer">${label}</a>
        </article>`;
    }).join("");
  }

  function escapeAttribute(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[ch]));
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[ch]));
  }

  function gvizSheet(sheetName) {
    return new Promise((resolve, reject) => {
      const callback = "__gviz_" + Math.random().toString(36).slice(2);
      const script = document.createElement("script");
      const timer = setTimeout(() => cleanup(new Error("Tiempo de espera agotado")), 10000);

      function cleanup(err, payload) {
        clearTimeout(timer);
        delete window[callback];
        script.remove();
        err ? reject(err) : resolve(payload);
      }

      window[callback] = payload => cleanup(null, payload);
      script.onerror = () => cleanup(new Error("No se pudo cargar Google Sheets"));

      const id = encodeURIComponent(cfg.spreadsheetId);
      const sheet = encodeURIComponent(sheetName);
      script.src = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?sheet=${sheet}&tqx=responseHandler:${callback}`;
      document.head.appendChild(script);
    });
  }

  function tableToRows(payload) {
    if (!payload || payload.status === "error" || !payload.table) {
      throw new Error("Respuesta no válida de Google Sheets");
    }

    const cols = payload.table.cols || [];
    return (payload.table.rows || []).map(row => {
      const obj = {};
      (row.c || []).forEach((cell, i) => {
        const key = cols[i]?.label || cols[i]?.id || `col${i}`;
        obj[key] = cell ? (cell.f ?? cell.v ?? "") : "";
        obj[`__raw_${i}`] = cell ? cell.v : null;
      });
      return obj;
    });
  }

  function extractSummary(payload) {
    const rows = payload.table.rows || [];
    const map = {};
    rows.forEach(row => {
      const label = row.c?.[0]?.v;
      if (!label) return;
      const cell = row.c?.[1];
      map[String(label).trim()] = {
        raw: cell ? cell.v : null,
        formatted: cell ? (cell.f ?? cell.v ?? "") : ""
      };
    });

    const raw = label => map[label]?.raw;
    const text = label => map[label]?.formatted || "";

    return {
      aportacionFamilia: Number(raw("Aportación por familia") ?? cfg.fallback.aportacionFamilia),
      familiasTotal: Number(raw("N.º de familias") ?? cfg.fallback.familiasTotal),
      familiasPagadas: Number(raw("Familias que han pagado") ?? cfg.fallback.familiasPagadas),
      familiasPendientes: Number(raw("Familias pendientes") ?? cfg.fallback.familiasPendientes),
      aportacionPrevista: Number(raw("Aportación prevista") ?? cfg.fallback.aportacionPrevista),
      totalIngresado: Number(raw("Total ingresado") ?? cfg.fallback.totalIngresado),
      totalGastado: Number(raw("Total gastado") ?? cfg.fallback.totalGastado),
      saldoActual: Number(raw("Saldo actual") ?? cfg.fallback.saldoActual),
      compraEncargada: text("Compra encargada") || cfg.fallback.compraEncargada,
      precioBandeja: Number(raw("Precio por bandeja") ?? cfg.fallback.precioBandeja),
      costePrevisto: Number(raw("Coste previsto") ?? cfg.fallback.costePrevisto),
      estadoCompra: text("Estado de la compra") || cfg.fallback.estadoCompra,
      saldoComprometido: Number(raw("Saldo tras compromiso") ?? cfg.fallback.saldoComprometido)
    };
  }

  function extractMovements(payload) {
    const rows = payload.table.rows || [];
    return rows
      .filter(r => r.c?.some(Boolean))
      .map(r => {
        const dateCell = r.c?.[0];
        let fecha = dateCell?.f ?? dateCell?.v ?? "";

        // Google Visualization puede devolver Date(...)
        if (dateCell && typeof dateCell.v === "string" && dateCell.v.startsWith("Date(")) {
          const nums = dateCell.v.replace(/[^\d,]/g, "").split(",").map(Number);
          const d = new Date(nums[0], nums[1], nums[2]);
          fecha = new Intl.DateTimeFormat("es-ES").format(d);
        }

        return {
          fecha,
          concepto: r.c?.[1]?.f ?? r.c?.[1]?.v ?? "",
          tipo: r.c?.[2]?.f ?? r.c?.[2]?.v ?? "",
          importe: Number(r.c?.[3]?.v ?? 0),
          observaciones: r.c?.[4]?.f ?? r.c?.[4]?.v ?? "",
          referencia: r.c?.[5]?.f ?? r.c?.[5]?.v ?? ""
        };
      })
      .filter(m => m.concepto || m.importe);
  }

  async function load() {
    setSync("loading", "Conectando con Google Sheets…");

    try {
      const [summaryPayload, movementsPayload, agendaPayload] = await Promise.all([
        gvizSheet(cfg.resumenSheet),
        gvizSheet(cfg.movimientosSheet),
        gvizSheet(cfg.agendaSheet)
      ]);

      const summary = extractSummary(summaryPayload);
      const movimientos = extractMovements(movementsPayload);
      const agenda = extractAgenda(agendaPayload);

      render({
        ...cfg.fallback,
        ...summary,
        movimientos,
        agenda
      }, true);
    } catch (err) {
      console.warn("No se pudo sincronizar con Google Sheets:", err);
      render(cfg.fallback, false);
    }
  }

  $("refreshButton")?.addEventListener("click", load);

  render(cfg.fallback, false);
  load();
})();
