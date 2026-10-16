(() => {
  "use strict";
  const cfg = window.CLASSROOM_CONFIG;
  const $ = id => document.getElementById(id);
  const money = new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"});

  const escapeHtml = v => String(v ?? "").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]));
  const escapeAttr = escapeHtml;

  function setText(id,val){const el=$(id);if(el)el.textContent=val}
  function setSync(kind,text){const el=$("syncStatus");if(!el)return;el.className=`sync-pill sync-pill--${kind}`;el.innerHTML=`<span class="sync-dot"></span>${text}`}
  function parseDate(str){
    const s=String(str||"").trim();
    const m=s.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if(!m)return null;
    return new Date(Number(m[3]),Number(m[2])-1,Number(m[1]),12,0,0);
  }
  function dayStart(d){return new Date(d.getFullYear(),d.getMonth(),d.getDate(),12,0,0)}
  function relativeDateLabel(str){
    const d=parseDate(str); if(!d)return "PENDIENTE";
    const today=dayStart(new Date()); const target=dayStart(d);
    const diff=Math.round((target-today)/86400000);
    if(diff===0)return "HOY";
    if(diff===1)return "MAÑANA";
    if(diff>1 && diff<=7)return `EN ${diff} DÍAS`;
    if(diff<0)return "FECHA PASADA";
    return "PRÓXIMO";
  }
  function agendaClass(tipo){
    const t=String(tipo||"").toLowerCase();
    if(t.includes("evento"))return "event";
    if(t.includes("límite")||t.includes("limite"))return "deadline";
    if(t.includes("pago"))return "payment";
    if(t.includes("aviso"))return "notice";
    return "reminder";
  }
  function agendaIcon(tipo){
    const t=String(tipo||"").toLowerCase();
    if(t.includes("evento"))return "🎉";
    if(t.includes("límite")||t.includes("limite"))return "⏰";
    if(t.includes("pago"))return "💶";
    if(t.includes("aviso"))return "🔔";
    return "📌";
  }
  function dateParts(str){
    const s=String(str||"").trim();
    if(!s || /sin fecha/i.test(s)) return {kind:"none",label:"SIN FECHA"};
    const range=s.match(/^(\d{1,2})[–-](\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if(range){
      return {kind:"range",label:`${range[1]}–${range[2]}`,month:new Intl.DateTimeFormat("es-ES",{month:"short"}).format(new Date(+range[4],+range[3]-1,1)).replace(".","").toUpperCase(),year:range[4]};
    }
    const m=s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if(m){
      return {kind:"date",day:m[1],month:new Intl.DateTimeFormat("es-ES",{month:"short"}).format(new Date(+m[3],+m[2]-1,1)).replace(".","").toUpperCase(),year:m[3]};
    }
    return {kind:"text",label:s};
  }
  function sortAgenda(items){
    return [...items].sort((a,b)=>{
      const da=parseDate(a.fecha), db=parseDate(b.fecha);
      if(da && db) return da-db;
      if(da) return -1;
      if(db) return 1;
      return 0;
    });
  }
  function renderAgenda(items){
    const box=$("agendaList"); if(!box)return;
    const visible=sortAgenda((items||[]).filter(i=>!["completado","cancelado"].includes(String(i.estado||"").toLowerCase())));
    if(!visible.length){box.innerHTML='<div class="empty-state">No hay fechas próximas registradas.</div>';return}
    box.innerHTML=visible.map(i=>{
      const cls=agendaClass(i.tipo);
      const d=dateParts(i.fecha);
      const dateMarkup = d.kind==="date"
        ? `<span class="date-day">${escapeHtml(d.day)}</span><span class="date-month">${escapeHtml(d.month)}</span><span class="date-year">${escapeHtml(d.year)}</span>`
        : d.kind==="range"
        ? `<span class="date-range">${escapeHtml(d.label)}</span><span class="date-month">${escapeHtml(d.month)}</span><span class="date-year">${escapeHtml(d.year)}</span>`
        : `<span class="date-range">${escapeHtml(d.label)}</span>`;
      const button=i.enlace&&/^https?:\/\//i.test(i.enlace)
        ? `<button class="action-button" type="button" data-open-url="${escapeAttr(i.enlace)}">Ver información</button>`:"";
      const action=i.accion?`<div class="agenda-action"><span class="agenda-action__label">Lo importante</span><span class="agenda-action__text">${escapeHtml(i.accion)}</span></div>`:"";
      return `<article class="agenda-card agenda-card--${cls}">
        <div class="agenda-datepanel">
          ${dateMarkup}
          <span class="when-badge">${relativeDateLabel(i.fecha)}</span>
        </div>
        <div class="agenda-card__content">
          <div class="agenda-card__topline">
            <div class="agenda-card__identity">
              <div class="agenda-icon">${agendaIcon(i.tipo)}</div>
              <div>
                <span class="agenda-type">${escapeHtml(i.tipo||"Recordatorio")}</span>
                <h3>${escapeHtml(i.titulo||"Recordatorio")}</h3>
              </div>
            </div>
          </div>
          ${i.detalle?`<div class="agenda-card__body"><p>${escapeHtml(i.detalle)}</p></div>`:""}
          ${action}
          ${(i.importe||button)?`<div class="agenda-card__footer">${i.importe?`<span class="agenda-amount">💶 ${escapeHtml(i.importe)}</span>`:"<span></span>"}${button}</div>`:""}
        </div>
      </article>`;
    }).join("");
  }
  function renderSummary(s){
    setText("saldoActual",money.format(Number(s.saldoActual||0)));
    setText("totalIngresado",money.format(Number(s.totalIngresado||0)));
    setText("totalGastado",money.format(Number(s.totalGastado||0)));
    setText("saldoComprometido",money.format(Number(s.saldoComprometido??s.saldoActual??0)));
    setText("aportacionFamilia",money.format(Number(s.aportacionFamilia||0)));
    setText("aportacionPrevista",money.format(Number(s.aportacionPrevista||0)));
    setText("familiasPendientes",String(s.familiasPendientes??0));
    const total=Number(s.familiasTotal||0), paid=Number(s.familiasPagadas||0);
    setText("familyProgressTitle",`${paid} de ${total} familias han aportado`);
    setText("familyCounter",`${paid} / ${total}`);
    const bar=$("familyProgress");if(bar)bar.style.width=(total?Math.min(100,(paid/total)*100):0)+"%";
  }
  function purchaseStatusClass(s){
    const t=String(s||"").toLowerCase();
    if(t.includes("pag"))return "paid";
    if(t.includes("encarg"))return "ordered";
    if(t.includes("cancel"))return "cancelled";
    return "planned";
  }
  function renderPurchases(items){
    const box=$("purchasesList");if(!box)return;
    const visible=(items||[]).filter(i=>String(i.estado||"").toLowerCase()!=="cancelada");
    if(!visible.length){box.innerHTML='<div class="empty-state">No hay compras previstas.</div>';return}
    box.innerHTML=visible.map(i=>`<article class="purchase-item">
      <div><strong>${escapeHtml(i.concepto||"Compra")}</strong>
        ${i.observaciones?`<p>${escapeHtml(i.observaciones)}</p>`:""}
        <div class="purchase-meta"><span>${escapeHtml(i.fecha||"")}</span><span>${Number(i.unidades||0)} ud.</span><span>${money.format(Number(i.precioUnidad||0))}/ud.</span></div>
      </div>
      <div><div class="purchase-price">${money.format(Number(i.costeTotal||0))}</div><div class="purchase-status purchase-status--${purchaseStatusClass(i.estado)}">${escapeHtml(i.estado||"Prevista")}</div></div>
    </article>`).join("");
  }
  function renderMovements(items){
    const box=$("movementsList");if(!box)return;
    if(!items?.length){box.innerHTML='<div class="empty-state">Todavía no hay movimientos registrados.</div>';return}
    box.innerHTML=items.map(i=>{
      const income=String(i.tipo||"").toLowerCase().includes("ingreso"), cls=income?"income":"expense", sign=income?"+":"−";
      return `<article class="movement">
        <div class="movement-icon movement-icon--${cls}">${sign}</div>
        <div><strong>${escapeHtml(i.concepto||"Movimiento")}</strong><div class="movement-meta"><span>${escapeHtml(i.fecha||"")}</span><span>${escapeHtml(i.tipo||"")}</span></div>${i.observaciones?`<p>${escapeHtml(i.observaciones)}</p>`:""}</div>
        <div class="movement-amount movement-amount--${cls}">${sign}${money.format(Math.abs(Number(i.importe||0)))}</div>
      </article>`;
    }).join("");
  }
  function renderReceipts(items){
    const box=$("receiptsList");if(!box)return;
    const docs=(items||[]).filter(i=>/^https?:\/\//i.test(String(i.referencia||"").trim()));
    if(!docs.length){box.innerHTML='<div class="empty-state">Todavía no hay justificantes disponibles.</div>';return}
    box.innerHTML=docs.map(i=>`<article class="receipt"><div><strong>${escapeHtml(i.concepto||"Compra")}</strong><div class="receipt-meta"><span>${escapeHtml(i.fecha||"")}</span><span>${money.format(Math.abs(Number(i.importe||0)))}</span></div></div><button class="receipt-button" type="button" data-open-url="${escapeAttr(i.referencia)}">Ver ticket o factura</button></article>`).join("");
  }
  function gviz(sheet){
    return new Promise((resolve,reject)=>{
      const cb="__gviz_"+Math.random().toString(36).slice(2),script=document.createElement("script");
      const timer=setTimeout(()=>cleanup(new Error("timeout")),10000);
      function cleanup(err,payload){clearTimeout(timer);delete window[cb];script.remove();err?reject(err):resolve(payload)}
      window[cb]=payload=>cleanup(null,payload);script.onerror=()=>cleanup(new Error("load"));
      script.src=`https://docs.google.com/spreadsheets/d/${encodeURIComponent(cfg.spreadsheetId)}/gviz/tq?sheet=${encodeURIComponent(sheet)}&tqx=responseHandler:${cb}`;
      document.head.appendChild(script);
    });
  }
  function extractSummary(p){
    const map={};(p.table?.rows||[]).forEach(r=>{const k=r.c?.[0]?.v;if(k){const c=r.c?.[1];map[String(k).trim()]={raw:c?.v,fmt:c?.f??c?.v??""}}});
    const raw=k=>map[k]?.raw, fb=cfg.fallback.summary;
    return {
      aportacionFamilia:Number(raw("Aportación por familia")??fb.aportacionFamilia),
      familiasTotal:Number(raw("N.º de familias")??fb.familiasTotal),
      familiasPagadas:Number(raw("Familias que han pagado")??fb.familiasPagadas),
      familiasPendientes:Number(raw("Familias pendientes")??fb.familiasPendientes),
      aportacionPrevista:Number(raw("Aportación prevista")??fb.aportacionPrevista),
      totalIngresado:Number(raw("Total ingresado")??fb.totalIngresado),
      totalGastado:Number(raw("Total gastado")??fb.totalGastado),
      saldoActual:Number(raw("Saldo actual")??fb.saldoActual),
      totalCompromisos:Number(raw("Total compromisos")??fb.totalCompromisos),
      saldoComprometido:Number(raw("Saldo tras compromisos")??fb.saldoComprometido)
    };
  }
  const rows=p=>(p.table?.rows||[]).filter(r=>r.c?.some(Boolean));
  function extractAgenda(p){return rows(p).map(r=>({fecha:r.c?.[0]?.f??r.c?.[0]?.v??"",tipo:r.c?.[1]?.f??r.c?.[1]?.v??"",titulo:r.c?.[2]?.f??r.c?.[2]?.v??"",detalle:r.c?.[3]?.f??r.c?.[3]?.v??"",importe:r.c?.[4]?.f??r.c?.[4]?.v??"",estado:r.c?.[5]?.f??r.c?.[5]?.v??"",enlace:r.c?.[6]?.f??r.c?.[6]?.v??"",accion:r.c?.[7]?.f??r.c?.[7]?.v??""})).filter(x=>x.titulo)})).filter(x=>x.titulo)}
  function extractPurchases(p){return rows(p).map(r=>({fecha:r.c?.[0]?.f??r.c?.[0]?.v??"",concepto:r.c?.[1]?.f??r.c?.[1]?.v??"",unidades:Number(r.c?.[2]?.v??0),precioUnidad:Number(r.c?.[3]?.v??0),costeTotal:Number(r.c?.[4]?.v??0),estado:r.c?.[5]?.f??r.c?.[5]?.v??"",observaciones:r.c?.[6]?.f??r.c?.[6]?.v??""})).filter(x=>x.concepto)}
  function extractMovements(p){return rows(p).map(r=>({fecha:r.c?.[0]?.f??r.c?.[0]?.v??"",concepto:r.c?.[1]?.f??r.c?.[1]?.v??"",tipo:r.c?.[2]?.f??r.c?.[2]?.v??"",importe:Number(r.c?.[3]?.v??0),observaciones:r.c?.[4]?.f??r.c?.[4]?.v??"",referencia:r.c?.[5]?.f??r.c?.[5]?.v??""})).filter(x=>x.concepto||x.importe)}
  function renderAll(data,connected){
    renderSummary(data.summary);renderAgenda(data.agenda);renderPurchases(data.compras);renderMovements(data.movimientos);renderReceipts(data.movimientos);
    const stamp=new Intl.DateTimeFormat("es-ES",{dateStyle:"short",timeStyle:"short"}).format(new Date());
    setText("lastSync",connected?`Datos sincronizados con Google Sheets: ${stamp}.`:`Mostrando datos de respaldo. Último intento: ${stamp}.`);
    setSync(connected?"ok":"error",connected?"Datos actualizados desde Google Sheets":"Mostrando datos de respaldo");
  }
  async function load(){
    setSync("loading","Conectando con Google Sheets…");
    try{
      const [s,m,a,c]=await Promise.all([gviz(cfg.sheets.resumen),gviz(cfg.sheets.movimientos),gviz(cfg.sheets.agenda),gviz(cfg.sheets.compras)]);
      renderAll({summary:extractSummary(s),movimientos:extractMovements(m),agenda:extractAgenda(a),compras:extractPurchases(c)},true);
    }catch(e){console.warn(e);renderAll(cfg.fallback,false)}
  }
  document.addEventListener("click",e=>{
    const scrollBtn=e.target.closest("[data-scroll]");
    if(scrollBtn){
      const target=document.getElementById(scrollBtn.dataset.scroll);
      target?.scrollIntoView({behavior:"smooth",block:"start"});
      return;
    }
    const openBtn=e.target.closest("[data-open-url]");
    if(openBtn){
      window.open(openBtn.dataset.openUrl,"_blank","noopener,noreferrer");
    }
  });
  $("refreshButton")?.addEventListener("click",load);
  renderAll(cfg.fallback,false);load();
})();