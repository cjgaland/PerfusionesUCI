// ============================================================
//  app.js — Calculadora de Perfusiones UCI · V3
// ============================================================

/* jshint esversion: 6 */

// ── Toggle tema claro/oscuro ───────────────────────────────
(function () {
  const btnTema   = document.getElementById("btn-tema");
  const root      = document.documentElement;
  const metaTheme = document.getElementById("meta-theme-color");
  const CLAVE     = "perfusiones-tema";

  const iconLuna = btnTema.querySelector(".icon-luna");
  const iconSol  = btnTema.querySelector(".icon-sol");

  function aplicarTema(claro) {
    if (claro) {
      root.classList.add("modo-claro");
      iconLuna.style.display = "none";
      iconSol.style.display  = "block";
      if (metaTheme) metaTheme.content = "#f1f5fb";
    } else {
      root.classList.remove("modo-claro");
      iconLuna.style.display = "block";
      iconSol.style.display  = "none";
      if (metaTheme) metaTheme.content = "#0f1923";
    }
  }

  const guardado  = localStorage.getItem(CLAVE);
  const prefClaro = window.matchMedia("(prefers-color-scheme: light)").matches;
  aplicarTema(guardado !== null ? guardado === "claro" : prefClaro);

  btnTema.addEventListener("click", () => {
    const esClaro = root.classList.contains("modo-claro");
    aplicarTema(!esClaro);
    localStorage.setItem(CLAVE, !esClaro ? "claro" : "oscuro");
  });
})();

// ── Estado global ──────────────────────────────────────────
let pesoActual       = null;
let farmSeleccionado = null;
let presIndex        = 0;
let modoCalculo      = "dosis";   // "dosis" | "ml"
let modoAdmin        = "perfusion"; // "perfusion" | "puntual" | "carga_mantenimiento"
let categoriaFiltro  = "Todos";
let clinicaTab       = "indicaciones";
let clinicaAbierta   = false;
let favoritos        = new Set(JSON.parse(localStorage.getItem("perfusiones-favoritos") || "[]"));

// ── Inicialización ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  construirFiltros();
  renderizarLista();
  bindPeso();
  bindBusqueda();

  document.getElementById("btn-calcular").addEventListener("click", calcular);
  document.getElementById("btn-limpiar").addEventListener("click", limpiarCalc);
  document.getElementById("panel-overlay").addEventListener("click", cerrarPanel);
  document.getElementById("btn-favorito").addEventListener("click", () => {
    if (!farmSeleccionado) return;
    toggleFavorito(farmSeleccionado.nombre);
  });

  document.getElementById("valor-input").addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); calcular(); }
  });

  document.getElementById("btn-info-toggle").addEventListener("click", () => {
    document.getElementById("info-collapse").classList.toggle("info-collapse--abierto");
  });

  document.getElementById("btn-clinica-toggle").addEventListener("click", () => {
    clinicaAbierta = !clinicaAbierta;
    const body    = document.getElementById("clinica-body");
    const chevron = document.getElementById("clinica-chevron");
    body.style.display   = clinicaAbierta ? "flex" : "none";
    chevron.style.transform = clinicaAbierta ? "rotate(180deg)" : "";
  });

  // Delegación de eventos para tabs de información clínica
  document.getElementById("clinica-tabs").addEventListener("click", e => {
    const btn = e.target.closest(".clinica-tab");
    if (!btn) return;
    clinicaTab = btn.dataset.tab;
    document.querySelectorAll(".clinica-tab").forEach(b => b.classList.remove("clinica-tab--activa"));
    btn.classList.add("clinica-tab--activa");
    renderContenidoClinica();
  });

  // Registrar Service Worker (PWA)
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
    // Cuando un nuevo SW toma el control, recargar para obtener
    // los ficheros actualizados (sin intervención del usuario)
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });
  }
});

// ── Favoritos ──────────────────────────────────────────────
function toggleFavorito(nombre) {
  if (favoritos.has(nombre)) favoritos.delete(nombre);
  else favoritos.add(nombre);
  localStorage.setItem("perfusiones-favoritos", JSON.stringify([...favoritos]));
  actualizarBtnFavorito();
  renderizarLista(document.getElementById("busqueda").value);
}

function actualizarBtnFavorito() {
  const btn = document.getElementById("btn-favorito");
  if (!btn || !farmSeleccionado) return;
  const esFav = favoritos.has(farmSeleccionado.nombre);
  btn.classList.toggle("btn-favorito--activo", esFav);
  btn.title = esFav ? "Quitar de favoritos" : "Añadir a favoritos";
}

// ── Filtros de categoría ───────────────────────────────────
function construirFiltros() {
  const cont = document.getElementById("filtros");

  // Chip especial de favoritos
  const btnFav = document.createElement("button");
  btnFav.className = "chip chip--fav" + (categoriaFiltro === "Favoritos" ? " chip--activo" : "");
  btnFav.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:-1px;margin-right:3px"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>Favoritos`;
  btnFav.addEventListener("click", () => {
    categoriaFiltro = "Favoritos";
    document.querySelectorAll("#filtros .chip").forEach(b => b.classList.remove("chip--activo"));
    btnFav.classList.add("chip--activo");
    renderizarLista(document.getElementById("busqueda").value);
  });
  cont.appendChild(btnFav);

  const todas = ["Todos", ...categorias];
  todas.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "chip" + (cat === categoriaFiltro ? " chip--activo" : "");
    btn.textContent = cat;
    btn.addEventListener("click", () => {
      categoriaFiltro = cat;
      document.querySelectorAll("#filtros .chip").forEach(b => b.classList.remove("chip--activo"));
      btn.classList.add("chip--activo");
      renderizarLista(document.getElementById("busqueda").value);
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
    if (categoriaFiltro === "Favoritos") {
      return favoritos.has(f.nombre) &&
        (!q || f.nombre.toLowerCase().includes(q) || f.categoria.toLowerCase().includes(q));
    }
    const matchCat = categoriaFiltro === "Todos" || f.categoria === categoriaFiltro;
    const matchQ   = !q || f.nombre.toLowerCase().includes(q) || f.categoria.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  if (lista.length === 0) {
    cont.innerHTML = categoriaFiltro === "Favoritos" ? 
      `<p class="sin-resultados">No hay favoritos guardados.<br><small>Abre un fármaco y pulsa la estrella ☆</small></p>`
      : `<p class="sin-resultados">No se encontraron fármacos</p>`;
    return;
  }

  lista.forEach(f => {
    const card     = document.createElement("div");
    const esActiva = farmSeleccionado && farmSeleccionado.nombre === f.nombre;
    const esFav    = favoritos.has(f.nombre);
    card.className = "farm-card" + (esActiva ? " farm-card--activa" : "");
    card.style.setProperty("--card-iso-color", f.isoColor || "var(--border)");

    const tieneMultiModo = f.modos && f.modos.length > 1;
    const badgesModo = tieneMultiModo ? 
      f.modos.map(m => `<span class="farm-modo-badge farm-modo-badge--${m}">${labelModo(m, true)}</span>`).join("")
      : "";

    card.innerHTML = `
      <div class="farm-iso-strip"></div>
      <span class="farm-icono">${f.icono}</span>
      <div class="farm-info">
        <span class="farm-nombre">${f.nombre}</span>
        <span class="farm-cat">${f.categoria}</span>
        ${badgesModo ? `<div class="farm-modos">${badgesModo}</div>` : ""}
      </div>
      <div class="farm-card-right">
        ${esFav ? `<span class="farm-estrella">★</span>` : ""}
        ${f.presentaciones.length > 1 ? `<span class="farm-pres-n">${f.presentaciones.length}</span>` : ""}
      </div>
    `;
    card.addEventListener("click", () => seleccionarFarmaco(f));
    cont.appendChild(card);
  });
}

function labelModo(modo, corto = false) {
  const labels = {
    perfusion:           corto ? "Perf." : "Perfusión continua",
    puntual:             corto ? "Puntual" : "Dosis puntual",
    carga_mantenimiento: corto ? "Carga" : "Carga + Mantenimiento"
  };
  return labels[modo] || modo;
}

// ── Búsqueda ───────────────────────────────────────────────
function bindBusqueda() {
  document.getElementById("busqueda").addEventListener("input", e => {
    renderizarLista(e.target.value);
  });
}

// ── Peso del paciente ──────────────────────────────────────
function bindPeso() {
  const CLAVE_PESO = "perfusiones-peso";
  const pesoGuardado = localStorage.getItem(CLAVE_PESO);

  if (pesoGuardado) {
    const val = parseFloat(pesoGuardado);
    if (val > 0 && val <= 300) {
      pesoActual = val;
      ["peso-input", "peso-panel-input"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = pesoGuardado;
      });
      actualizarBadgePeso();
    }
  }

  const inputs = ["peso-input", "peso-panel-input"]
    .map(id => document.getElementById(id))
    .filter(Boolean);

  inputs.forEach(inp => {
    inp.addEventListener("input", () => {
      const valStr = inp.value.replace(",", ".");
      const val    = parseFloat(valStr);
      pesoActual   = (val > 0 && val <= 300) ? val : null;

      inputs.forEach(otro => { if (otro !== inp) otro.value = inp.value; });

      if (pesoActual) {
        localStorage.setItem(CLAVE_PESO, inp.value);
      } else {
        localStorage.removeItem(CLAVE_PESO);
      }

      actualizarBadgePeso();

      if (farmSeleccionado) {
        const pres = farmSeleccionado.presentaciones[presIndex];
        const necesitaPeso = ["mcg_kg_min", "mcg_kg_h", "mg_kg_h"].includes(pres.calcTipo);

        if (modoAdmin === "puntual") {
          renderPuntualBox(farmSeleccionado);
          renderCargaBox(farmSeleccionado);
        } else if (modoAdmin === "carga_mantenimiento") {
          renderCargaBox(farmSeleccionado);
          if (necesitaPeso) {
            const inpVal = document.getElementById("valor-input");
            if (inpVal.value && parseFloat(inpVal.value.replace(",", ".")) > 0) calcular();
          }
        } else {
          document.getElementById("aviso-peso").style.display =
            (necesitaPeso && !pesoActual) ? "flex" : "none";
          const inpVal = document.getElementById("valor-input");
          if (inpVal.value && parseFloat(inpVal.value.replace(",", ".")) > 0) {
            calcular();
          }
        }
      }
    });
  });
}

function actualizarBadgePeso() {
  const texto = pesoActual ? `${pesoActual} kg` : "—";
  ["peso-badge", "peso-panel-badge"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = texto;
    el.className   = "peso-badge" + (pesoActual ? " peso-badge--ok" : "");
  });
}

// ── Selección de fármaco ───────────────────────────────────
function seleccionarFarmaco(f) {
  farmSeleccionado = f;
  presIndex        = 0;
  modoCalculo      = "dosis";
  modoAdmin        = (f.modos && f.modos.length > 0) ? f.modos[0] : "perfusion";
  clinicaTab       = "indicaciones";
  clinicaAbierta   = false;
  abrirPanel();
  renderPanel();
  renderizarLista(document.getElementById("busqueda").value);
}

// ── Panel lateral ──────────────────────────────────────────
function abrirPanel() {
  if (window.innerWidth <= 640) {
    document.getElementById("panel-overlay").classList.add("visible");
  }
  document.getElementById("panel-detalle").classList.add("abierto");
  document.querySelector(".app-content").classList.add("con-panel");
}

function cerrarPanel() {
  document.getElementById("panel-overlay").classList.remove("visible");
  document.getElementById("panel-detalle").classList.remove("abierto");
  document.querySelector(".app-content").classList.remove("con-panel");
  farmSeleccionado = null;
  renderizarLista(document.getElementById("busqueda").value);
}

function limpiarCalc() {
  document.getElementById("valor-input").value = "";
  const box = document.getElementById("resultado-box");
  box.innerHTML = "";
  box.className = "resultado-box resultado-box--vacio";
}

// ── Renderizado del panel ──────────────────────────────────
function renderPanel() {
  if (!farmSeleccionado) return;
  const f    = farmSeleccionado;
  const pres = f.presentaciones[presIndex];

  // Cabecera
  document.getElementById("panel-icono").textContent = f.icono;
  document.getElementById("panel-titulo").textContent = f.nombre;
  const catEl = document.getElementById("panel-categoria");
  catEl.textContent = f.categoria;
  catEl.style.color = f.isoColor || "var(--cyan)";
  actualizarBtnFavorito();

  // Selector modo de administración
  renderAdminModos(f);

  // Tabs de presentaciones
  renderTabsPresentaciones(f);

  // Info dilución
  const conc = calcConcentracion(pres);
  document.getElementById("pres-suero").textContent = pres.suero;
  document.getElementById("pres-dosis").textContent = `${pres.dosis_mg} mg`;
  document.getElementById("pres-vol").textContent   = `${pres.dilucion_ml} ml`;
  document.getElementById("pres-conc").textContent  = conc.texto;
  document.getElementById("pres-rango").textContent = pres.dosisRange;

  // Aviso peso (solo en modos que lo necesitan)
  const necesitaPeso = ["mcg_kg_min", "mcg_kg_h", "mg_kg_h"].includes(pres.calcTipo);
  document.getElementById("aviso-peso").style.display =
    (necesitaPeso && !pesoActual && modoAdmin !== "puntual") ? "flex" : "none";

  // Visibilidad de secciones según modo
  actualizarSeccionesPorModo(f, pres);

  // Info clínica
  renderInfoClinica(f);

  // Cerrar acordeón de dilución al cambiar fármaco
  document.getElementById("info-collapse").classList.remove("info-collapse--abierto");

  // Cerrar info clínica
  clinicaAbierta = false;
  const clinBody = document.getElementById("clinica-body");
  if (clinBody) clinBody.style.display = "none";
  const clinChev = document.getElementById("clinica-chevron");
  if (clinChev) clinChev.style.transform = "";
}

// ── Selector modo de administración ───────────────────────
function renderAdminModos(f) {
  const cont = document.getElementById("admin-modo-cont");
  if (!f.modos || f.modos.length <= 1) {
    cont.style.display = "none";
    return;
  }
  cont.style.display = "flex";
  cont.innerHTML = "";

  f.modos.forEach(modo => {
    const btn = document.createElement("button");
    btn.className = "btn-admin-modo" + (modo === modoAdmin ? " admin-modo--activo" : "");
    btn.setAttribute("data-modo", modo);
    btn.textContent = labelModo(modo);
    btn.addEventListener("click", () => {
      modoAdmin = modo;
      limpiarCalc();
      renderPanel();
    });
    cont.appendChild(btn);
  });
}

// ── Tabs de presentaciones ─────────────────────────────────
function renderTabsPresentaciones(f) {
  const cont = document.getElementById("tabs-presentaciones");
  cont.innerHTML = "";

  if (modoAdmin === "puntual" || f.presentaciones.length <= 1) {
    cont.style.display = "none";
    return;
  }

  cont.style.display = "flex";
  f.presentaciones.forEach((p, i) => {
    const btn = document.createElement("button");
    btn.className = "tab-pres" + (i === presIndex ? " tab-pres--activa" : "");
    btn.textContent = p.label;
    btn.addEventListener("click", () => { presIndex = i; renderPanel(); });
    cont.appendChild(btn);
  });
}

// ── Visibilidad de secciones según modo ───────────────────
function actualizarSeccionesPorModo(f, pres) {
  const cargaBox    = document.getElementById("carga-box");
  const puntualBox  = document.getElementById("puntual-box");
  const calcSection = document.getElementById("calculadora-section");
  const resBox      = document.getElementById("resultado-box");
  const infoCollapse = document.getElementById("info-collapse");

  if (modoAdmin === "puntual") {
    cargaBox.style.display    = "none";
    calcSection.style.display = "none";
    resBox.className          = "resultado-box resultado-box--vacio";
    resBox.innerHTML          = "";
    infoCollapse.style.display = "none";
    puntualBox.style.display  = "block";
    renderPuntualBox(f);
  } else if (modoAdmin === "carga_mantenimiento") {
    puntualBox.style.display  = "none";
    cargaBox.style.display    = "block";
    calcSection.style.display = "flex";
    infoCollapse.style.display = "flex";
    renderCargaBox(f);
    actualizarModoUI(pres);
    precargarYCalcular(pres);
  } else {
    // perfusion
    puntualBox.style.display  = "none";
    cargaBox.style.display    = "none";
    calcSection.style.display = "flex";
    infoCollapse.style.display = "flex";
    actualizarModoUI(pres);
    precargarYCalcular(pres);
  }
}

function precargarYCalcular(pres) {
  const inputVal = document.getElementById("valor-input");
  if (pres.dosisMin && pres.dosisMin > 0) {
    inputVal.value = pres.dosisMin;
    setTimeout(() => calcular(), 0);
  } else {
    inputVal.value = "";
    limpiarCalc();
  }
}

// ── Tarjeta de dosis de carga ──────────────────────────────
function renderCargaBox(f) {
  const box = document.getElementById("carga-box");
  if (!f.carga) { box.style.display = "none"; return; }

  const c = f.carga;
  const { dosisVal, dosisTexto, dosisCalc } = calcularDosisEspecial(c);
  const sinPeso = !pesoActual && (c.dosis_mcg_kg || c.dosis_mg_kg);

  box.innerHTML = `
    <div class="dosis-especial-box dosis-especial-box--carga">
      <div class="dosis-especial-header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Dosis de Carga</span>
        <span class="dosis-especial-desc">${c.descripcion}</span>
      </div>
      ${sinPeso ? `<div class="dosis-especial-aviso">Introduce el peso para calcular la dosis</div>` : ""}
      ${dosisTexto ? `
        <div class="dosis-especial-resultado">
          <span class="dosis-especial-val">${dosisTexto}</span>
          ${dosisCalc ? `<span class="dosis-especial-calc">${dosisCalc}</span>` : ""}
        </div>` : ""}
      <div class="dosis-especial-detalles">
        ${c.tiempo_min ? `<div class="dosis-det-item"><span class="dosis-det-label">Duración</span><span class="dosis-det-val">${c.tiempo_min} min</span></div>` : `<div class="dosis-det-item"><span class="dosis-det-label">Duración</span><span class="dosis-det-val">Bolo</span></div>`}
        <div class="dosis-det-item"><span class="dosis-det-label">Vía</span><span class="dosis-det-val">${c.via}</span></div>
      </div>
      ${c.nota ? `<div class="dosis-especial-nota">${c.nota}</div>` : ""}
    </div>
  `;
}

// ── Tarjeta de dosis puntual ───────────────────────────────
function renderPuntualBox(f) {
  const box = document.getElementById("puntual-box");
  if (!f.puntual) {
    box.innerHTML = `<div class="sin-puntual">Sin datos de dosis puntual disponibles para este fármaco.</div>`;
    return;
  }

  const p = f.puntual;
  const { dosisVal, dosisTexto, dosisCalc } = calcularDosisEspecial(p);
  const sinPeso = !pesoActual && (p.dosis_mcg_kg || p.dosis_mg_kg);

  box.innerHTML = `
    <div class="dosis-especial-box dosis-especial-box--puntual">
      <div class="dosis-especial-header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 8v4l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Dosis Puntual</span>
        <span class="dosis-especial-desc">${p.descripcion}</span>
      </div>
      ${sinPeso ? `<div class="dosis-especial-aviso">Introduce el peso para calcular la dosis</div>` : ""}
      ${dosisTexto ? `
        <div class="dosis-especial-resultado">
          <span class="dosis-especial-val">${dosisTexto}</span>
          ${dosisCalc ? `<span class="dosis-especial-calc">${dosisCalc}</span>` : ""}
        </div>` : ""}
      <div class="dosis-especial-detalles">
        <div class="dosis-det-item dosis-det-item--full"><span class="dosis-det-label">Administración</span><span class="dosis-det-val">${p.via}</span></div>
      </div>
      ${p.nota ? `<div class="dosis-especial-nota">${p.nota}</div>` : ""}
    </div>
  `;
}

function calcularDosisEspecial(d) {
  let dosisVal  = null;
  let dosisTexto = "";
  let dosisCalc  = "";

  if (d.dosis_mcg_kg && pesoActual) {
    dosisVal = d.dosis_mcg_kg * pesoActual; // resultado en mcg
    const enMg = dosisVal / 1000;
    if (enMg >= 1) {
      dosisTexto = `${formatNum(enMg, 2)} mg`;
      dosisCalc  = `${d.dosis_mcg_kg} mcg/kg × ${pesoActual} kg = ${formatNum(dosisVal, 0)} mcg`;
    } else {
      dosisTexto = `${formatNum(dosisVal, 0)} mcg`;
      dosisCalc  = `${d.dosis_mcg_kg} mcg/kg × ${pesoActual} kg`;
    }
  } else if (d.dosis_mg_kg && pesoActual) {
    dosisVal   = d.dosis_mg_kg * pesoActual;
    dosisTexto = `${formatNum(dosisVal, 2)} mg`;
    dosisCalc  = `${d.dosis_mg_kg} mg/kg × ${pesoActual} kg`;
  } else if (d.dosis_fija_mg !== undefined) {
    dosisVal = d.dosis_fija_mg;
    if (dosisVal < 1) {
      dosisTexto = `${formatNum(dosisVal * 1000, 0)} mcg`;
    } else {
      dosisTexto = `${formatNum(dosisVal, dosisVal < 10 ? 2 : 0)} mg`;
    }
  }

  return { dosisVal, dosisTexto, dosisCalc };
}

// ── Modo de cálculo ────────────────────────────────────────
function actualizarModoUI(pres) {
  const btnDosis = document.getElementById("btn-modo-dosis");
  const btnMl    = document.getElementById("btn-modo-ml");
  const labelInp = document.getElementById("label-input");
  const unitInp  = document.getElementById("unit-input");

  btnDosis.classList.toggle("modo--activo", modoCalculo === "dosis");
  btnMl.classList.toggle("modo--activo",    modoCalculo === "ml");

  labelInp.textContent = modoCalculo === "dosis" ? "Dosis deseada" : "Ritmo de bomba";
  unitInp.textContent  = modoCalculo === "dosis" ? pres.unidad     : "ml/h";

  btnDosis.onclick = () => { modoCalculo = "dosis"; actualizarModoUI(pres); limpiarCalc(); };
  btnMl.onclick    = () => { modoCalculo = "ml";    actualizarModoUI(pres); limpiarCalc(); };
}

// ── Información clínica ────────────────────────────────────
function renderInfoClinica(f) {
  const section = document.getElementById("clinica-section");
  if (!f.info) { section.style.display = "none"; return; }
  section.style.display = "flex";

  // Restaurar estado del tab activo en los botones
  document.querySelectorAll(".clinica-tab").forEach(b => {
    b.classList.toggle("clinica-tab--activa", b.dataset.tab === clinicaTab);
  });

  renderContenidoClinica();
}

function renderContenidoClinica() {
  if (!farmSeleccionado || !farmSeleccionado.info) return;
  const items   = farmSeleccionado.info[clinicaTab] || [];
  const cont    = document.getElementById("clinica-contenido");
  const iconos  = {
    indicaciones:      "✓",
    contraindicaciones:"✕",
    precauciones:      "!"
  };
  const ico = iconos[clinicaTab] || "·";
  cont.innerHTML = items.map(item => `
    <div class="clinica-item clinica-item--${clinicaTab}">
      <span class="clinica-bullet">${ico}</span>
      <span>${item}</span>
    </div>
  `).join("");
}

// ── Cálculo principal ──────────────────────────────────────
function calcular() {
  if (!farmSeleccionado || modoAdmin === "puntual") return;
  const pres       = farmSeleccionado.presentaciones[presIndex];
  const inputStr   = document.getElementById("valor-input").value.replace(",", ".");
  const valor      = parseFloat(inputStr);
  const necesitaPeso = ["mcg_kg_min", "mcg_kg_h", "mg_kg_h"].includes(pres.calcTipo);
  const box        = document.getElementById("resultado-box");

  if (isNaN(valor) || valor <= 0) {
    mostrarError(box, "Introduce un valor numérico válido.");
    return;
  }
  if (necesitaPeso && !pesoActual) {
    mostrarError(box, "Es necesario introducir el peso del paciente.");
    return;
  }

  let mlH, dosis;

  if (modoCalculo === "dosis") {
    dosis = valor;
    mlH   = calcMlH(pres, dosis, pesoActual);
  } else {
    mlH   = valor;
    dosis = calcDosis(pres, mlH, pesoActual);
  }

  if (mlH === null || dosis === null || mlH <= 0) {
    mostrarError(box, "Error en el cálculo. Revisa los datos.");
    return;
  }

  let alertaDosis = null;
  const softMax   = pres.softMax || pres.dosisMax;
  const hardMax   = pres.hardMax;

  if (hardMax && dosis > hardMax)          alertaDosis = "peligro";
  else if (softMax && dosis > softMax)     alertaDosis = "alto";
  else if (pres.dosisMin && dosis < pres.dosisMin) alertaDosis = "bajo";

  mostrarResultado(box, pres, mlH, dosis, alertaDosis);
}

// ── Fórmulas de cálculo ────────────────────────────────────
function calcMlH(pres, dosis, peso) {
  const concMg = pres.concMgMl || (pres.concUgMl / 1000);
  const concUg = pres.concUgMl || (pres.concMgMl * 1000);
  switch (pres.calcTipo) {
    case "mcg_kg_min": return (dosis * peso * 60) / concUg;
    case "mcg_kg_h":   return (dosis * peso)       / concUg;
    case "mg_kg_h":    return (dosis * peso)        / concMg;
    case "mcg_min":    return (dosis * 60)          / concUg;
    case "mcg_h":      return  dosis                / concUg;
    case "mg_h":       return  dosis                / concMg;
    case "mg_min":     return (dosis * 60)          / concMg;
    default: return null;
  }
}

function calcDosis(pres, mlH, peso) {
  const concMg = pres.concMgMl || (pres.concUgMl / 1000);
  const concUg = pres.concUgMl || (pres.concMgMl * 1000);
  switch (pres.calcTipo) {
    case "mcg_kg_min": return (mlH * concUg) / (peso * 60);
    case "mcg_kg_h":   return (mlH * concUg) / peso;
    case "mg_kg_h":    return (mlH * concMg) / peso;
    case "mcg_min":    return (mlH * concUg) / 60;
    case "mcg_h":      return  mlH * concUg;
    case "mg_h":       return  mlH * concMg;
    case "mg_min":     return (mlH * concMg) / 60;
    default: return null;
  }
}

// ── Presentación de resultados ─────────────────────────────
function mostrarResultado(box, pres, mlH, dosis, alertaDosis) {
  const tiempoTexto = tiempoRestante(pres.dilucion_ml, mlH);

  let boxClass      = "resultado-box resultado-box--ok";
  let alertaHtml    = "";
  let alertaValClass = "";

  if (alertaDosis === "peligro") {
    boxClass = "resultado-box resultado-box--error";
    alertaValClass = "alerta-peligro";
    alertaHtml = `
      <div class="res-alerta res-alerta--peligro">
        <span class="res-alerta-ico">🛑</span>
        <span><b>DOSIS TÓXICA:</b> Supera el límite de seguridad (${pres.hardMax} ${pres.unidad}). Verifica el valor introducido.</span>
      </div>`;
  } else if (alertaDosis === "alto") {
    boxClass = "resultado-box resultado-box--alerta";
    alertaValClass = "alerta-alto";
    alertaHtml = `
      <div class="res-alerta res-alerta--alto">
        <span class="res-alerta-ico">⚠️</span>
        <span><b>Dosis alta:</b> Supera el rango habitual (máx. ${pres.softMax || pres.dosisMax} ${pres.unidad}).</span>
      </div>`;
  } else if (alertaDosis === "bajo") {
    boxClass = "resultado-box resultado-box--alerta";
    alertaValClass = "alerta-bajo";
    alertaHtml = `
      <div class="res-alerta res-alerta--bajo">
        <span class="res-alerta-ico">ℹ️</span>
        <span><b>Dosis baja:</b> Por debajo del rango habitual (mín. ${pres.dosisMin} ${pres.unidad}).</span>
      </div>`;
  }

  // Calcular slider de seguridad
  const softMax   = pres.softMax || pres.dosisMax;
  const hardMax   = pres.hardMax;
  const dosisMin  = pres.dosisMin;
  let safetyHtml  = "";

  if (softMax || dosisMin) {
    const sliderMax = hardMax ? hardMax * 1.2 : (softMax ? softMax * 1.5 : dosis * 3);
    const safePct   = softMax ? (softMax / sliderMax) * 100 : null;
    const hardPct   = hardMax ? (hardMax / sliderMax) * 100 : null;
    const sliderVal = Math.min(dosis, sliderMax);
    const range     = sliderMax;
    const step      = range <= 2 ? 0.01 : range <= 20 ? 0.1 : 1;

    let gradient;
    if (safePct && hardPct) {
      gradient = `linear-gradient(to right, var(--green) 0%, var(--green) ${safePct.toFixed(1)}%, var(--amber) ${safePct.toFixed(1)}%, var(--amber) ${hardPct.toFixed(1)}%, var(--red) ${hardPct.toFixed(1)}%, var(--red) 100%)`;
    } else if (safePct) {
      gradient = `linear-gradient(to right, var(--green) 0%, var(--green) ${safePct.toFixed(1)}%, var(--amber) ${safePct.toFixed(1)}%, var(--amber) 100%)`;
    } else {
      gradient = `var(--green)`;
    }

    const etiquetas = { ok: "✓ En rango", alto: "▲ Alto", bajo: "▼ Bajo", peligro: "⚠ Tóxico" };
    const etiq      = etiquetas[alertaDosis || "ok"];

    safetyHtml = `
      <div class="res-safety-wrap">
        <div class="res-safety-header">
          <span class="res-safety-titulo">Ajuste de dosis · ${pres.unidad}</span>
          <span class="res-safety-etiqueta res-safety-etiqueta--${alertaDosis || "ok"}">${etiq}</span>
        </div>
        <input type="range" class="safety-slider"
          min="0" max="${sliderMax.toFixed(3)}"
          value="${sliderVal.toFixed(3)}"
          step="${step}"
          style="--slider-gradient: ${gradient}"
          oninput="onSafetySliderInput(this)"
          onchange="onSafetySlider(this)">
        <div class="res-safety-zones">
          <span>0</span>
          ${softMax ? `<span>${formatNum(softMax, 2)}</span>` : ""}
          ${hardMax ? `<span>${formatNum(hardMax, 2)}</span>` : ""}
        </div>
      </div>`;
  }

  const mlHTexto = formatNum(mlH, 2);

  box.className = boxClass;
  box.innerHTML = `
    <div class="res-principal">
      <div class="res-item res-item--grande">
        <span class="res-label">Ritmo de bomba</span>
        <div class="res-valor-wrap">
          <span class="res-valor">${mlHTexto}</span>
          <button class="btn-copiar" onclick="copiarResultado('${mlHTexto} ml/h')" title="Copiar ml/h">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2"/></svg>
            Copiar
          </button>
        </div>
        <span class="res-unit">ml / h</span>
      </div>
      <div class="res-divider"></div>
      <div class="res-item">
        <span class="res-label">Dosis real</span>
        <span class="res-valor ${alertaValClass}">${formatNum(dosis, 3)}</span>
        <span class="res-unit">${pres.unidad}</span>
      </div>
    </div>
    ${alertaHtml}
    ${safetyHtml}
    <div class="res-extras">
      <div class="res-extra-item">
        <span class="res-extra-label">⏱ Bolsa</span>
        <span class="res-extra-val">${tiempoTexto}</span>
      </div>
      <div class="res-extra-item">
        <span class="res-extra-label">🧪 Conc.</span>
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
  box.innerHTML = `<div class="res-error"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="2"/><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>${msg}</span></div>`;
}

// ── Utilidades ─────────────────────────────────────────────
function calcConcentracion(pres) {
  if (pres.concMgMl !== undefined)
    return { valor: pres.concMgMl, texto: `${formatNum(pres.concMgMl, 3)} mg/ml` };
  if (pres.concUgMl !== undefined)
    return { valor: pres.concUgMl, texto: `${formatNum(pres.concUgMl, 2)} mcg/ml` };
  return { valor: 0, texto: "—" };
}

function tiempoRestante(volMl, mlH) {
  if (!mlH || mlH <= 0) return "—";
  const horas = volMl / mlH;
  if (horas >= 24) return `${(horas / 24).toFixed(1)} días`;
  if (horas >= 1)  return `${Math.floor(horas)}h ${Math.round((horas % 1) * 60)}min`;
  return `${Math.round(horas * 60)} min`;
}

function formatNum(n, decimals = 2) {
  if (n === null || isNaN(n)) return "—";
  return new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0
  }).format(n);
}

// ── Slider de seguridad de dosis ──────────────────────────
function onSafetySliderInput(slider) {
  // Actualiza el input de dosis en tiempo real mientras se arrastra
  const val      = parseFloat(slider.value);
  const step     = parseFloat(slider.step);
  const decimals = step < 0.05 ? 2 : step < 1 ? 1 : 0;
  const rounded  = parseFloat(val.toFixed(decimals));
  document.getElementById("valor-input").value = String(rounded).replace(".", ",");
}

function onSafetySlider(slider) {
  // Al soltar: actualiza el input y recalcula
  const val      = parseFloat(slider.value);
  const step     = parseFloat(slider.step);
  const decimals = step < 0.05 ? 2 : step < 1 ? 1 : 0;
  const rounded  = parseFloat(val.toFixed(decimals));
  document.getElementById("valor-input").value = String(rounded).replace(".", ",");
  // Asegurarse de que estamos en modo dosis→ml/h
  if (modoCalculo !== "dosis") {
    modoCalculo = "dosis";
    const pres = farmSeleccionado && farmSeleccionado.presentaciones[presIndex];
    if (pres) actualizarModoUI(pres);
  }
  calcular();
}

// ── Copiar resultado ───────────────────────────────────────
function copiarResultado(texto) {
  if (!navigator.clipboard) {
    mostrarToast("Copia no disponible en este navegador", "error");
    return;
  }
  navigator.clipboard.writeText(texto).then(() => {
    mostrarToast("Copiado: " + texto, "ok");
  }).catch(() => {
    mostrarToast("No se pudo copiar", "error");
  });
}

function mostrarToast(mensaje, tipo) {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast" + (tipo === "ok" ? " toast--ok" : "");
  toast.textContent = mensaje;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 2100);
}
