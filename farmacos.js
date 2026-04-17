// ============================================================
//  farmacos.js — Base de datos de perfusiones UCI
//  Fuente: PERFUSIONES_INTRAVENOSAS.xlsx
//  Cada fármaco puede tener una o varias presentaciones estándar.
//  unidad: "mcg/kg/min" | "mcg/kg/h" | "mcg/min" | "mg/h" | "mg/kg/h" | "mg/min" | "mcg/h"
//  tipo de cálculo:
//    "mcg_kg_min" → necesita peso
//    "mcg_kg_h"   → necesita peso
//    "mg_kg_h"    → necesita peso
//    "mcg_min"    → NO necesita peso
//    "mcg_h"      → NO necesita peso
//    "mg_h"       → NO necesita peso
//    "mg_min"     → NO necesita peso
// ============================================================

const farmacos = [
  {
    nombre: "ADRENALINA",
    categoria: "Vasoactivo",
    icono: "💉",
    presentaciones: [
      {
        label: "10 mg / 250 ml Dx5%",
        dosis_mg: 10, dilucion_ml: 250, suero: "Dx5%",
        concUgMl: (10 * 1000) / 250,          // 40 mcg/ml
        dosisRange: "0,05 – 2 mcg/kg/min",
        dosisMin: 0.05, dosisMax: 2,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      },
      {
        label: "10 mg / 50 ml Dx5% (concentrada)",
        dosis_mg: 10, dilucion_ml: 50, suero: "Dx5%",
        concUgMl: (10 * 1000) / 50,           // 200 mcg/ml
        dosisRange: "0,05 – 2 mcg/kg/min",
        dosisMin: 0.05, dosisMax: 2,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      },
      {
        label: "20 mg / 250 ml Dx5%",
        dosis_mg: 20, dilucion_ml: 250, suero: "Dx5%",
        concUgMl: (20 * 1000) / 250,          // 80 mcg/ml
        dosisRange: "0,05 – 2 mcg/kg/min",
        dosisMin: 0.05, dosisMax: 2,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ]
  },
  {
    nombre: "ALEUDRINA (Isoprenalina)",
    categoria: "Vasoactivo",
    icono: "🫀",
    presentaciones: [
      {
        label: "2 mg / 500 ml Dx5%",
        dosis_mg: 2, dilucion_ml: 500, suero: "Dx5%",
        concUgMl: (2 * 1000) / 500,           // 4 mcg/ml
        dosisRange: "1 – 20 mcg/min",
        dosisMin: 1, dosisMax: 20,
        unidad: "mcg/min", calcTipo: "mcg_min"
      }
    ]
  },
  {
    nombre: "AMIODARONA",
    categoria: "Antiarrítmico",
    icono: "⚡",
    presentaciones: [
      {
        label: "900 mg / 250 ml Dx5%",
        dosis_mg: 900, dilucion_ml: 250, suero: "Dx5%",
        concUgMl: (900 * 1000) / 250,         // 3600 mcg/ml
        dosisRange: "10 mcg/kg/min",
        dosisMin: 8, dosisMax: 12,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ]
  },
  {
    nombre: "CISATRACURIO",
    categoria: "Relajante muscular",
    icono: "🔒",
    presentaciones: [
      {
        label: "40 mg puro / 50 ml",
        dosis_mg: 40, dilucion_ml: 50, suero: "Puro",
        concUgMl: (40 * 1000) / 50,
        concMgMl: 40 / 50,                    // 0,8 mg/ml
        dosisRange: "0,06 – 0,18 mg/kg/h",
        dosisMin: 0.06, dosisMax: 0.18,
        unidad: "mg/kg/h", calcTipo: "mg_kg_h"
      },
      {
        label: "150 mg puro / 50 ml",
        dosis_mg: 150, dilucion_ml: 50, suero: "Puro",
        concUgMl: (150 * 1000) / 50,
        concMgMl: 150 / 50,                   // 3 mg/ml
        dosisRange: "0,06 – 0,18 mg/kg/h",
        dosisMin: 0.06, dosisMax: 0.18,
        unidad: "mg/kg/h", calcTipo: "mg_kg_h"
      }
    ]
  },
  {
    nombre: "CLONIDINA",
    categoria: "Sedoanalgesia",
    icono: "😴",
    presentaciones: [
      {
        label: "1,5 mg / 250 ml Dx5%",
        dosis_mg: 1.5, dilucion_ml: 250, suero: "Dx5%",
        concUgMl: (1.5 * 1000) / 250,         // 6 mcg/ml
        dosisRange: "1 – 3 mcg/kg/h",
        dosisMin: 1, dosisMax: 3,
        unidad: "mcg/kg/h", calcTipo: "mcg_kg_h"
      }
    ]
  },
  {
    nombre: "DEXMEDETOMIDINA",
    categoria: "Sedoanalgesia",
    icono: "😴",
    presentaciones: [
      {
        label: "0,4 mg / 100 ml SSF",
        dosis_mg: 0.4, dilucion_ml: 100, suero: "SSF",
        concUgMl: (0.4 * 1000) / 100,         // 4 mcg/ml
        dosisRange: "0,7 – 1,4 mcg/kg/h",
        dosisMin: 0.7, dosisMax: 1.4,
        unidad: "mcg/kg/h", calcTipo: "mcg_kg_h"
      },
      {
        label: "1 mg / 250 ml SSF",
        dosis_mg: 1, dilucion_ml: 250, suero: "SSF",
        concUgMl: (1 * 1000) / 250,           // 4 mcg/ml
        dosisRange: "0,7 – 1,4 mcg/kg/h",
        dosisMin: 0.7, dosisMax: 1.4,
        unidad: "mcg/kg/h", calcTipo: "mcg_kg_h"
      }
    ]
  },
  {
    nombre: "DOPAMINA",
    categoria: "Vasoactivo",
    icono: "🫀",
    presentaciones: [
      {
        label: "400 mg / 250 ml Dx5%",
        dosis_mg: 400, dilucion_ml: 250, suero: "Dx5%",
        concUgMl: (400 * 1000) / 250,         // 1600 mcg/ml
        dosisRange: "1 – 50 mcg/kg/min",
        dosisMin: 1, dosisMax: 50,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ]
  },
  {
    nombre: "DOBUTAMINA",
    categoria: "Vasoactivo",
    icono: "🫀",
    presentaciones: [
      {
        label: "250 mg / 250 ml Dx5%",
        dosis_mg: 250, dilucion_ml: 250, suero: "Dx5%",
        concUgMl: (250 * 1000) / 250,         // 1000 mcg/ml
        dosisRange: "2,5 – 40 mcg/kg/min",
        dosisMin: 2.5, dosisMax: 40,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ]
  },
  {
    nombre: "FENTANILO",
    categoria: "Sedoanalgesia",
    icono: "😴",
    presentaciones: [
      {
        label: "1,5 mg / 50 ml SSF",
        dosis_mg: 1.5, dilucion_ml: 50, suero: "SSF",
        concUgMl: (1.5 * 1000) / 50,          // 30 mcg/ml
        dosisRange: "0,5 – 10 mcg/kg/h",
        dosisMin: 0.5, dosisMax: 10,
        unidad: "mcg/kg/h", calcTipo: "mcg_kg_h"
      }
    ]
  },
  {
    nombre: "FLUMAZENILO",
    categoria: "Antídotos",
    icono: "🔄",
    presentaciones: [
      {
        label: "2,5 mg / 250 ml Dx5%",
        dosis_mg: 2.5, dilucion_ml: 250, suero: "Dx5%",
        concMgMl: 2.5 / 250,                  // 0,01 mg/ml
        dosisRange: "0,1 – 0,4 mg/h",
        dosisMin: 0.1, dosisMax: 0.4,
        unidad: "mg/h", calcTipo: "mg_h"
      }
    ]
  },
  {
    nombre: "FUROSEMIDA",
    categoria: "Diuréticos",
    icono: "💧",
    presentaciones: [
      {
        label: "100 mg / 100 ml Dx5%",
        dosis_mg: 100, dilucion_ml: 100, suero: "Dx5%",
        concMgMl: 100 / 100,                  // 1 mg/ml
        dosisRange: "5 – 30 mg/h",
        dosisMin: 5, dosisMax: 30,
        unidad: "mg/h", calcTipo: "mg_h"
      }
    ]
  },
  {
    nombre: "LABETALOL",
    categoria: "Antihipertensivo",
    icono: "📉",
    presentaciones: [
      {
        label: "200 mg / 250 ml Dx5%",
        dosis_mg: 200, dilucion_ml: 250, suero: "Dx5%",
        concMgMl: 200 / 250,                  // 0,8 mg/ml
        dosisRange: "10 – 100 mg/h",
        dosisMin: 10, dosisMax: 100,
        unidad: "mg/h", calcTipo: "mg_h"
      }
    ]
  },
  {
    nombre: "LEVOSIMENDAN",
    categoria: "Vasoactivo",
    icono: "🫀",
    presentaciones: [
      {
        label: "12,5 mg / 250 ml Dx5%",
        dosis_mg: 12.5, dilucion_ml: 250, suero: "Dx5%",
        concUgMl: (12.5 * 1000) / 250,        // 50 mcg/ml
        dosisRange: "0,05 – 0,2 mcg/kg/min",
        dosisMin: 0.05, dosisMax: 0.2,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ]
  },
  {
    nombre: "MAGNESIO (SULFATO)",
    categoria: "Electrolitos / Antiarrítmico",
    icono: "⚡",
    presentaciones: [
      {
        label: "4500 mg / 250 ml SSF",
        dosis_mg: 4500, dilucion_ml: 250, suero: "SSF",
        concMgMl: 4500 / 250,                 // 18 mg/ml
        dosisRange: "2 – 4 mg/min",
        dosisMin: 2, dosisMax: 4,
        unidad: "mg/min", calcTipo: "mg_min"
      }
    ]
  },
  {
    nombre: "MIDAZOLAM",
    categoria: "Sedoanalgesia",
    icono: "😴",
    presentaciones: [
      {
        label: "250 mg puro / 50 ml",
        dosis_mg: 250, dilucion_ml: 50, suero: "Puro",
        concMgMl: 250 / 50,                   // 5 mg/ml
        dosisRange: "0,02 – 0,2 mg/kg/h",
        dosisMin: 0.02, dosisMax: 0.2,
        unidad: "mg/kg/h", calcTipo: "mg_kg_h"
      }
    ]
  },
  {
    nombre: "MILRINONA",
    categoria: "Vasoactivo",
    icono: "🫀",
    presentaciones: [
      {
        label: "30 mg / 250 ml SSF",
        dosis_mg: 30, dilucion_ml: 250, suero: "SSF",
        concUgMl: (30 * 1000) / 250,          // 120 mcg/ml
        dosisRange: "0,375 – 0,75 mcg/kg/min",
        dosisMin: 0.375, dosisMax: 0.75,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ]
  },
  {
    nombre: "MORFINA",
    categoria: "Sedoanalgesia",
    icono: "😴",
    presentaciones: [
      {
        label: "50 mg / 50 ml SSF",
        dosis_mg: 50, dilucion_ml: 50, suero: "SSF",
        concMgMl: 50 / 50,                    // 1 mg/ml
        dosisRange: "2 – 20 mg/h",
        dosisMin: 2, dosisMax: 20,
        unidad: "mg/h", calcTipo: "mg_h"
      }
    ]
  },
  {
    nombre: "NALOXONA",
    categoria: "Antídotos",
    icono: "🔄",
    presentaciones: [
      {
        label: "4 mg / 250 ml SSF",
        dosis_mg: 4, dilucion_ml: 250, suero: "SSF",
        concUgMl: (4 * 1000) / 250,           // 16 mcg/ml
        dosisRange: "5 – 15 mcg/kg/h",
        dosisMin: 5, dosisMax: 15,
        unidad: "mcg/kg/h", calcTipo: "mcg_kg_h"
      }
    ]
  },
  {
    nombre: "NIMODIPINO",
    categoria: "Neuroprotección",
    icono: "🧠",
    presentaciones: [
      {
        label: "10 mg puro / 50 ml",
        dosis_mg: 10, dilucion_ml: 50, suero: "Puro",
        concUgMl: (10 * 1000) / 50,           // 200 mcg/ml
        dosisRange: "0,5 mcg/kg/min",
        dosisMin: 0.25, dosisMax: 2,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ]
  },
  {
    nombre: "NITROGLICERINA",
    categoria: "Antihipertensivo / Coronario",
    icono: "❤️",
    presentaciones: [
      {
        label: "50 mg / 500 ml Dx5%",
        dosis_mg: 50, dilucion_ml: 500, suero: "Dx5%",
        concUgMl: (50 * 1000) / 500,          // 100 mcg/ml
        dosisRange: "5 – 200 mcg/min",
        dosisMin: 5, dosisMax: 200,
        unidad: "mcg/min", calcTipo: "mcg_min"
      }
    ]
  },
  {
    nombre: "NORADRENALINA",
    categoria: "Vasoactivo",
    icono: "💉",
    presentaciones: [
      {
        label: "10 mg / 250 ml Dx5%",
        dosis_mg: 10, dilucion_ml: 250, suero: "Dx5%",
        concUgMl: (10 * 1000) / 250,          // 40 mcg/ml
        dosisRange: "0,01 – 3 mcg/kg/min",
        dosisMin: 0.01, dosisMax: 3,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      },
      {
        label: "40 mg / 50 ml Dx5% (concentrada)",
        dosis_mg: 40, dilucion_ml: 50, suero: "Dx5%",
        concUgMl: (40 * 1000) / 50,           // 800 mcg/ml
        dosisRange: "0,01 – 3 mcg/kg/min",
        dosisMin: 0.01, dosisMax: 3,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      },
      {
        label: "40 mg / 250 ml Dx5%",
        dosis_mg: 40, dilucion_ml: 250, suero: "Dx5%",
        concUgMl: (40 * 1000) / 250,          // 160 mcg/ml
        dosisRange: "0,01 – 3 mcg/kg/min",
        dosisMin: 0.01, dosisMax: 3,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ]
  },
  {
    nombre: "PROPOFOL",
    categoria: "Sedoanalgesia",
    icono: "😴",
    presentaciones: [
      {
        label: "1000 mg puro / 100 ml",
        dosis_mg: 1000, dilucion_ml: 100, suero: "Puro",
        concMgMl: 1000 / 100,                 // 10 mg/ml
        dosisRange: "0,5 – 5 mg/kg/h",
        dosisMin: 0.5, dosisMax: 5,
        unidad: "mg/kg/h", calcTipo: "mg_kg_h"
      }
    ]
  },
  {
    nombre: "ROCURONIO",
    categoria: "Relajante muscular",
    icono: "🔒",
    presentaciones: [
      {
        label: "500 mg puro / 50 ml",
        dosis_mg: 500, dilucion_ml: 50, suero: "Puro",
        concMgMl: 500 / 50,                   // 10 mg/ml
        dosisRange: "0,3 – 0,6 mg/kg/h",
        dosisMin: 0.3, dosisMax: 0.6,
        unidad: "mg/kg/h", calcTipo: "mg_kg_h"
      }
    ]
  },
  {
    nombre: "SOMATOSTATINA",
    categoria: "Digestivo / Hemostasia",
    icono: "🔴",
    presentaciones: [
      {
        label: "3 mg / 250 ml SSF",
        dosis_mg: 3, dilucion_ml: 250, suero: "SSF",
        concUgMl: (3 * 1000) / 250,           // 12 mcg/ml
        dosisRange: "3,5 mcg/kg/h",
        dosisMin: 3.5, dosisMax: 3.5,
        unidad: "mcg/kg/h", calcTipo: "mcg_kg_h"
      }
    ]
  },
  {
    nombre: "URAPIDILO",
    categoria: "Antihipertensivo",
    icono: "📉",
    presentaciones: [
      {
        label: "250 mg puro / 50 ml",
        dosis_mg: 250, dilucion_ml: 50, suero: "Puro",
        concUgMl: (250 * 1000) / 50,          // 5000 mcg/ml
        dosisRange: "2,5 – 7 mcg/kg/min",
        dosisMin: 2.5, dosisMax: 7,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ]
  },
  {
    nombre: "VALPROICO (Ácido)",
    categoria: "Neurológico",
    icono: "🧠",
    presentaciones: [
      {
        label: "1600 mg / 500 ml Dx5%",
        dosis_mg: 1600, dilucion_ml: 500, suero: "Dx5%",
        concMgMl: 1600 / 500,                 // 3,2 mg/ml
        dosisRange: "1 mg/kg/h",
        dosisMin: 1, dosisMax: 1,
        unidad: "mg/kg/h", calcTipo: "mg_kg_h"
      }
    ]
  }
];

// Categorías únicas para filtrado
const categorias = [...new Set(farmacos.map(f => f.categoria))].sort();
