# AGENTS.md — Perfusiones UCI

Guía de referencia para el desarrollo asistido por IA de este proyecto.
Léelo completo antes de proponer cualquier cambio.

---

## 1. Descripción del proyecto

**Perfusiones UCI** es una calculadora clínica de perfusiones intravenosas para uso en Unidades de Cuidados Intensivos. Permite al personal sanitario (médicos y enfermeras de UCI) calcular el ritmo de bomba de infusión (ml/h) a partir de una dosis prescrita, o la dosis real que está recibiendo un paciente a partir de un ritmo de bomba conocido.

### Contexto clínico relevante

- Las perfusiones en UCI son fármacos de **alto riesgo**: errores de dosis pueden ser fatales. La herramienta debe priorizar claridad y fiabilidad sobre cualquier otra consideración.
- Los fármacos están preparados en **diluciones estándar** fijas (ej. "10 mg en 250 ml de Dx5%"). La concentración resultante determina la relación dosis/ritmo.
- Muchos fármacos se dosifican **ajustados al peso** del paciente (mcg/kg/min, mg/kg/h). El peso del paciente es un dato de sesión que persiste mientras se trabaja.
- Las **unidades de dosis** varían según el fármaco: mcg/kg/min (vasoactivos), mg/kg/h (sedantes), mcg/min (nitroglicerina), mg/h (diuréticos). El sistema maneja todas estas variantes.
- El rango de dosis recomendado no es absoluto: en UCI se trabaja fuera de rango con frecuencia. Las alertas son orientativas, nunca bloqueantes.
- La herramienta se usa **en cabecera de cama**, frecuentemente con guantes, en condiciones de luz variable. La UI debe ser legible, táctil, y sin fricción.

### Estado actual (verificado contra el código el 24/11/2026)

- **Versión**: el código no declara un número de versión de la app. Las cabeceras de `app.js`, `farmacos.js` y `styles.css` dicen «V3»; el Service Worker (`sw.js`) dice «V7» y su caché se llama `perfusiones-v9` (`CACHE_NAME`). **Al cambiar cualquier archivo estático hay que subir `CACHE_NAME`** (p. ej. `perfusiones-v10`); no hay otra versión visible en la interfaz.
- **Datos**: 44 fármacos, 50 presentaciones en total y 15 categorías (las categorías se generan solas desde `farmacos.js`).
- **Pantallas** (una sola página, sin rutas): cabecera (título, peso del paciente, botón de tema claro/oscuro); barra lateral con buscador, chips de categoría (incluye «Favoritos») y lista de fármacos; panel de detalle del fármaco (en escritorio ocupa toda la zona central a la derecha de la lista; en móvil sale desde abajo con un overlay).
- **Funciones del panel**: selector de modo de administración (`perfusion`, `puntual`, `carga_mantenimiento`) cuando el fármaco tiene más de uno; pestañas de presentación; cálculo «Dosis → ml/h» y «ml/h → Dosis»; resultado con alertas de dosis (tóxica / alta / baja); barra de ajuste de dosis (slider) que recalcula al soltar; botón Copiar (copia el ml/h); tiempo que dura la bolsa; detalles de la dilución (colapsable); información clínica (indicaciones, precauciones, contraindicaciones); tarjetas de dosis de carga y de dosis puntual; favoritos (estrella).
- **Almacenamiento local** (`localStorage`, solo en el dispositivo): `perfusiones-tema` («claro» / «oscuro»), `perfusiones-peso` (peso introducido, 0–300 kg; se recupera al recargar) y `perfusiones-favoritos` (JSON con los nombres de los fármacos favoritos). No hay `sessionStorage`, cookies ni servidor.
- **Publicación**: GitHub Pages en https://cjgaland.github.io/PerfusionesUCI/, servido desde el repositorio público `cjgaland/PerfusionesUCI` (rama `main`, raíz). Cada push a `main` actualiza la web en uno o dos minutos. Para probarla en local: `.claude/launch.json` define `npx serve -p 5050 .` (http://localhost:5050); el Service Worker solo funciona servido por http(s), no abriendo el archivo directamente.
- **PWA**: `manifest.json` (nombre «Perfusiones UCI», `display: standalone`, iconos PNG `icon-192.png`, `icon-512.png`, `icon-512-maskable.png` y `icon-512.svg`; en `index.html`, favicon `icon-192.svg`/`icon-192.png` y `apple-touch-icon` `icon-180.png`, porque iOS no admite iconos SVG) + `sw.js` con estrategia network-first y caché de respaldo sin conexión. `app.js` registra el SW y recarga la página cuando un SW nuevo toma el control.
- **Origen de los datos**: `PERFUSIONES INTRAVENOSAS (1).xlsx` es la hoja de cálculo original de la UCI (hojas «MCG --> ML» y «ML --> MCG» con 32 filas de medicación/presentación, y una hoja oculta de concentraciones y pesos). Es el antecedente de la app: las presentaciones coinciden (suero, mg, ml). La app lo amplía a 44 fármacos y en algunos rangos difiere del Excel (p. ej. nimodipino y amiodarona figuran allí como «0.5» y «10 mcg/kg/min»). El Excel **no se lee desde el código**.
- **Otra carpeta**: existe `/Users/Trabajo/Desktop/Utilidades Clínicas/Pediatría/DosisPed/Perfusiones`, pero solo contiene `.claude/` y `assets/favicons` (vacío): no es una copia de la app.

---

## 2. Arquitectura

### Estructura de archivos

```
Perfusiones/
├── index.html      → Estructura HTML, único punto de entrada
├── styles.css      → Todo el CSS: variables, componentes, responsive
├── app.js          → Toda la lógica: estado, renderizado, cálculos
├── farmacos.js     → Base de datos de fármacos (datos puros, sin lógica)
├── sw.js           → Service Worker (caché offline, network-first; CACHE_NAME "perfusiones-v9")
├── manifest.json   → Manifiesto PWA (usa los PNG y icon-512.svg)
├── icon-180.svg, icon-192.svg, icon-512.svg → Iconos fuente (las líneas van en color sólido: un degradado no se pinta en una línea recta vertical u horizontal)
├── icon-180.png, icon-192.png, icon-512.png, icon-512-maskable.png → PNG generados desde los SVG (iPhone, Android, favicon); el maskable tiene fondo a sangre y dibujo al 80 %
├── README.md       → Descripción breve del repositorio
├── .gitignore      → Excluye Backup/, .DS_Store, .claude/settings.local.json y *.xlsx
├── PERFUSIONES INTRAVENOSAS (1).xlsx → Hoja de cálculo original (referencia; no la lee el código)
├── .claude/        → launch.json (npx serve, puerto 5050) y settings.local.json
├── Backup/         → Copias de seguridad locales (ver sección 8); se conservan las 5 más recientes
├── CLAUDE.md       → Guía para Claude Code
└── AGENTS.md       → Guía para Codex (copia de CLAUDE.md; ambos deben mantenerse iguales salvo título y sección 7)
```

### Relaciones entre archivos

```
index.html
  ├── <link> styles.css          (cargado en <head>)
  ├── <link> manifest.json       (PWA)
  ├── <script> farmacos.js       (cargado antes de app.js)
  └── <script> app.js            (accede a `farmacos` y `categorias` globales; registra sw.js)
```

`farmacos.js` define tres constantes globales:
- `ISO_COLORS` → colores por tipo de fármaco (`var(--iso-*)`), usados como `isoColor` de cada fármaco
- `farmacos` → array de objetos fármaco
- `categorias` → array de strings con categorías únicas ordenadas alfabéticamente (`[...new Set(...)].sort()`)

`app.js` consume ambas. No hay módulos ES, imports ni bundler. Todo es global.

### Estructura del DOM

```
<body>
  <header class="app-header">          ← sticky, z-index 100 (peso, botón de tema)
  <div class="app-content">            ← grid 2 columnas (310px / 1fr; 250px en ≤ 900px)
    <aside class="sidebar">            ← columna 1: búsqueda, chips de categoría (#filtros), lista (#lista-farmacos)
    <main class="main-area">           ← columna 2
      <div class="empty-state">        ← visible cuando no hay fármaco seleccionado
  <div id="panel-overlay">             ← solo activo en móvil
  <aside id="panel-detalle">           ← hermano de .app-content; position: fixed (escritorio y móvil)
  <div id="toast-container">           ← avisos breves (copiar)
```

El panel de detalle NO está dentro de `.main-area`: es un `<aside>` fijo que se desliza (`translateX` en escritorio, `translateY` en móvil) al recibir la clase `abierto`. `.app-content` recibe la clase `con-panel` mientras hay un fármaco abierto (oculta `.empty-state`).

### Estado global (app.js)

| Variable | Tipo | Descripción |
|---|---|---|
| `pesoActual` | `number \| null` | Peso del paciente en kg. `null` si no introducido |
| `farmSeleccionado` | `object \| null` | Objeto fármaco completo del array `farmacos` |
| `presIndex` | `number` | Índice de la presentación activa (0-based) |
| `modoCalculo` | `"dosis" \| "ml"` | Dirección del cálculo |
| `modoAdmin` | `"perfusion" \| "puntual" \| "carga_mantenimiento"` | Modo de administración activo; al seleccionar un fármaco se toma `modos[0]` (o `"perfusion"` si no tiene `modos`) |
| `categoriaFiltro` | `string` | Categoría activa. `"Todos"` por defecto (también puede ser `"Favoritos"`) |
| `clinicaTab` | `string` | Pestaña de información clínica activa (`indicaciones` por defecto) |
| `clinicaAbierta` | `boolean` | Si el bloque de información clínica está desplegado |
| `favoritos` | `Set<string>` | Nombres de fármacos favoritos (se guarda en `localStorage`) |

### Flujo de datos

```
Usuario selecciona fármaco
  → seleccionarFarmaco(f)
    → farmSeleccionado = f, presIndex = 0, modoCalculo = "dosis", modoAdmin = f.modos[0]
    → abrirPanel()          ← añade 'abierto' a #panel-detalle y 'con-panel' a .app-content; overlay solo si window.innerWidth <= 640
    → renderPanel()         ← pinta toda la UI del panel con los datos del fármaco
      → actualizarSeccionesPorModo() → precargarYCalcular(pres)
        → precarga dosisMin en el input (si dosisMin > 0)
        → setTimeout(() => calcular(), 0)   ← calcula automáticamente al abrir

Usuario pulsa "Calcular"
  → calcular()
    → lee valor del input (coma → punto); error si no es número > 0 o si falta el peso y el calcTipo lo necesita
    → llama calcMlH() o calcDosis() según modoCalculo
    → decide la alerta: dosis > hardMax → "peligro"; dosis > (softMax || dosisMax) → "alto"; dosis < dosisMin → "bajo"
    → mostrarResultado() o mostrarError()

Usuario pulsa "Cerrar" (✕)
  → cerrarPanel()
    → quita 'abierto' de #panel-detalle, 'con-panel' de .app-content y el overlay
    → farmSeleccionado = null
    → renderizarLista()     ← actualiza cards (quita estado activo)
```

---

## 3. Convenciones de código

### Naming CSS

- **Componentes**: `.nombre-componente` (kebab-case en español)
- **Modificadores BEM**: `.componente--modificador` (doble guion)
- **IDs**: `#kebab-case` para elementos únicos con lógica JS
- **Prefijos semánticos**:
  - `.farm-*` → elementos de la lista de fármacos
  - `.panel-*` → elementos del panel de detalle
  - `.res-*` → elementos del bloque de resultado
  - `.btn-*` → botones
  - `.calc-*` → elementos del área de cálculo
  - `.peso-*` → widget de peso

### Naming JS

- Funciones: `camelCase` en español (`seleccionarFarmaco`, `renderizarLista`)
- Variables locales: `camelCase` en español
- Estado global: `camelCase` en español
- IDs del DOM: se accede siempre con `getElementById` o `querySelector`, nunca se cachean en variables globales persistentes

### Estructura de un objeto fármaco

```js
{
  nombre: "NOMBRE EN MAYÚSCULAS",      // string, se muestra tal cual
  categoria: "Nombre Categoría",        // debe coincidir exactamente con otras entradas del mismo grupo
  isoColor: ISO_COLORS.vasoactivo,      // franja de color de la tarjeta (vasoactivo, sedoanalgesia, opiaceo, relajante, antihipertensivo, antiarritmico, neutral)
  icono: "emoji",                       // un único emoji
  modos: ["perfusion", "puntual"],      // modos de administración; el primero es el que se abre. Valores: "perfusion" | "puntual" | "carga_mantenimiento"
  carga: { descripcion, dosis_mg_kg | dosis_mcg_kg | dosis_fija_mg, tiempo_min, via, nota },  // opcional (modo carga_mantenimiento); sin tiempo_min se muestra «Bolo»
  puntual: { descripcion, dosis_mg_kg | dosis_mcg_kg | dosis_fija_mg, via, nota },            // opcional (modo puntual)
  info: { indicaciones: [..], contraindicaciones: [..], precauciones: [..] },                // opcional (bloque «Información clínica»)

  presentaciones: [                     // array con al menos una presentación
    {
      label: "Xmg / Yml Suero",         // string descriptivo para el tab
      dosis_mg: number,                  // mg totales del fármaco en la bolsa
      dilucion_ml: number,               // volumen total de la bolsa en ml
      suero: "Dx5%" | "SSF" | "Puro",   // vehículo

      // Concentración: definir UNO de los dos según la unidad de dosis
      concUgMl: number,                  // cuando la dosis es en mcg (calculado: dosis_mg * 1000 / dilucion_ml)
      concMgMl: number,                  // cuando la dosis es en mg (calculado: dosis_mg / dilucion_ml)
      // Si el fármaco necesita ambas (ej. Cisatracurio), se pueden incluir los dos

      dosisRange: "X – Y unidad",        // string para mostrar al usuario (usar coma decimal, formato español)
      dosisMin: number,                  // límite inferior para alerta «Dosis baja»; además es el valor que se precarga al abrir
      softMax: number,                   // límite superior habitual: por encima, alerta «Dosis alta» (`dosisMax` es un nombre antiguo: app.js solo lo usa si no hay softMax; ningún fármaco actual lo define)
      hardMax: number,                   // límite de seguridad: por encima, «DOSIS TÓXICA» (sigue sin bloquear el cálculo)

      unidad: string,                    // unidad que verá el usuario en el input
      calcTipo: string                   // determina la fórmula (ver tabla abajo)
    }
  ]
}
```

Notas verificadas en el código:
- El campo `dosis_mg` guarda también las **UI** (heparina, insulina, vasopresina: «25000 UI» va en `dosis_mg`, la unidad mostrada es `UI/kg/h` o `UI/h` y se calcula con `calcTipo` de mg). Es una convención del proyecto: las UI se tratan como mg.
- `calcMlH()`/`calcDosis()` calculan `concMg = concMgMl || concUgMl / 1000` y `concUg = concUgMl || concMgMl * 1000`, por lo que basta definir una de las dos concentraciones (Cisatracurio define las dos).
- Los fármacos solo con modo `puntual` (p. ej. Succinilcolina) conservan una presentación porque `renderPanel()` la lee, aunque en ese modo no se calcula ml/h.

### Tabla de calcTipo

| `calcTipo` | Necesita peso | Unidad dosis | Fórmula ml/h |
|---|---|---|---|
| `"mcg_kg_min"` | Sí | mcg/kg/min | `(dosis × peso × 60) / concUgMl` |
| `"mcg_kg_h"` | Sí | mcg/kg/h | `(dosis × peso) / concUgMl` |
| `"mg_kg_h"` | Sí | mg/kg/h | `(dosis × peso) / concMgMl` |
| `"mcg_min"` | No | mcg/min | `(dosis × 60) / concUgMl` |
| `"mcg_h"` | No | mcg/h | `dosis / concUgMl` |
| `"mg_h"` | No | mg/h | `dosis / concMgMl` |
| `"mg_min"` | No | mg/min | `(dosis × 60) / concMgMl` |

Fórmulas inversas (`calcDosis`, modo «ml/h → Dosis»): `mcg_kg_min` = `(mlH × concUg) / (peso × 60)`; `mcg_kg_h` = `(mlH × concUg) / peso`; `mg_kg_h` = `(mlH × concMg) / peso`; `mcg_min` = `(mlH × concUg) / 60`; `mcg_h` = `mlH × concUg`; `mg_h` = `mlH × concMg`; `mg_min` = `(mlH × concMg) / 60`. Necesitan peso (`necesitaPeso`) solo `mcg_kg_min`, `mcg_kg_h` y `mg_kg_h`.

Otros cálculos (transcritos del código): duración de la bolsa = `dilucion_ml / mlH` (`tiempoRestante`: «N días» si ≥ 24 h, «Xh Ymin» si ≥ 1 h, «N min» si menos); `formatNum()` usa `Intl.NumberFormat("es-ES")` (ml/h con 2 decimales como máximo, dosis real con 3); dosis de carga/puntual (`calcularDosisEspecial`): `dosis_mcg_kg × peso` (se muestra en mg si ≥ 1 mg, si no en mcg), `dosis_mg_kg × peso` (mg) o `dosis_fija_mg` (en mcg si < 1 mg); el slider de seguridad tiene máximo `hardMax × 1,2` (o `softMax × 1,5`, o `dosis × 3`) y paso 0,01 / 0,1 / 1 según ese máximo (≤ 2 / ≤ 20 / mayor).

### Cómo añadir un nuevo fármaco

1. Añadir el objeto al array `farmacos` en `farmacos.js`, **en orden alfabético** respecto al campo `nombre`.
2. Calcular `concUgMl` o `concMgMl` inline como expresión matemática comentada (ej. `(10 * 1000) / 250  // 40 mcg/ml`). No poner el valor numérico fijo — mantener la expresión visible facilita la auditoría clínica.
3. Elegir el `calcTipo` correcto según la tabla anterior.
4. Si la categoría es nueva, aparecerá automáticamente en los filtros (se genera con `Set`).
5. Verificar `dosisMin`, `softMax` y `hardMax` contra fichas técnicas o protocolos del servicio.
6. Definir `modos` (y `carga`/`puntual`/`info` si aplican) y asignar `isoColor`.
7. Subir `CACHE_NAME` en `sw.js` para que los dispositivos reciban el cambio, y hacer antes una copia de seguridad (sección 8).

---

## 4. Sistema de variables CSS

### Organización

```css
:root { }           /* Modo oscuro (por defecto) */
:root.modo-claro { } /* Overrides para modo claro */
```

La clase `modo-claro` se añade al `<html>` desde JS. El modo se persiste en `localStorage` con la clave `"perfusiones-tema"`; si no hay valor guardado se usa `prefers-color-scheme` del sistema.

### Tokens disponibles

| Variable | Uso |
|---|---|
| `--bg` | Fondo base (body, app-content) |
| `--bg-2` | Fondo de superficies elevadas (header, sidebar, panel) |
| `--bg-3` | Fondo de elementos interactivos en reposo (inputs, panel-header) |
| `--bg-4` | Fondo de microelementos (chips, badges, tabs) |
| `--border` | Bordes principales |
| `--border-lite` | Bordes secundarios (inputs con foco) |
| `--cyan` | Color de acción/marca (links, activos, botón calcular) |
| `--cyan-dim` | Fondo de estados activos (chip activo, card activa) |
| `--cyan-glow` | Sombra de brillo en hover del botón calcular |
| `--green` | Valores dentro de rango |
| `--amber` | Alertas (dosis baja, aviso peso) |
| `--red` | Errores (dosis alta, error de cálculo) |
| `--red-dim` | Fondo de bloque de error |
| `--text-1` | Texto principal |
| `--text-2` | Texto secundario |
| `--text-3` | Texto terciario / placeholders |
| `--header-h` | Altura del header (60px en desktop, 56px en móvil) |
| `--sidebar-w` | **No existe en el CSS actual.** El ancho de la barra lateral va en `.app-content { grid-template-columns: 310px 1fr }` (250px en ≤ 900px) |
| `--panel-w` | 430px (370px en ≤ 900px, 100% en móvil); en escritorio el ancho real del panel lo fijan `calc(100vw - 310px)` (`calc(100vw - 250px)` en tablet) en el `@media (min-width: 641px)` |
| `--green-dim`, `--amber-dim`, `--radius-xl`, `--shadow`, `--shadow-sm` | Variantes de tono, radio y sombras |
| `--iso-violet/yellow/blue/red/green/orange/neutral` | Colores de la franja por tipo de fármaco (los usa `ISO_COLORS` en `farmacos.js`) |
| `--safe-zone`, `--soft-stop`, `--hard-stop` | Zonas del slider de seguridad y alertas (`alerta-bajo/alto/peligro`) |
| `--radius` | Radio de borde estándar (10px) |
| `--radius-lg` | Radio de borde grande (16px, resultado) |
| `--font` | Inter (tipografía principal) |
| `--mono` | JetBrains Mono (números, concentraciones, resultados) |

Las dos fuentes se cargan con un `@import` de Google Fonts al principio de `styles.css`: hace falta conexión la primera vez; sin conexión se usa `sans-serif`/`monospace` del sistema (el Service Worker solo cachea respuestas del propio origen).

### Breakpoints

| Media query | Contexto |
|---|---|
| `> 640px` (`min-width: 641px`) | Desktop/tablet: layout de 2 columnas; el panel (fijo) cubre la zona central |
| `≤ 900px` | Tablet: sidebar de 250px, panel más estrecho |
| `≤ 640px` | Móvil: layout vertical, lista horizontal, panel slide desde abajo |
| `≤ 360px` | Móvil muy estrecho: ajustes adicionales |

---

## 5. Bugs conocidos y deudas técnicas

### Inconsistencias en datos (farmacos.js)

> **Estado a 24/11/2026**: B1, B2, B4, B5, B7 y B8 ya no se reproducen en el código actual (ver la nota «Estado» de cada uno; se conservan como historia). B3 y B6 siguen vigentes en otra forma. Los límites actuales son `dosisMin`/`softMax`/`hardMax`.

**B1 — Nimodipino: `dosisRange` no coincide con `dosisMin`/`dosisMax`**
```js
dosisRange: "0,5 mcg/kg/min",   // muestra un único punto de dosis
dosisMin: 0.25, dosisMax: 2,    // pero los límites programáticos son 0,25–2
```
El usuario ve en pantalla "0,5 mcg/kg/min" como rango, pero la alerta no dispara hasta que baja de 0,25 o sube de 2. Confuso clínicamente. Hay que alinear el string con los límites o viceversa.
*Estado 24/11/2026: resuelto. Hoy Nimodipino muestra `"0,25 – 2 mcg/kg/min"` con `dosisMin: 0.25, softMax: 2, hardMax: 3` (`farmacos.js` ~1338-1339).*

**B2 — Amiodarona: misma inconsistencia**
```js
dosisRange: "10 mcg/kg/min",    // parece una dosis fija
dosisMin: 8, dosisMax: 12,      // pero los límites tienen holgura
```
Mejor mostrar `"8 – 12 mcg/kg/min"` para coherencia con el resto.
*Estado 24/11/2026: resuelto. Hoy Amiodarona muestra `"8 – 12 mcg/kg/min"` con `dosisMin: 8, softMax: 12, hardMax: 15` (`farmacos.js` ~194-195).*

**B3 — Somatostatina y Valproico con `dosisMin === dosisMax`**
Cuando ambos valores son iguales, la condición `if (pres.dosisMin !== pres.dosisMax)` nunca dispara, por lo que nunca habrá alerta aunque el usuario introduzca un valor muy alejado. Para dosis fijas, considerar mostrar una alerta informativa si el valor difiere de la dosis estándar.
*Estado 24/11/2026: la condición `dosisMin !== dosisMax` ya no existe en `app.js` (ahora se comparan `hardMax`, `softMax` y `dosisMin`). Somatostatina tiene `dosisMin: 3.5, softMax: 3.5, hardMax: 4.0` (`farmacos.js` ~1669), así que avisa «alto» por encima de 3,5 y «bajo» por debajo de 3,5. Valproico tiene `dosisRange: "1 mg/kg/h"` pero `dosisMin: 1, softMax: 1.5, hardMax: 2.0` (`farmacos.js` ~1842-1843): el texto mostrado no coincide con el rango real de la alerta (misma situación que B1/B2).*

### Código (app.js)

**B4 — Variable `dosisBase` es código muerto**
```js
const dosisBase = necesitaPeso ? dosis : dosis; // ambas ramas son idénticas
```
Esta línea no hace nada útil. Eliminar.
*Estado 24/11/2026: `dosisBase` ya no existe en `app.js`.*

**B5 — Shadowing de variable `inp` en `bindPeso()`**
```js
function bindPeso() {
  const inp = document.getElementById("peso-input");   // ← inp = campo de peso
  inp.addEventListener("input", () => {
    // ...
    const inp = document.getElementById("valor-input"); // ← inp redeclarado en el closure
```
Funciona por block scoping de `const`, pero es confuso. Renombrar la interior a `inpValor` o similar.
*Estado 24/11/2026: resuelto; `bindPeso()` usa `inpVal` para el campo de valor (`app.js` ~269 y ~275).*

**B6 — `setTimeout(() => calcular(), 0)` en `renderPanel()`**
Se usa para que el DOM actualice el valor del input antes de calcular. Funciona, pero si el usuario cambia de fármaco muy rápidamente, pueden quedar timeouts huérfanos. Bajo impacto real, pero considerar `clearTimeout` con un ref.
*Estado 24/11/2026: el `setTimeout(() => calcular(), 0)` sigue sin `clearTimeout`, pero ya no está en `renderPanel()` sino en `precargarYCalcular()` (`app.js` ~465).*

**B7 — Transition de `transform` se pierde en móvil al cambiar tema**
La regla global de transición es:
```css
#panel-detalle { transition: background 0.25s, border-color 0.25s, color 0.25s; }
```
En móvil se sobreescribe a solo `transform`, perdiendo las transiciones de color. Usar `transition: transform 0.28s ..., background 0.25s, ...` en el bloque móvil.
*Estado 24/11/2026: resuelto; el bloque móvil ya incluye `transform 0.3s ..., background 0.25s, border-color 0.25s, color 0.25s` (`styles.css` ~1304).*

**B8 — Sin persistencia de peso entre recargas**
El peso del paciente se pierde al recargar. En UCI es habitual trabajar durante horas con el mismo paciente. Considerar `localStorage` para persistir el peso.
*Estado 24/11/2026: resuelto; el peso se guarda en `localStorage` (`perfusiones-peso`) y se recupera al abrir. Contrapartida: el peso queda guardado entre pacientes hasta que se borra o se cambia el campo.*

### Observaciones nuevas (24/11/2026, solo descriptivas; nada se ha modificado)

- 24/11/2026: se borraron los ficheros sin uso (`icons/`, `assets/favicons/`, `estructura.txt`); se añadieron iconos PNG (antes no había favicon y el icono de iPhone era SVG, que iOS ignora); y se corrigió que el aviso «Introduce el peso» no se ocultaba en el modo carga + mantenimiento al escribir el peso (`bindPeso()` en `app.js`).
- `farmacos.js`: Succinilcolina usa `unidad: "mg/kg"` con `calcTipo: "mg_kg_h"` (solo modo `puntual`, donde no se calcula ml/h). Heparina, Insulina y Vasopresina usan `calcTipo` de mg para cantidades en UI (ver nota en la estructura del objeto fármaco).
- `.claude/launch.json` usa `npx serve`, que no es una dependencia del proyecto (solo para vista previa local).

---

## 6. Roadmap sugerido

Priorizado por impacto clínico en UCI. Las primeras son las más urgentes.

> **Estado a 24/11/2026 (verificado en el código)**: R1 hecho en otra forma (campos `carga` y `puntual` por fármaco, con `modos`, en lugar de `boloMg`/`boloMcgKg`); R2 hecho (clave `perfusiones-peso`); R3 hecho (B1 y B2 corregidos); R5 hecho (`manifest.json` + `sw.js`). R4, R6, R7, R8, R10 y R12 no están implementados (no hay `@media print` ni historial ni comparativa). R9 no está implementado como tal. R11: ya están insulina, heparina, vasopresina, ketamina, remifentanilo y propofol; faltan bicarbonato y tiopental. Los textos de abajo se conservan como historia.

### P1 — Crítico (impacto en seguridad o uso diario)

**R1. Dosis de carga (bolus)**
La mayoría de fármacos UCI requieren una dosis de carga antes de iniciar la perfusión. Hoy esto no se calcula. Añadir campo `boloMg` o `boloMcgKg` en el objeto presentación y una sección en el panel que calcule el volumen del bolo según peso. Alta prioridad: es una omisión clínica importante.

**R2. Persistencia del peso en localStorage**
El personal trabaja turnos de 8-12h con el mismo paciente. Perder el peso al recargar es un punto de fricción real. Guardar/recuperar con la misma clave que el tema.

**R3. Alinear dosisRange con dosisMin/dosisMax (bugs B1 y B2)**
Error de datos que puede generar confusión clínica. Corrección inmediata.

### P2 — Alta utilidad

**R4. Titulación: calculadora de incremento**
"Si cambio de X a Y mcg/kg/min, ¿cuántos ml/h subo o bajo?" Muy habitual con noradrenalina y otros vasoactivos donde se titula cada pocos minutos. Implementar como segunda sección colapsable en el panel, debajo del resultado principal.

**R5. Modo PWA / offline**
La UCI puede tener WiFi inestable. Un Service Worker que cachee los archivos estáticos garantiza disponibilidad offline. Implementación: `manifest.json` + `sw.js` básico. Sin cambios en la lógica.

**R6. Tabla de paciente (múltiples perfusiones)**
Vista de resumen con todos los fármacos calculados para un mismo paciente (nombre, presentación, ritmo). Imprimible o copiable. Requiere estado adicional: array de `calculaciones` en sesión.

### P3 — Mejoras de UX

**R7. Historial de sesión**
Lista de los últimos N cálculos realizados, accesible sin tener que reseleccionar el fármaco. Útil cuando se necesita volver a un fármaco previo. Implementar en `sessionStorage`.

**R8. Comparativa de presentaciones**
Para fármacos con múltiples presentaciones (Noradrenalina, Adrenalina, Dexmedetomidina), mostrar una tabla comparativa de ml/h para la misma dosis en cada presentación. Ayuda a elegir la más adecuada según restricción de fluidos.

**R9. Alerta de dosis fija mejorada (bug B3)**
Para Somatostatina, Valproico y otros con dosis única, mostrar un indicador informativo ("dosis fija de protocolo") en lugar de silencio total.

**R10. Compatibilidad de suero**
Algunos fármacos son incompatibles con Dx5% (ej. insulina) o con SSF. Añadir campo `sueroCompatible` y mostrar aviso si el suero elegido no es el habitual. Solo informativo.

### P4 — Futuro

**R11. Fármacos adicionales frecuentes en UCI**
Candidatos: insulina (U/h), heparina (U/h), bicarbonato, vasopresina, ketamina, remifentanilo, propofol 2%, tiopental.

**R12. Exportar PDF / imprimir**
Vista de impresión con CSS `@media print` que muestre un resumen limpio de todos los cálculos de la sesión.

---

## 7. Instrucciones para Codex

### Principios generales

1. **La seguridad clínica es la restricción más importante.** Ante la duda entre una UI más elegante y una UI más clara/legible, elegir siempre la más clara. Los resultados numéricos (ml/h, dosis) deben ser siempre el elemento más prominente visualmente.

2. **No añadir lo que no se pide.** Si el usuario pide cambiar el color de un botón, no reorganizar el layout. Si pide un nuevo fármaco, no refactorizar el sistema de cálculo.

3. **Leer el archivo antes de editarlo.** Siempre. Nunca proponer cambios sin haber leído el contexto circundante.

### Qué preservar siempre

- **Separación `farmacos.js` / `app.js`**: Los datos clínicos van en `farmacos.js`, la lógica en `app.js`. No mezclar nunca.
- **Sin frameworks ni dependencias externas**: Este proyecto es HTML/CSS/JS puro. No añadir React, Vue, npm, bundlers ni librerías externas sin consultar explícitamente.
- **Sin módulos ES (`import`/`export`)**: No hay bundler ni servidor de desarrollo propio. Mantener todo como scripts globales. (El Service Worker solo funciona servido por http(s); para vista previa local, `npx serve -p 5050 .` según `.claude/launch.json`.)
- **El sistema de tokens CSS**: No hardcodear colores ni tamaños. Usar siempre variables CSS existentes. Si se necesita un nuevo valor, añadirlo como variable al `:root`.
- **Soporte modo claro/oscuro**: Todo elemento visual nuevo debe verse bien en ambos modos. Añadir overrides en `:root.modo-claro { }` si es necesario.
- **Responsive en los tres breakpoints**: Cualquier cambio de UI debe probarse mentalmente en desktop (>900px), tablet (640–900px) y móvil (<640px).
- **Decimal con coma**: Los números mostrados al usuario usan coma decimal (español). La función `formatNum()` lo gestiona. No cambiar este comportamiento ni usar `.toLocaleString()` sin asegurarse de que el locale es `es`.
- **Alertas no bloqueantes**: Las alertas de rango (`alerta-alto`, `alerta-bajo`, `alerta-peligro`) son informativas. Nunca impedir el cálculo ni requerir confirmación.

### Qué no tocar sin permiso explícito

- Las fórmulas de cálculo en `calcMlH()` y `calcDosis()`. Son fórmulas farmacológicas verificadas.
- Los valores de `dosis_mg`, `dilucion_ml`, `dosisMin`, `softMax`, `hardMax` (y `dosisMax`, si se usara) y las dosis de `carga`/`puntual` en `farmacos.js`. Cualquier cambio requiere validación clínica.
- El comportamiento del botón ✕ (cerrarPanel): debe siempre limpiar `farmSeleccionado` y restaurar el estado vacío.
- La lógica `necesitaPeso` que determina qué tipos de cálculo requieren peso. No añadir nuevos `calcTipo` sin añadir sus casos en ambas funciones (`calcMlH` y `calcDosis`).

### Al añadir un nuevo fármaco

- Verificar que `calcTipo` corresponde a la unidad expresada en `unidad`.
- Calcular `concUgMl` o `concMgMl` como expresión matemática comentada, nunca como valor literal.
- El `dosisRange` (string) debe ser consistente con `dosisMin`/`softMax` (números); `hardMax` es el límite de «dosis tóxica».
- Subir `CACHE_NAME` en `sw.js` tras cualquier cambio en los archivos de la app.
- Insertar en orden alfabético en el array `farmacos`.
- Si se crea una nueva categoría, verificar que el icono tiene coherencia visual con el resto.

### Al modificar CSS

- Evitar `!important` nuevo. El CSS actual ya lo usa en varios sitios (p. ej. `.alerta-peligro/alto/bajo`, líneas ~613, ~733, ~871-873 y ~951-954 de `styles.css`); no se ha comprobado que haya un uso concreto en `#panel-overlay`.
- Las reglas de desktop van en el bloque base (sin media query). Las reglas móvil van dentro de `@media (max-width: 640px)`. Las de tablet, dentro de `@media (max-width: 900px)`.
- El panel (`#panel-detalle`) es `position: fixed` en todos los tamaños: en desktop entra con `translateX` y ocupa `calc(100vw - 310px)` (a la derecha de la lista); en móvil ocupa toda la pantalla bajo el header y entra con `translateY`. Cualquier cambio al panel debe respetar ambos contextos.

### Al modificar app.js

- `abrirPanel()` añade la clase `abierto` a `#panel-detalle` y `con-panel` a `.app-content`, y solo activa el overlay si `window.innerWidth <= 640`.
- `cerrarPanel()` siempre limpia: overlay, clase `abierto`, clase `con-panel`, `farmSeleccionado = null`, y re-renderiza la lista.
- **Antes de modificar la app, hacer una copia de seguridad** (sección 8).
- No cachear referencias DOM en variables globales. Acceder siempre con `getElementById`/`querySelector` en el momento de uso.
- `renderPanel()` siempre debe funcionar como un reset completo del panel UI para el fármaco y presentación actuales. No asumir estado previo.

---

## 8. Copias de seguridad locales

**Repositorio git** desde el 24/11/2026: remoto `origin` = `cjgaland/PerfusionesUCI` (público, publicado con GitHub Pages, rama `main`). El remoto `privado` = `cjgaland/perfusiones-uci` es un duplicado creado el mismo día. `Backup/` está en `.gitignore`. Cada vez que se haga commit + push, hacer también una copia en `Backup/` en el mismo paso. El Excel original y `.claude/settings.local.json` no se suben (el Excel contiene un correo y metadatos de autores).

- Carpeta `Backup/` en la raíz del proyecto. Cada copia es el proyecto completo en `Backup/Copia_Seguridad_Perfusiones_DD_MM_YYYY-HH_MM`.
- **Se conservan solo las 5 más recientes**: al crear una nueva se borra la más antigua.
- **OBLIGATORIO hacer una copia antes de modificar la app** (código, datos clínicos, CSS o este archivo).
- Comando:

```bash
bash /Users/Trabajo/.claude/skills/app-copia_seguridad/scripts/copia_seguridad.sh --root "/Users/Trabajo/Desktop/Utilidades Clínicas/Urgencias/Perfusiones" --name Perfusiones
```

- Primera copia creada el 24/11/2026 17:53 (`Copia_Seguridad_Perfusiones_24_11_2026-17_53`).
