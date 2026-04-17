// ============================================================
//  app.js — Calculadora de Perfusiones UCI
// ============================================================

/* jshint esversion: 6 */

// ── Toggle tema claro/oscuro ───────────────────────────────
(function() {
  const btn = document.getElementById("btn-tema");
  const root = document.documentElement;
  const CLAVE = "perfusiones-tema";

  function aplicarTema(claro) {
    if (claro) {
      root.classList.add("modo-claro");
      btn.textContent = "☀️";
      btn.title = "Cambiar a modo oscuro";
    } else {
      root.classList.remove("modo-claro");
      btn.textContent = "🌙";
      btn.title = "Cambiar a modo claro";
    }
  }

  // Recuperar preferencia guardada
  const guardado = localStorage.getItem(CLAVE);
  const prefiereClaroSistema = window.matchMedia("(prefers-color-scheme: light)").matches;
  const modoClaro = guardado !== null ? guardado === "claro" : prefiereClaroSistema;
  aplicarTema(modoClaro);

  btn.addEventListener("click", () => {
    const esClaro = root.classList.contains("modo-claro");
    aplicarTema(!esClaro);
    localStorage.setItem(CLAVE, !esClaro ? "claro" : "oscuro");
  });
})();

// ── Estado global ─────────────────────────────────────────
let pesoActual = null;
let farmSeleccionado = null;
let presIndex = 0;         // índice de presentación activa
let modoCalculo = "dosis"; // "dosis" → ml/h   |   "ml" → dosis
let categoriaFiltro = "Todos";

// ── Inicialización ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  construirFiltros();
  renderizarLista();
  bindPeso();
  bindBusqueda();
  document.getElementById("btn-calcular").addEventListener("click", calcular);
  document.getElementById("btn-limpiar").addEventListener("click", limpiarPanel);
  document.getElementById("panel-overlay").addEventListener("click", cerrarPanel);
});

// ── Filtros de categoría ───────────────────────────────────
function construirFiltros() {
  const cont = document.getElementById("filtros");
  const todas = ["Todos", ...categorias];
  todas.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "chip" + (cat === "Todos" ? " chip--activo" : "");
    btn.textContent = cat;
    btn.addEventListener("click", () => {
      categoriaFiltro = cat;
      document.querySelectorAll(".chip").forEach(b => b.classList.remove("chip--activo"));
      btn.classList.add("chip--activo");
      renderizarLista();
    });
    cont.appendChild(btn);
  });
}

// ── Lista de fármacos ──────────────────────────────────────
function renderizarLista(query = "") {
  const cont = document.getElementById("lista-farmacos");
  cont.innerHTML = "";
  const q = query.toLowerCase().trim();
  const lista = farmacos.filter(f => {
    const matchCat = categoriaFiltro === "Todos" || f.categoria === categoriaFiltro;
    const matchQ   = !q || f.nombre.toLowerCase().includes(q) || f.categoria.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  if (lista.length === 0) {
    cont.innerHTML = `<p class="sin-resultados">No se encontraron fármacos</p>`;
    return;
  }

  lista.forEach(f => {
    const card = document.createElement("div");
    card.className = "farm-card" + (farmSeleccionado && farmSeleccionado.nombre === f.nombre ? " farm-card--activa" : "");
    card.innerHTML = `
      <span class="farm-icono">${f.icono}</span>
      <div class="farm-info">
        <span class="farm-nombre">${f.nombre}</span>
        <span class="farm-cat">${f.categoria}</span>
      </div>
      <span class="farm-pres-n">${f.presentaciones.length > 1 ? f.presentaciones.length + " pres." : ""}</span>
    `;
    card.addEventListener("click", () => seleccionarFarmaco(f));
    cont.appendChild(card);
  });
}

// ── Búsqueda ───────────────────────────────────────────────
function bindBusqueda() {
  document.getElementById("busqueda").addEventListener("input", e => {
    renderizarLista(e.target.value);
  });
}

// ── Peso del paciente ──────────────────────────────────────
function bindPeso() {
  const inp = document.getElementById("peso-input");
  inp.addEventListener("input", () => {
    const val = parseFloat(inp.value);
    pesoActual = (val > 0 && val <= 300) ? val : null;
    actualizarBadgePeso();
    if (farmSeleccionado) {
      // Si hay valor en el input, recalcular; si no, renderizar panel con dosis por defecto
      const inp = document.getElementById("valor-input");
      if (inp.value && parseFloat(inp.value) > 0) {
        calcular();
      } else {
        renderPanel();
      }
    }
  });
}

function actualizarBadgePeso() {
  const badge = document.getElementById("peso-badge");
  badge.textContent = pesoActual ? `${pesoActual} kg` : "—";
  badge.className = "peso-badge" + (pesoActual ? " peso-badge--ok" : "");
}

// ── Selección de fármaco ───────────────────────────────────
function seleccionarFarmaco(f) {
  farmSeleccionado = f;
  presIndex = 0;
  modoCalculo = "dosis";
  abrirPanel();
  renderPanel();
  renderizarLista(document.getElementById("busqueda").value);
}

// ── Panel lateral ──────────────────────────────────────────
function esMobil() {
  return window.innerWidth <= 640;
}

function abrirPanel() {
  if (esMobil()) {
    document.getElementById("panel-overlay").classList.add("visible");
  }
  document.getElementById("panel-detalle").classList.add("abierto");
  document.querySelector(".main-area").classList.add("con-panel");
}

function cerrarPanel() {
  document.getElementById("panel-overlay").classList.remove("visible");
  document.getElementById("panel-detalle").classList.remove("abierto");
  document.querySelector(".main-area").classList.remove("con-panel");
  farmSeleccionado = null;
  renderizarLista(document.getElementById("busqueda").value);
}

function limpiarPanel() {
  document.getElementById("valor-input").value = "";
  document.getElementById("resultado-box").innerHTML = "";
  document.getElementById("resultado-box").className = "resultado-box resultado-box--vacio";
}

function renderPanel() {
  if (!farmSeleccionado) return;
  const f = farmSeleccionado;
  const pres = f.presentaciones[presIndex];

  // Título
  document.getElementById("panel-titulo").textContent = f.nombre;
  document.getElementById("panel-categoria").textContent = f.categoria;
  document.getElementById("panel-icono").textContent = f.icono;

  // Presentaciones (tabs)
  const tabsCont = document.getElementById("tabs-presentaciones");
  tabsCont.innerHTML = "";
  f.presentaciones.forEach((p, i) => {
    const btn = document.createElement("button");
    btn.className = "tab-pres" + (i === presIndex ? " tab-pres--activa" : "");
    btn.textContent = p.label;
    btn.addEventListener("click", () => { presIndex = i; renderPanel(); });
    tabsCont.appendChild(btn);
  });

  // Info presentación
  const conc = calcConcentracion(pres);
  document.getElementById("pres-suero").textContent  = pres.suero;
  document.getElementById("pres-dosis").textContent  = `${pres.dosis_mg} mg`;
  document.getElementById("pres-vol").textContent    = `${pres.dilucion_ml} ml`;
  document.getElementById("pres-conc").textContent   = conc.texto;
  document.getElementById("pres-rango").textContent  = pres.dosisRange;

  // Necesidad de peso
  const necesitaPeso = ["mcg_kg_min","mcg_kg_h","mg_kg_h"].includes(pres.calcTipo);
  document.getElementById("aviso-peso").style.display = (necesitaPeso && !pesoActual) ? "flex" : "none";

  // Modo cálculo
  actualizarModoUI(pres);

  // Precargar dosis estándar y calcular automáticamente
  const dosisStd = pres.dosisMin;
  const inputVal = document.getElementById("valor-input");
  if (dosisStd !== undefined && dosisStd !== null && dosisStd > 0) {
    inputVal.value = dosisStd;
    setTimeout(() => calcular(), 0);
  } else {
    inputVal.value = "";
    document.getElementById("resultado-box").innerHTML = "";
    document.getElementById("resultado-box").className = "resultado-box resultado-box--vacio";
  }
}

function calcConcentracion(pres) {
  if (pres.concMgMl !== undefined) {
    return { valor: pres.concMgMl, texto: `${formatNum(pres.concMgMl, 3)} mg/ml` };
  }
  if (pres.concUgMl !== undefined) {
    return { valor: pres.concUgMl, texto: `${formatNum(pres.concUgMl, 2)} mcg/ml` };
  }
  return { valor: 0, texto: "—" };
}

// ── Modo de cálculo ────────────────────────────────────────
function actualizarModoUI(pres) {
  const btnDosis = document.getElementById("btn-modo-dosis");
  const btnMl    = document.getElementById("btn-modo-ml");
  const labelInp = document.getElementById("label-input");
  const unitInp  = document.getElementById("unit-input");

  btnDosis.classList.toggle("modo--activo", modoCalculo === "dosis");
  btnMl.classList.toggle("modo--activo",    modoCalculo === "ml");

  if (modoCalculo === "dosis") {
    labelInp.textContent = "Dosis deseada";
    unitInp.textContent  = pres.unidad;
  } else {
    labelInp.textContent = "Ritmo de bomba";
    unitInp.textContent  = "ml/h";
  }

  btnDosis.onclick = () => { modoCalculo = "dosis"; actualizarModoUI(pres); limpiarPanel(); };
  btnMl.onclick    = () => { modoCalculo = "ml";    actualizarModoUI(pres); limpiarPanel(); };
}

// ── Cálculo principal ──────────────────────────────────────
function calcular() {
  if (!farmSeleccionado) return;
  const pres    = farmSeleccionado.presentaciones[presIndex];
  const valor   = parseFloat(document.getElementById("valor-input").value);
  const necesitaPeso = ["mcg_kg_min","mcg_kg_h","mg_kg_h"].includes(pres.calcTipo);
  const box     = document.getElementById("resultado-box");

  if (isNaN(valor) || valor <= 0) {
    mostrarError(box, "Introduce un valor numérico válido.");
    return;
  }
  if (necesitaPeso && !pesoActual) {
    mostrarError(box, "Es necesario introducir el peso del paciente.");
    return;
  }

  let mlH, dosis, alertaDosis = null;

  if (modoCalculo === "dosis") {
    // Input: dosis → Output: ml/h
    dosis = valor;
    mlH   = calcMlH(pres, dosis, pesoActual);
  } else {
    // Input: ml/h → Output: dosis
    mlH   = valor;
    dosis = calcDosis(pres, mlH, pesoActual);
  }

  if (mlH === null || dosis === null || mlH <= 0) {
    mostrarError(box, "Error en el cálculo. Revisa los datos.");
    return;
  }

  // Alerta de rango
  const dosisBase = necesitaPeso ? dosis : dosis; // ya en unidad correcta
  if (pres.dosisMin !== pres.dosisMax) {
    if (dosis < pres.dosisMin) alertaDosis = "bajo";
    if (dosis > pres.dosisMax) alertaDosis = "alto";
  }

  mostrarResultado(box, pres, mlH, dosis, alertaDosis);
}

// ── Fórmulas ───────────────────────────────────────────────
function calcMlH(pres, dosis, peso) {
  const { calcTipo } = pres;
  const concMg = pres.concMgMl  || (pres.concUgMl / 1000);  // mg/ml siempre
  switch(calcTipo) {
    case "mcg_kg_min": return (dosis * peso * 60) / (pres.concUgMl);
    case "mcg_kg_h":   return (dosis * peso)       / (pres.concUgMl);
    case "mg_kg_h":    return (dosis * peso)        / concMg;
    case "mcg_min":    return (dosis * 60)          / (pres.concUgMl);
    case "mcg_h":      return  dosis                / (pres.concUgMl);
    case "mg_h":       return  dosis                / concMg;
    case "mg_min":     return (dosis * 60)          / concMg;
    default: return null;
  }
}

function calcDosis(pres, mlH, peso) {
  const { calcTipo } = pres;
  const concMg = pres.concMgMl  || (pres.concUgMl / 1000);
  switch(calcTipo) {
    case "mcg_kg_min": return (mlH * pres.concUgMl) / (peso * 60);
    case "mcg_kg_h":   return (mlH * pres.concUgMl) / peso;
    case "mg_kg_h":    return (mlH * concMg)        / peso;
    case "mcg_min":    return (mlH * pres.concUgMl) / 60;
    case "mcg_h":      return  mlH * pres.concUgMl;
    case "mg_h":       return  mlH * concMg;
    case "mg_min":     return (mlH * concMg)         / 60;
    default: return null;
  }
}

// ── Presentación de resultados ─────────────────────────────
function mostrarResultado(box, pres, mlH, dosis, alertaDosis) {
  const tiempoTexto = tiempoRestante(pres.dilucion_ml, mlH);
  const rangoOk     = alertaDosis === null;
  const alertaClass = alertaDosis === "alto" ? "alerta-alto" : alertaDosis === "bajo" ? "alerta-bajo" : "";

  box.className = "resultado-box resultado-box--ok" + (alertaDosis ? " resultado-box--alerta" : "");
  box.innerHTML = `
    <div class="res-principal">
      <div class="res-item res-item--grande">
        <span class="res-label">Ritmo bomba</span>
        <span class="res-valor">${formatNum(mlH, 2)}</span>
        <span class="res-unit">ml/h</span>
      </div>
      <div class="res-divider"></div>
      <div class="res-item">
        <span class="res-label">Dosis real</span>
        <span class="res-valor ${alertaClass}">${formatNum(dosis, 3)}</span>
        <span class="res-unit">${pres.unidad}</span>
      </div>
    </div>
    ${!rangoOk ? `
    <div class="res-alerta">
      <span class="alerta-icono">${alertaDosis === "alto" ? "⚠️" : "ℹ️"}</span>
      <span>Dosis ${alertaDosis === "alto" ? "por encima" : "por debajo"} del rango recomendado (${pres.dosisRange})</span>
    </div>` : ""}
    <div class="res-extras">
      <div class="res-extra-item">
        <span class="res-extra-label">⏱ Duración bolsa</span>
        <span class="res-extra-val">${tiempoTexto}</span>
      </div>
      <div class="res-extra-item">
        <span class="res-extra-label">🧪 Concentración</span>
        <span class="res-extra-val">${calcConcentracion(pres).texto}</span>
      </div>
      ${pesoActual ? `<div class="res-extra-item">
        <span class="res-extra-label">⚖️ Peso</span>
        <span class="res-extra-val">${pesoActual} kg</span>
      </div>` : ""}
    </div>
  `;
}

function mostrarError(box, msg) {
  box.className = "resultado-box resultado-box--error";
  box.innerHTML = `<div class="res-error"><span>⚠️</span><span>${msg}</span></div>`;
}

// ── Utilidades ─────────────────────────────────────────────
function tiempoRestante(volMl, mlH) {
  if (!mlH || mlH <= 0) return "—";
  const horas = volMl / mlH;
  if (horas >= 24) return `${(horas / 24).toFixed(1)} días`;
  if (horas >= 1)  return `${Math.floor(horas)}h ${Math.round((horas % 1) * 60)}min`;
  return `${Math.round(horas * 60)} min`;
}

function formatNum(n, decimals = 2) {
  if (n === null || isNaN(n)) return "—";
  const r = parseFloat(n.toFixed(decimals));
  return r.toString().replace(".", ",");
}