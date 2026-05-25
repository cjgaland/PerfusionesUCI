# CLAUDE.md — Perfusiones UCI

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

---

## 2. Arquitectura

### Estructura de archivos

```
Perfusiones/
├── index.html      → Estructura HTML, único punto de entrada
├── styles.css      → Todo el CSS: variables, componentes, responsive
├── app.js          → Toda la lógica: estado, renderizado, cálculos
├── farmacos.js     → Base de datos de fármacos (datos puros, sin lógica)
└── CLAUDE.md       → Este archivo
```

### Relaciones entre archivos

```
index.html
  ├── <link> styles.css          (cargado en <head>)
  ├── <script> farmacos.js       (cargado antes de app.js)
  └── <script> app.js            (accede a `farmacos` y `categorias` globales)
```

`farmacos.js` expone dos variables globales:
- `farmacos` → array de objetos fármaco
- `categorias` → array de strings con categorías únicas ordenadas alfabéticamente

`app.js` consume ambas. No hay módulos ES, imports ni bundler. Todo es global.

### Estructura del DOM

```
<body>
  <header class="app-header">          ← fijo, z-index 100
  <div class="app-content">            ← fixed, grid 2 columnas
    <aside class="sidebar">            ← columna 1: lista y filtros
    <main class="main-area">           ← columna 2: contenido principal
      <div class="empty-state">        ← visible cuando no hay fármaco seleccionado
      <aside id="panel-detalle">       ← visible cuando hay fármaco seleccionado
  <div id="panel-overlay">             ← solo activo en móvil
```

### Estado global (app.js)

| Variable | Tipo | Descripción |
|---|---|---|
| `pesoActual` | `number \| null` | Peso del paciente en kg. `null` si no introducido |
| `farmSeleccionado` | `object \| null` | Objeto fármaco completo del array `farmacos` |
| `presIndex` | `number` | Índice de la presentación activa (0-based) |
| `modoCalculo` | `"dosis" \| "ml"` | Dirección del cálculo |
| `categoriaFiltro` | `string` | Categoría activa. `"Todos"` por defecto |

### Flujo de datos

```
Usuario selecciona fármaco
  → seleccionarFarmaco(f)
    → farmSeleccionado = f, presIndex = 0, modoCalculo = "dosis"
    → abrirPanel()          ← añade 'con-panel' a .main-area, overlay solo en móvil
    → renderPanel()         ← pinta toda la UI del panel con los datos del fármaco
      → precarga dosisMin en el input
      → setTimeout(() => calcular(), 0)   ← calcula automáticamente al abrir

Usuario pulsa "Calcular"
  → calcular()
    → lee valor del input
    → llama calcMlH() o calcDosis() según modoCalculo
    → mostrarResultado() o mostrarError()

Usuario pulsa "Cerrar" (✕)
  → cerrarPanel()
    → quita 'con-panel' de .main-area, quita overlay
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
  icono: "emoji",                       // un único emoji

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
      dosisMin: number,                  // límite inferior numérico para alerta
      dosisMax: number,                  // límite superior numérico para alerta

      unidad: string,                    // unidad que verá el usuario en el input
      calcTipo: string                   // determina la fórmula (ver tabla abajo)
    }
  ]
}
```

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

### Cómo añadir un nuevo fármaco

1. Añadir el objeto al array `farmacos` en `farmacos.js`, **en orden alfabético** respecto al campo `nombre`.
2. Calcular `concUgMl` o `concMgMl` inline como expresión matemática comentada (ej. `(10 * 1000) / 250  // 40 mcg/ml`). No poner el valor numérico fijo — mantener la expresión visible facilita la auditoría clínica.
3. Elegir el `calcTipo` correcto según la tabla anterior.
4. Si la categoría es nueva, aparecerá automáticamente en los filtros (se genera con `Set`).
5. Verificar `dosisMin` y `dosisMax` contra fichas técnicas o protocolos del servicio.

---

## 4. Sistema de variables CSS

### Organización

```css
:root { }           /* Modo oscuro (por defecto) */
:root.modo-claro { } /* Overrides para modo claro */
```

La clase `modo-claro` se añade al `<html>` desde JS. El modo se persiste en `localStorage` con la clave `"perfusiones-tema"`.

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
| `--header-h` | Altura del header (64px en desktop, `auto` en móvil) |
| `--sidebar-w` | Ancho sidebar (300px desktop, 240px tablet, 100% móvil) |
| `--panel-w` | Variable heredada; ya no determina el ancho del panel en desktop |
| `--radius` | Radio de borde estándar (10px) |
| `--radius-lg` | Radio de borde grande (16px, resultado) |
| `--font` | DM Sans (tipografía principal) |
| `--mono` | DM Mono (números, concentraciones, resultados) |

### Breakpoints

| Media query | Contexto |
|---|---|
| `> 640px` | Desktop/tablet: layout de 2 columnas, panel estático |
| `≤ 900px` | Tablet: sidebar más estrecha, panel más estrecho |
| `≤ 640px` | Móvil: layout vertical, lista horizontal, panel slide desde abajo |

---

## 5. Bugs conocidos y deudas técnicas

### Inconsistencias en datos (farmacos.js)

**B1 — Nimodipino: `dosisRange` no coincide con `dosisMin`/`dosisMax`**
```js
dosisRange: "0,5 mcg/kg/min",   // muestra un único punto de dosis
dosisMin: 0.25, dosisMax: 2,    // pero los límites programáticos son 0,25–2
```
El usuario ve en pantalla "0,5 mcg/kg/min" como rango, pero la alerta no dispara hasta que baja de 0,25 o sube de 2. Confuso clínicamente. Hay que alinear el string con los límites o viceversa.

**B2 — Amiodarona: misma inconsistencia**
```js
dosisRange: "10 mcg/kg/min",    // parece una dosis fija
dosisMin: 8, dosisMax: 12,      // pero los límites tienen holgura
```
Mejor mostrar `"8 – 12 mcg/kg/min"` para coherencia con el resto.

**B3 — Somatostatina y Valproico con `dosisMin === dosisMax`**
Cuando ambos valores son iguales, la condición `if (pres.dosisMin !== pres.dosisMax)` nunca dispara, por lo que nunca habrá alerta aunque el usuario introduzca un valor muy alejado. Para dosis fijas, considerar mostrar una alerta informativa si el valor difiere de la dosis estándar.

### Código (app.js)

**B4 — Variable `dosisBase` es código muerto**
```js
const dosisBase = necesitaPeso ? dosis : dosis; // ambas ramas son idénticas
```
Esta línea no hace nada útil. Eliminar.

**B5 — Shadowing de variable `inp` en `bindPeso()`**
```js
function bindPeso() {
  const inp = document.getElementById("peso-input");   // ← inp = campo de peso
  inp.addEventListener("input", () => {
    // ...
    const inp = document.getElementById("valor-input"); // ← inp redeclarado en el closure
```
Funciona por block scoping de `const`, pero es confuso. Renombrar la interior a `inpValor` o similar.

**B6 — `setTimeout(() => calcular(), 0)` en `renderPanel()`**
Se usa para que el DOM actualice el valor del input antes de calcular. Funciona, pero si el usuario cambia de fármaco muy rápidamente, pueden quedar timeouts huérfanos. Bajo impacto real, pero considerar `clearTimeout` con un ref.

**B7 — Transition de `transform` se pierde en móvil al cambiar tema**
La regla global de transición es:
```css
#panel-detalle { transition: background 0.25s, border-color 0.25s, color 0.25s; }
```
En móvil se sobreescribe a solo `transform`, perdiendo las transiciones de color. Usar `transition: transform 0.28s ..., background 0.25s, ...` en el bloque móvil.

**B8 — Sin persistencia de peso entre recargas**
El peso del paciente se pierde al recargar. En UCI es habitual trabajar durante horas con el mismo paciente. Considerar `localStorage` para persistir el peso.

---

## 6. Roadmap sugerido

Priorizado por impacto clínico en UCI. Las primeras son las más urgentes.

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

## 7. Instrucciones para Claude

### Principios generales

1. **La seguridad clínica es la restricción más importante.** Ante la duda entre una UI más elegante y una UI más clara/legible, elegir siempre la más clara. Los resultados numéricos (ml/h, dosis) deben ser siempre el elemento más prominente visualmente.

2. **No añadir lo que no se pide.** Si el usuario pide cambiar el color de un botón, no reorganizar el layout. Si pide un nuevo fármaco, no refactorizar el sistema de cálculo.

3. **Leer el archivo antes de editarlo.** Siempre. Nunca proponer cambios sin haber leído el contexto circundante.

### Qué preservar siempre

- **Separación `farmacos.js` / `app.js`**: Los datos clínicos van en `farmacos.js`, la lógica en `app.js`. No mezclar nunca.
- **Sin frameworks ni dependencias externas**: Este proyecto es HTML/CSS/JS puro. No añadir React, Vue, npm, bundlers ni librerías externas sin consultar explícitamente.
- **Sin módulos ES (`import`/`export`)**: Se sirve desde archivo directamente (sin servidor de desarrollo). Mantener todo como scripts globales.
- **El sistema de tokens CSS**: No hardcodear colores ni tamaños. Usar siempre variables CSS existentes. Si se necesita un nuevo valor, añadirlo como variable al `:root`.
- **Soporte modo claro/oscuro**: Todo elemento visual nuevo debe verse bien en ambos modos. Añadir overrides en `:root.modo-claro { }` si es necesario.
- **Responsive en los tres breakpoints**: Cualquier cambio de UI debe probarse mentalmente en desktop (>900px), tablet (640–900px) y móvil (<640px).
- **Decimal con coma**: Los números mostrados al usuario usan coma decimal (español). La función `formatNum()` lo gestiona. No cambiar este comportamiento ni usar `.toLocaleString()` sin asegurarse de que el locale es `es`.
- **Alertas no bloqueantes**: Las alertas de rango (`alerta-alto`, `alerta-bajo`) son informativas. Nunca impedir el cálculo ni requerir confirmación.

### Qué no tocar sin permiso explícito

- Las fórmulas de cálculo en `calcMlH()` y `calcDosis()`. Son fórmulas farmacológicas verificadas.
- Los valores de `dosis_mg`, `dilucion_ml`, `dosisMin`, `dosisMax` en `farmacos.js`. Cualquier cambio requiere validación clínica.
- El comportamiento del botón ✕ (cerrarPanel): debe siempre limpiar `farmSeleccionado` y restaurar el estado vacío.
- La lógica `necesitaPeso` que determina qué tipos de cálculo requieren peso. No añadir nuevos `calcTipo` sin añadir sus casos en ambas funciones (`calcMlH` y `calcDosis`).

### Al añadir un nuevo fármaco

- Verificar que `calcTipo` corresponde a la unidad expresada en `unidad`.
- Calcular `concUgMl` o `concMgMl` como expresión matemática comentada, nunca como valor literal.
- El `dosisRange` (string) debe ser consistente con `dosisMin`/`dosisMax` (números).
- Insertar en orden alfabético en el array `farmacos`.
- Si se crea una nueva categoría, verificar que el icono tiene coherencia visual con el resto.

### Al modificar CSS

- No usar `!important` salvo en el bloque desktop para `#panel-overlay` (ya existente y justificado).
- Las reglas de desktop van en el bloque base (sin media query). Las reglas móvil van dentro de `@media (max-width: 640px)`. Las de tablet, dentro de `@media (max-width: 900px)`.
- El panel (`#panel-detalle`) tiene comportamiento diferente en desktop (estático, `position: relative`) y móvil (`position: fixed`, `transform: translateY`). Cualquier cambio al panel debe respetar ambos contextos.

### Al modificar app.js

- `abrirPanel()` añade la clase `con-panel` a `.main-area` y solo activa el overlay si `window.innerWidth <= 640`.
- `cerrarPanel()` siempre limpia: clase `con-panel`, clase `abierto`, `farmSeleccionado = null`, y re-renderiza la lista.
- No cachear referencias DOM en variables globales. Acceder siempre con `getElementById`/`querySelector` en el momento de uso.
- `renderPanel()` siempre debe funcionar como un reset completo del panel UI para el fármaco y presentación actuales. No asumir estado previo.
