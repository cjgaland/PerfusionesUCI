// ============================================================
//  farmacos.js — Base de datos de perfusiones UCI
//  V3 — Incluye modos de administración e información clínica
// ============================================================

const ISO_COLORS = {
  vasoactivo:      "var(--iso-violet)",
  sedoanalgesia:   "var(--iso-yellow)",
  opiaceo:         "var(--iso-blue)",
  relajante:       "var(--iso-red)",
  antihipertensivo:"var(--iso-green)",
  antiarritmico:   "var(--iso-orange)",
  neutral:         "var(--iso-neutral)"
};

const farmacos = [
  // ── A ─────────────────────────────────────────────────────
  {
    nombre: "ACETILCISTEÍNA",
    categoria: "Antídotos",
    isoColor: ISO_COLORS.neutral,
    icono: "🔄",
    modos: ["carga_mantenimiento"],
    carga: {
      descripcion: "Fase 1 — Dosis de carga (intoxicación paracetamol)",
      dosis_mg_kg: 150,
      tiempo_min: 60,
      via: "IV en 60 min en 200 ml SG5% (vía separada)",
      nota: "Protocolo 3 fases: 150 mg/kg/1h → 50 mg/kg/4h → 100 mg/kg/16h. Ajustar volumen en niños o < 40 kg"
    },
    info: {
      indicaciones: [
        "Intoxicación por paracetamol — antídoto específico (protocolo 3 fases IV)",
        "Hepatotoxicidad por paracetamol incluso tardía (> 8 h) si hay riesgo elevado por nomograma",
        "Mucólisis en insuficiencia respiratoria (uso nebulizado o oral, no IV)"
      ],
      contraindicaciones: [
        "Hipersensibilidad conocida a acetilcisteína (reacciones anafilactoides posibles, especialmente con la carga rápida)",
        "Asma activo severo (broncoespasmo con nebulización — no aplica a IV)"
      ],
      precauciones: [
        "Reacciones anafilactoides en un 10-20%: urticaria, broncoespasmo, hipotensión — durante o tras la carga",
        "Interrumpir la infusión si aparece reacción, tratar y reiniciar a menor velocidad",
        "Vigilar glucemia e ionograma durante la infusión en pacientes con fallo hepático",
        "No mezclar con otros fármacos en la misma vía — riesgo de precipitación"
      ]
    },
    presentaciones: [
      {
        label: "10000 mg / 500 ml SSF",
        dosis_mg: 10000, dilucion_ml: 500, suero: "SSF",
        concMgMl: 10000 / 500,                 // 20 mg/ml (fases 2 y 3; concentración orientativa)
        dosisRange: "6 – 12,5 mg/kg/h",
        dosisMin: 6, softMax: 12.5, hardMax: 15,
        unidad: "mg/kg/h", calcTipo: "mg_kg_h"
      }
    ]
  },

  {
    nombre: "ADRENALINA",
    categoria: "Vasoactivo",
    isoColor: ISO_COLORS.vasoactivo,
    icono: "💉",
    modos: ["perfusion", "puntual"],
    puntual: {
      descripcion: "Parada cardiorrespiratoria / Anafilaxia",
      dosis_fija_mg: 1,
      via: "IV en bolo cada 3-5 min (PCR)",
      nota: "Anafilaxia grave: 0,5 mg IM en cara anterolateral del muslo"
    },
    info: {
      indicaciones: [
        "Shock séptico y distributivo refractario a fluidos y noradrenalina",
        "Parada cardiorrespiratoria (FV/TVSP/AESP/asistolia)",
        "Anafilaxia grave con compromiso hemodinámico o respiratorio"
      ],
      contraindicaciones: [
        "Hipovolemia no corregida (iniciar reposición simultánea)",
        "Taquiarritmias ventriculares graves no relacionadas con PCR (relativa)",
        "Feocromocitoma (relativa)"
      ],
      precauciones: [
        "Vía central obligatoria en perfusión continua (necrosis grave por extravasación)",
        "Monitorización invasiva de PA y ECG continuo — riesgo de taquiarritmias e isquemia",
        "A dosis altas: vasoconstricción mesentérica e isquemia periférica"
      ]
    },
    presentaciones: [
      {
        label: "10 mg / 250 ml Dx5%",
        dosis_mg: 10, dilucion_ml: 250, suero: "Dx5%",
        concUgMl: (10 * 1000) / 250,          // 40 mcg/ml
        dosisRange: "0,05 – 2 mcg/kg/min",
        dosisMin: 0.05, softMax: 2, hardMax: 3,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      },
      {
        label: "10 mg / 50 ml Dx5% (concentrada)",
        dosis_mg: 10, dilucion_ml: 50, suero: "Dx5%",
        concUgMl: (10 * 1000) / 50,           // 200 mcg/ml
        dosisRange: "0,05 – 2 mcg/kg/min",
        dosisMin: 0.05, softMax: 2, hardMax: 3,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      },
      {
        label: "20 mg / 250 ml Dx5%",
        dosis_mg: 20, dilucion_ml: 250, suero: "Dx5%",
        concUgMl: (20 * 1000) / 250,          // 80 mcg/ml
        dosisRange: "0,05 – 2 mcg/kg/min",
        dosisMin: 0.05, softMax: 2, hardMax: 3,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ]
  },

  {
    nombre: "ALEUDRINA (Isoprenalina)",
    categoria: "Vasoactivo",
    isoColor: ISO_COLORS.vasoactivo,
    icono: "🫀",
    modos: ["perfusion"],
    info: {
      indicaciones: [
        "Bloqueo AV completo sintomático como puente a marcapasos definitivo",
        "Bradicardia refractaria a atropina sin respuesta a otras medidas"
      ],
      contraindicaciones: [
        "Taquiarritmias ventriculares o supraventriculares",
        "Cardiopatía isquémica activa severa",
        "Feocromocitoma"
      ],
      precauciones: [
        "Monitorización ECG continua — alto riesgo de FV y otras arritmias graves",
        "Usar solo como medida puente hasta marcapasos temporal o definitivo",
        "Puede agravar isquemia miocárdica por aumento del consumo de O₂"
      ]
    },
    presentaciones: [
      {
        label: "2 mg / 500 ml Dx5%",
        dosis_mg: 2, dilucion_ml: 500, suero: "Dx5%",
        concUgMl: (2 * 1000) / 500,           // 4 mcg/ml
        dosisRange: "1 – 20 mcg/min",
        dosisMin: 1, softMax: 20, hardMax: 30,
        unidad: "mcg/min", calcTipo: "mcg_min"
      }
    ]
  },

  {
    nombre: "AMIODARONA",
    categoria: "Antiarrítmico",
    isoColor: ISO_COLORS.antiarritmico,
    icono: "⚡",
    modos: ["perfusion", "carga_mantenimiento", "puntual"],
    carga: {
      descripcion: "Carga IV electiva para control de ritmo",
      dosis_mg_kg: 5,
      tiempo_min: 60,
      via: "IV en 20-60 min preferiblemente por vía central",
      nota: "Alternativa dosis fija: 300 mg en 60 min. Diluir siempre en SG5%"
    },
    puntual: {
      descripcion: "Parada cardíaca (FV / TV sin pulso)",
      dosis_fija_mg: 300,
      via: "IV en bolo rápido (diluido en 20 ml SG5%)",
      nota: "Segunda dosis si persiste FV/TVSP: 150 mg. No mezclar con SSF"
    },
    info: {
      indicaciones: [
        "Taquicardia ventricular (TV) y fibrilación ventricular (FV) — primera línea antiarrítmica en PCR",
        "Fibrilación auricular / flutter con respuesta ventricular rápida en paciente hemodinámicamente comprometido",
        "Mantenimiento de ritmo sinusal tras cardioversión en FA persistente"
      ],
      contraindicaciones: [
        "Bloqueo AV 2.º-3.er grado o disfunción sinusal sin marcapasos implantado",
        "Alergia conocida al yodo o a la amiodarona",
        "QTc > 500 ms en ausencia de PCR",
        "Disfunción tiroidea grave (tirotoxicosis activa)"
      ],
      precauciones: [
        "Riesgo de flebitis severa en vía periférica — usar vía central siempre que sea posible",
        "Hipotensión durante la carga IV (puede requerir soporte vasopresor transitorio)",
        "Monitorizar QTc, TSH/T4, transaminasas y Rx de tórax durante uso prolongado",
        "Múltiples interacciones: potencia anticoagulantes orales (warfarina), digoxina y estatinas"
      ]
    },
    presentaciones: [
      {
        label: "900 mg / 250 ml Dx5%",
        dosis_mg: 900, dilucion_ml: 250, suero: "Dx5%",
        concUgMl: (900 * 1000) / 250,         // 3600 mcg/ml
        dosisRange: "8 – 12 mcg/kg/min",
        dosisMin: 8, softMax: 12, hardMax: 15,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ]
  },

  // ── C ─────────────────────────────────────────────────────
  {
    nombre: "CISATRACURIO",
    categoria: "Relajante muscular",
    isoColor: ISO_COLORS.relajante,
    icono: "🔒",
    modos: ["carga_mantenimiento"],
    carga: {
      descripcion: "Dosis de intubación (bolo IV)",
      dosis_mg_kg: 0.15,
      via: "IV en bolo rápido",
      nota: "Inicio de efecto: 2-3 min. Duración: 40-75 min. Para ISR preferir rocuronio"
    },
    info: {
      indicaciones: [
        "Relajación muscular durante ventilación mecánica en UCI",
        "Intubación orotraqueal cuando se prefiere un relajante no despolarizante de inicio más lento",
        "SDRA grave: bloqueo neuromuscular continuo en primeras 48h (discutido)"
      ],
      contraindicaciones: [
        "Administrar solo con vía aérea asegurada (excepto durante la intubación)",
        "Hipersensibilidad conocida a cisatracurio o atracurio"
      ],
      precauciones: [
        "No tiene efecto analgésico ni sedante — combinar siempre con sedoanalgesia adecuada",
        "Monitorizar grado de bloqueo con train-of-four (TOF) para evitar sobredosificación",
        "Eliminación de Hofmann: no requiere ajuste en insuficiencia renal ni hepática",
        "Antídoto parcial: neostigmina + atropina (solo cuando se recupere T1 ≥ 10%)"
      ]
    },
    presentaciones: [
      {
        label: "40 mg puro / 50 ml",
        dosis_mg: 40, dilucion_ml: 50, suero: "Puro",
        concUgMl: (40 * 1000) / 50,
        concMgMl: 40 / 50,                    // 0,8 mg/ml
        dosisRange: "0,06 – 0,18 mg/kg/h",
        dosisMin: 0.06, softMax: 0.18, hardMax: 0.3,
        unidad: "mg/kg/h", calcTipo: "mg_kg_h"
      },
      {
        label: "150 mg puro / 50 ml",
        dosis_mg: 150, dilucion_ml: 50, suero: "Puro",
        concUgMl: (150 * 1000) / 50,
        concMgMl: 150 / 50,                   // 3 mg/ml
        dosisRange: "0,06 – 0,18 mg/kg/h",
        dosisMin: 0.06, softMax: 0.18, hardMax: 0.3,
        unidad: "mg/kg/h", calcTipo: "mg_kg_h"
      }
    ]
  },

  {
    nombre: "CLONIDINA",
    categoria: "Sedoanalgesia",
    isoColor: ISO_COLORS.sedoanalgesia,
    icono: "😴",
    modos: ["perfusion"],
    info: {
      indicaciones: [
        "Sedación coadyuvante en UCI (permite reducir dosis de benzodiacepinas y opioides)",
        "Síndrome de abstinencia a alcohol u opioides en UCI",
        "Control de la hipertensión arterial en UCI cuando otros fármacos no son adecuados"
      ],
      contraindicaciones: [
        "Bradicardia sintomática o bloqueo AV 2.º-3.er grado",
        "Hipotensión severa (PAM < 65 mmHg) no controlada",
        "Hipersensibilidad conocida"
      ],
      precauciones: [
        "No suspender bruscamente — riesgo de síndrome de rebote hipertensivo grave",
        "Bradicardia e hipotensión frecuentes — monitorización hemodinámica continua",
        "Potencia el efecto de otros sedantes y opioides (reducir dosis si se combina)"
      ]
    },
    presentaciones: [
      {
        label: "1,5 mg / 250 ml Dx5%",
        dosis_mg: 1.5, dilucion_ml: 250, suero: "Dx5%",
        concUgMl: (1.5 * 1000) / 250,         // 6 mcg/ml
        dosisRange: "1 – 3 mcg/kg/h",
        dosisMin: 1, softMax: 3, hardMax: 5,
        unidad: "mcg/kg/h", calcTipo: "mcg_kg_h"
      }
    ]
  },

  {
    nombre: "CLORURO CÁLCICO",
    categoria: "Electrolitos",
    isoColor: ISO_COLORS.neutral,
    icono: "⚗️",
    modos: ["puntual", "perfusion"],
    puntual: {
      descripcion: "Bolo IV (hipocalcemia severa / hiperpotasemia / toxicidad por BCC)",
      dosis_fija_mg: 1000,
      via: "IV lento en 5-10 min por vía central",
      nota: "1g (10 ml de CaCl₂ al 10%) IV lento. Repetir cada 10 min si precisa. Preferir vía central (irritante)"
    },
    info: {
      indicaciones: [
        "Hipocalcemia sintomática grave (tetania, convulsiones, QT largo, hipotensión)",
        "Hiperpotasemia severa con cambios ECG — estabilización de membrana cardíaca (acción inmediata)",
        "Intoxicación por antagonistas del calcio o betabloqueantes (dosis altas)"
      ],
      contraindicaciones: [
        "Hipercalcemia",
        "Intoxicación digitálica activa — potencia la toxicidad",
        "Arritmias ventriculares no relacionadas con hipocalcemia o hiperpotasemia"
      ],
      precauciones: [
        "Vía central obligatoria para perfusión continua — necrosis tisular grave en extravasación",
        "Administración IV rápida puede causar bradicardia, vasodilatación e hipotensión",
        "No mezclar con bicarbonato sódico ni fosfatos en la misma vía (precipita)",
        "Monitorizar calcemia cada 4-6 h durante la corrección"
      ]
    },
    presentaciones: [
      {
        label: "10000 mg / 500 ml SSF",
        dosis_mg: 10000, dilucion_ml: 500, suero: "SSF",
        concMgMl: 10000 / 500,                // 20 mg/ml
        dosisRange: "200 – 1000 mg/h",
        dosisMin: 200, softMax: 1000, hardMax: 1500,
        unidad: "mg/h", calcTipo: "mg_h"
      }
    ]
  },

  // ── D ─────────────────────────────────────────────────────
  {
    nombre: "DEXMEDETOMIDINA",
    categoria: "Sedoanalgesia",
    isoColor: ISO_COLORS.sedoanalgesia,
    icono: "😴",
    modos: ["perfusion", "carga_mantenimiento"],
    carga: {
      descripcion: "Dosis de carga (opcional — omitir si hipotensión o bradicardia)",
      dosis_mcg_kg: 1,
      tiempo_min: 10,
      via: "IV en 10 min",
      nota: "La carga produce bradicardia e hipotensión frecuentes. Muchos protocolos la omiten en UCI"
    },
    info: {
      indicaciones: [
        "Sedación ligera-moderada en UCI con objetivo de paciente comunicativo (RASS 0 a -2)",
        "Facilitación del destete de la ventilación mecánica — preserva la capacidad de cooperación",
        "Reducción del delirium en UCI (evidencia creciente frente a benzodiacepinas)"
      ],
      contraindicaciones: [
        "Bloqueo AV 2.º-3.er grado sin marcapasos implantado",
        "Bradicardia severa (FC < 50 lpm) o hipotensión grave no controlada"
      ],
      precauciones: [
        "Bradicardia e hipotensión frecuentes — monitorización invasiva de PA recomendada durante la carga",
        "No utilizar como único sedante para sedación profunda en VMI (insuficiente para bloquear respuesta a intubación)",
        "Acumulación en insuficiencia hepática grave — considerar reducción de dosis",
        "No suspender bruscamente (síndrome de retirada similar a clonidina)"
      ]
    },
    presentaciones: [
      {
        label: "0,4 mg / 100 ml SSF",
        dosis_mg: 0.4, dilucion_ml: 100, suero: "SSF",
        concUgMl: (0.4 * 1000) / 100,         // 4 mcg/ml
        dosisRange: "0,2 – 1,4 mcg/kg/h",
        dosisMin: 0.2, softMax: 1.4, hardMax: 2.0,
        unidad: "mcg/kg/h", calcTipo: "mcg_kg_h"
      },
      {
        label: "1 mg / 250 ml SSF",
        dosis_mg: 1, dilucion_ml: 250, suero: "SSF",
        concUgMl: (1 * 1000) / 250,           // 4 mcg/ml
        dosisRange: "0,2 – 1,4 mcg/kg/h",
        dosisMin: 0.2, softMax: 1.4, hardMax: 2.0,
        unidad: "mcg/kg/h", calcTipo: "mcg_kg_h"
      }
    ]
  },

  {
    nombre: "DILTIAZEM",
    categoria: "Antiarrítmico",
    isoColor: ISO_COLORS.antiarritmico,
    icono: "⚡",
    modos: ["puntual", "perfusion"],
    puntual: {
      descripcion: "Control de ritmo en FA / flutter (bolo IV)",
      dosis_mg_kg: 0.25,
      via: "IV en 2 min — segunda dosis 0,35 mg/kg a los 15 min si precisa",
      nota: "Dosis habitual: 15-25 mg IV. Iniciar perfusión continua si respuesta favorable"
    },
    info: {
      indicaciones: [
        "Fibrilación auricular y flutter auricular con respuesta ventricular rápida — control de frecuencia",
        "Taquicardia supraventricular paroxística (TSVP) refractaria a maniobras vagales y adenosina",
        "Angina vasoespástica (vasodilatador coronario)"
      ],
      contraindicaciones: [
        "Síndrome de WPW con FA (puede acelerar conducción accesoria)",
        "Bloqueo AV 2.º-3.er grado sin marcapasos",
        "Disfunción sistólica severa (FEVI < 30%) — efecto inotrópico negativo",
        "Hipotensión severa (PAS < 90 mmHg)"
      ],
      precauciones: [
        "Bradicardia e hipotensión — monitorización ECG y PA continua",
        "No combinar con betabloqueantes IV (bloqueo AV aditivo)",
        "Reducir dosis en insuficiencia hepática (metabolismo hepático extenso)",
        "Interacciona con ciclosporina, digoxina y estatinas (aumenta sus niveles)"
      ]
    },
    presentaciones: [
      {
        label: "100 mg / 250 ml SSF",
        dosis_mg: 100, dilucion_ml: 250, suero: "SSF",
        concMgMl: 100 / 250,                  // 0,4 mg/ml
        dosisRange: "5 – 15 mg/h",
        dosisMin: 5, softMax: 15, hardMax: 20,
        unidad: "mg/h", calcTipo: "mg_h"
      }
    ]
  },

  {
    nombre: "DOBUTAMINA",
    categoria: "Vasoactivo",
    isoColor: ISO_COLORS.vasoactivo,
    icono: "🫀",
    modos: ["perfusion"],
    info: {
      indicaciones: [
        "Shock cardiogénico con bajo gasto cardíaco e hipoperfusión tisular",
        "Fallo cardíaco agudo descompensado con signos de bajo gasto (inotrópico)",
        "Combinación con noradrenalina en shock con disfunción miocárdica"
      ],
      contraindicaciones: [
        "Miocardiopatía hipertrófica obstructiva (MCHO) — empeora la obstrucción dinámica",
        "Estenosis aórtica severa hemodinámicamente significativa",
        "Taquiarritmias ventriculares activas"
      ],
      precauciones: [
        "Puede inducir o agravar taquicardia sinusal e isquemia miocárdica",
        "Monitorización invasiva de PA y gasto cardíaco obligatoria",
        "Tolerancia hemodinámica puede desarrollarse en uso prolongado (> 72 h)",
        "Puede aumentar la mortalidad en pacientes con IC crónica descompensada (usar con cautela)"
      ]
    },
    presentaciones: [
      {
        label: "250 mg / 250 ml Dx5%",
        dosis_mg: 250, dilucion_ml: 250, suero: "Dx5%",
        concUgMl: (250 * 1000) / 250,         // 1000 mcg/ml
        dosisRange: "2,5 – 40 mcg/kg/min",
        dosisMin: 2.5, softMax: 40, hardMax: 50,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ]
  },

  {
    nombre: "DOPAMINA",
    categoria: "Vasoactivo",
    isoColor: ISO_COLORS.vasoactivo,
    icono: "🫀",
    modos: ["perfusion"],
    info: {
      indicaciones: [
        "Shock con bradicardia que requiere soporte tanto inotrópico como cronotrópico",
        "Soporte vasopresor alternativo cuando la noradrenalina no está disponible"
      ],
      contraindicaciones: [
        "Feocromocitoma (crisis hipertensiva grave)",
        "Taquiarritmias ventriculares activas",
        "Fibrilación auricular con respuesta ventricular rápida"
      ],
      precauciones: [
        "Efectos dosis-dependientes: 1-3 mcg/kg/min (dopaminérgico), 3-10 (betaadrenérgico), > 10 (alfaadrenérgico)",
        "Vía central obligatoria — necrosis tisular grave por extravasación",
        "En sepsis, la noradrenalina ha demostrado menor mortalidad — evitar dopamina como primera línea",
        "Monitorización ECG e invasiva de PA"
      ]
    },
    presentaciones: [
      {
        label: "400 mg / 250 ml Dx5%",
        dosis_mg: 400, dilucion_ml: 250, suero: "Dx5%",
        concUgMl: (400 * 1000) / 250,         // 1600 mcg/ml
        dosisRange: "1 – 50 mcg/kg/min",
        dosisMin: 1, softMax: 50, hardMax: 60,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ]
  },

  // ── E ─────────────────────────────────────────────────────
  {
    nombre: "ESMOLOL",
    categoria: "Antiarrítmico",
    isoColor: ISO_COLORS.antiarritmico,
    icono: "⚡",
    modos: ["carga_mantenimiento", "puntual"],
    carga: {
      descripcion: "Bolo IV de carga",
      dosis_mcg_kg: 500,
      tiempo_min: 1,
      via: "IV en 1 min",
      nota: "500 mcg/kg en 1 min. Iniciar perfusión de mantenimiento tras el bolo. Puede repetirse si precisa"
    },
    puntual: {
      descripcion: "Bolo IV urgente (taquicardia / crisis hipertensiva)",
      dosis_mcg_kg: 500,
      via: "IV en 1 min — repetir cada 5 min si precisa",
      nota: "Vida media muy corta (9 min) — titular por efecto"
    },
    info: {
      indicaciones: [
        "Fibrilación auricular y flutter con respuesta ventricular rápida — control agudo de frecuencia",
        "Taquicardia supraventricular perioperatoria",
        "Crisis hipertensiva con taquicardia (disección aórtica, perioperatorio)",
        "Taquicardia sinusal inapropiada con repercusión hemodinámica"
      ],
      contraindicaciones: [
        "Bloqueo AV 2.º-3.er grado sin marcapasos",
        "Bradicardia sintomática (FC < 60 lpm)",
        "Asma activo o broncoespasmo severo",
        "Shock cardiogénico o insuficiencia cardíaca descompensada"
      ],
      precauciones: [
        "Bradicardia e hipotensión frecuentes — monitorización continua de PA y ECG",
        "Vida media muy corta (9 min): el efecto cesa rápidamente al suspender la infusión",
        "No combinar con antagonistas del calcio no dihidropiridínicos (verapamilo, diltiazem) IV",
        "Puede enmascarar hipoglucemia en diabéticos tratados con insulina"
      ]
    },
    presentaciones: [
      {
        label: "2500 mg / 250 ml SSF",
        dosis_mg: 2500, dilucion_ml: 250, suero: "SSF",
        concUgMl: (2500 * 1000) / 250,        // 10000 mcg/ml (10 mg/ml)
        dosisRange: "50 – 200 mcg/kg/min",
        dosisMin: 50, softMax: 200, hardMax: 300,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ]
  },

  // ── F ─────────────────────────────────────────────────────
  {
    nombre: "FENILEFRINA",
    categoria: "Vasoactivo",
    isoColor: ISO_COLORS.vasoactivo,
    icono: "💉",
    modos: ["perfusion", "puntual"],
    puntual: {
      descripcion: "Bolo IV (hipotensión transitoria / inducción anestésica)",
      dosis_fija_mg: 0.1,
      via: "IV en bolo — repetir cada 2-5 min si precisa",
      nota: "Rango bolo: 50-200 mcg (0,05-0,2 mg). Alternativa: infusión continua. Efecto alfa-1 puro sin acción beta"
    },
    info: {
      indicaciones: [
        "Hipotensión por vasodilatación con gasto cardíaco conservado (anestesia raquídea, sepsis leve)",
        "Soporte vasopresor de corta duración cuando la taquicardia es problemática",
        "Alternativa a noradrenalina en centros con disponibilidad limitada"
      ],
      contraindicaciones: [
        "Bradicardia severa (vasoconstricción pura puede empeorar bradicardia refleja)",
        "Isquemia miocárdica activa o cardiogénico con bajo gasto — aumenta la postcarga"
      ],
      precauciones: [
        "Acción puramente alfa-1: aumenta RVS sin efecto inotrópico ni cronotrópico",
        "Bradicardia refleja frecuente — monitorizar FC",
        "Vía central preferible en perfusión continua (irritante en vía periférica)",
        "Vasoconstricción mesentérica y renal a dosis altas"
      ]
    },
    presentaciones: [
      {
        label: "50 mg / 500 ml SSF",
        dosis_mg: 50, dilucion_ml: 500, suero: "SSF",
        concUgMl: (50 * 1000) / 500,          // 100 mcg/ml
        dosisRange: "0,1 – 1 mcg/kg/min",
        dosisMin: 0.1, softMax: 1, hardMax: 2,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ]
  },

  {
    nombre: "FENOBARBITAL",
    categoria: "Neurológico",
    isoColor: ISO_COLORS.neutral,
    icono: "🧠",
    modos: ["carga_mantenimiento"],
    carga: {
      descripcion: "Dosis de carga IV (status epiléptico / inicio IV)",
      dosis_mg_kg: 15,
      tiempo_min: 30,
      via: "IV en 15-30 min con monitorización ECG y respiratoria",
      nota: "Rango: 15-20 mg/kg. Velocidad máxima: 100 mg/min. Riesgo de depresión respiratoria — tener ventilación disponible"
    },
    info: {
      indicaciones: [
        "Status epiléptico refractario a benzodiacepinas y fenitoína — tercera línea",
        "Epilepsia cuando la vía oral no está disponible y el valproico está contraindicado",
        "Síndrome de abstinencia alcohólica severa (segunda línea tras benzodiacepinas)"
      ],
      contraindicaciones: [
        "Depresión respiratoria severa sin soporte ventilatorio asegurado",
        "Porfiria aguda intermitente",
        "Hipersensibilidad conocida a barbitúricos"
      ],
      precauciones: [
        "Depresión respiratoria grave dosis-dependiente — soporte ventilatorio imprescindible durante la carga",
        "Hipotensión e hipotermia con la carga rápida — monitorización hemodinámica continua",
        "Acumulación con semivida larga (50-150 h) — monitorizar niveles séricos (objetivo: 15-40 mg/L)",
        "Inductor potente del CYP450 — múltiples interacciones (antibióticos, anticoagulantes, inmunosupresores)"
      ]
    },
    presentaciones: [
      {
        label: "500 mg / 250 ml SSF",
        dosis_mg: 500, dilucion_ml: 250, suero: "SSF",
        concMgMl: 500 / 250,                  // 2 mg/ml
        dosisRange: "0,08 – 0,25 mg/kg/h",
        dosisMin: 0.08, softMax: 0.25, hardMax: 0.4,
        unidad: "mg/kg/h", calcTipo: "mg_kg_h"
      }
    ]
  },

  {
    nombre: "FENTANILO",
    categoria: "Sedoanalgesia",
    isoColor: ISO_COLORS.opiaceo,
    icono: "😴",
    modos: ["perfusion", "puntual"],
    puntual: {
      descripcion: "Bolo analgésico (procedimiento o dolor agudo)",
      dosis_mcg_kg: 1.5,
      via: "IV lento en 2-3 min",
      nota: "Rango: 1-2 mcg/kg. Puede repetirse a los 5-10 min si precisa. Inicio: 1-2 min"
    },
    info: {
      indicaciones: [
        "Analgesia en UCI en pacientes con ventilación mecánica invasiva (primera línea opioide IV)",
        "Sedoanalgesia para procedimientos invasivos (intubación, drenajes, curas)",
        "Dolor agudo severo en Urgencias y UCI cuando se requiere control rápido"
      ],
      contraindicaciones: [
        "Depresión respiratoria severa sin soporte ventilatorio asegurado",
        "Hipersensibilidad conocida a fentanilo u otros opioides"
      ],
      precauciones: [
        "Depresión respiratoria dosis-dependiente — tener naloxona disponible",
        "Rigidez torácica ('pecho de madera') con dosis altas o administración IV rápida",
        "Tolerancia y dependencia física con uso prolongado — reducción gradual al retirar",
        "Precaución en insuficiencia hepática grave (acumulación)"
      ]
    },
    presentaciones: [
      {
        label: "1,5 mg / 50 ml SSF",
        dosis_mg: 1.5, dilucion_ml: 50, suero: "SSF",
        concUgMl: (1.5 * 1000) / 50,          // 30 mcg/ml
        dosisRange: "0,5 – 10 mcg/kg/h",
        dosisMin: 0.5, softMax: 10, hardMax: 15,
        unidad: "mcg/kg/h", calcTipo: "mcg_kg_h"
      }
    ]
  },

  {
    nombre: "FLUMAZENILO",
    categoria: "Antídotos",
    isoColor: ISO_COLORS.neutral,
    icono: "🔄",
    modos: ["puntual", "perfusion"],
    puntual: {
      descripcion: "Reversión de sedación por benzodiacepinas",
      dosis_fija_mg: 0.2,
      via: "IV en 15 s — repetir 0,1 mg cada 60 s hasta efecto (máx 1-2 mg)",
      nota: "La perfusión continua se usa cuando aparece re-sedación tras el bolo inicial"
    },
    info: {
      indicaciones: [
        "Reversión de sedación excesiva o sobredosis por benzodiacepinas",
        "Diagnóstico diferencial de coma con sospecha de intoxicación por BZD"
      ],
      contraindicaciones: [
        "Dependencia crónica a benzodiacepinas — alto riesgo de convulsiones graves",
        "Convulsiones activas controladas con BZD (epilepsia en status)",
        "Sospecha de intoxicación mixta con antidepresivos tricíclicos"
      ],
      precauciones: [
        "Duración de acción muy corta (30-60 min) — vigilar re-sedación y repetir si precisa",
        "Puede precipitar síndrome de abstinencia agudo y convulsiones en pacientes dependientes",
        "No usar de forma rutinaria para coma de causa desconocida sin sospecha fundada de BZD"
      ]
    },
    presentaciones: [
      {
        label: "2,5 mg / 250 ml Dx5%",
        dosis_mg: 2.5, dilucion_ml: 250, suero: "Dx5%",
        concMgMl: 2.5 / 250,                  // 0,01 mg/ml
        dosisRange: "0,1 – 0,4 mg/h",
        dosisMin: 0.1, softMax: 0.4, hardMax: 1.0,
        unidad: "mg/h", calcTipo: "mg_h"
      }
    ]
  },

  {
    nombre: "FUROSEMIDA",
    categoria: "Diuréticos",
    isoColor: ISO_COLORS.neutral,
    icono: "💧",
    modos: ["puntual", "perfusion"],
    puntual: {
      descripcion: "Bolo IV (diuresis de urgencia / edema agudo de pulmón)",
      dosis_fija_mg: 40,
      via: "IV lento (máx 4 mg/min)",
      nota: "Rango: 20-250 mg según situación. En IR: dosis ≥ creatinina sérica (mg/dL) × 10 mg"
    },
    info: {
      indicaciones: [
        "Sobrecarga de volumen y edema en contexto de insuficiencia cardíaca o renal",
        "Edema agudo de pulmón — efecto venodilatador rápido además de diurético",
        "Oliguria refractaria en UCI para inducir diuresis"
      ],
      contraindicaciones: [
        "Anuria establecida por deshidratación o necrosis tubular aguda sin diuresis residual",
        "Hipopotasemia o hiponatremia severas no corregidas",
        "Alergia a sulfonamidas (reacción cruzada posible)"
      ],
      precauciones: [
        "Monitorizar electrolitos (K⁺, Na⁺, Mg²⁺) y creatinina — riesgo de hipopotasemia",
        "Ototoxicidad con dosis altas o velocidad de infusión rápida (> 4 mg/min)",
        "Hipotensión por hipovolemia — ajustar según estado hemodinámico",
        "Hipopotasemia potencia la toxicidad digitálica si el paciente recibe digoxina"
      ]
    },
    presentaciones: [
      {
        label: "100 mg / 100 ml Dx5%",
        dosis_mg: 100, dilucion_ml: 100, suero: "Dx5%",
        concMgMl: 100 / 100,                  // 1 mg/ml
        dosisRange: "5 – 30 mg/h",
        dosisMin: 5, softMax: 30, hardMax: 50,
        unidad: "mg/h", calcTipo: "mg_h"
      }
    ]
  },

  // ── G ─────────────────────────────────────────────────────
  {
    nombre: "GLUCAGÓN",
    categoria: "Antídotos",
    isoColor: ISO_COLORS.neutral,
    icono: "🔄",
    modos: ["puntual", "perfusion"],
    puntual: {
      descripcion: "Bolo IV (intoxicación betabloqueante / antagonistas del calcio)",
      dosis_fija_mg: 2,
      via: "IV en bolo en 1-2 min — repetir cada 5 min si precisa",
      nota: "Rango bolo: 1-5 mg IV. Iniciar perfusión continua tras respuesta al bolo"
    },
    info: {
      indicaciones: [
        "Intoxicación por betabloqueantes — bradicardia e hipotensión refractarias",
        "Intoxicación por antagonistas del calcio (verapamilo, diltiazem) con shock cardiogénico",
        "Hipoglucemia grave cuando no es posible la vía IV de glucosa (uso IM/SC)"
      ],
      contraindicaciones: [
        "Feocromocitoma — puede desencadenar crisis hipertensiva por liberación de catecolaminas",
        "Hipersensibilidad conocida a glucagón o a proteínas de origen bovino/porcino"
      ],
      precauciones: [
        "Reconstituir con agua estéril proporcionada (no usar SSF — precipita en concentraciones altas)",
        "Efecto inotrópico y cronotrópico positivo independiente de los betarreceptores",
        "Náuseas y vómitos frecuentes — riesgo de broncoaspiración en paciente con nivel de conciencia alterado",
        "Respuesta limitada en intoxicaciones severas — combinar con insulina-glucosa hipertónica (terapia HAIR)"
      ]
    },
    presentaciones: [
      {
        label: "10 mg / 100 ml SSF",
        dosis_mg: 10, dilucion_ml: 100, suero: "SSF",
        concMgMl: 10 / 100,                   // 0,1 mg/ml
        dosisRange: "1 – 5 mg/h",
        dosisMin: 1, softMax: 5, hardMax: 10,
        unidad: "mg/h", calcTipo: "mg_h"
      }
    ]
  },

  {
    nombre: "GLUCONATO CÁLCICO",
    categoria: "Electrolitos",
    isoColor: ISO_COLORS.neutral,
    icono: "⚗️",
    modos: ["puntual", "perfusion"],
    puntual: {
      descripcion: "Bolo IV (hipocalcemia sintomática / antagonismo Mg²⁺ / hiperpotasemia)",
      dosis_fija_mg: 1000,
      via: "IV lento en 5-10 min (puede usarse en vía periférica)",
      nota: "1-3 g IV lento. Antídoto de hipermagnesemia: 1 g IV inmediato. Menos irritante que CaCl₂ para vía periférica"
    },
    info: {
      indicaciones: [
        "Hipocalcemia sintomática (tetania, espasmo laríngeo, convulsiones, alargamiento QTc)",
        "Hiperpotasemia grave con cambios ECG — estabilización de membrana miocárdica",
        "Hipermagnesemia sintomática — antagonismo inmediato (antídoto: 1 g IV)"
      ],
      contraindicaciones: [
        "Hipercalcemia",
        "Intoxicación digitálica activa (potencia arritmias)",
        "Hipercalciuria con nefrolitiasis cálcica activa (relativa)"
      ],
      precauciones: [
        "Menos irritante que CaCl₂: puede usarse en vía periférica calibre adecuado",
        "Contiene menos calcio elemental que CaCl₂ (9 mg/ml vs 27 mg/ml al 10%) — ajustar dosis",
        "No mezclar con bicarbonato ni fosfatos (precipita)",
        "Monitorizar calcemia y ECG durante la corrección"
      ]
    },
    presentaciones: [
      {
        label: "10000 mg / 500 ml SSF",
        dosis_mg: 10000, dilucion_ml: 500, suero: "SSF",
        concMgMl: 10000 / 500,                // 20 mg/ml
        dosisRange: "500 – 2000 mg/h",
        dosisMin: 500, softMax: 2000, hardMax: 3000,
        unidad: "mg/h", calcTipo: "mg_h"
      }
    ]
  },

  // ── H ─────────────────────────────────────────────────────
  {
    nombre: "HEPARINA",
    categoria: "Anticoagulación",
    isoColor: ISO_COLORS.neutral,
    icono: "🩸",
    modos: ["carga_mantenimiento"],
    carga: {
      descripcion: "Bolo IV de carga (TEV / anticoagulación plena)",
      dosis_mg_kg: 80,
      via: "IV en bolo rápido",
      nota: "80 UI/kg IV (máx 10.000 UI). SCA: 60 UI/kg (máx 4000 UI). Ajustar mantenimiento según aPTT a las 6 h"
    },
    info: {
      indicaciones: [
        "Trombosis venosa profunda y tromboembolismo pulmonar — anticoagulación inicial",
        "Síndrome coronario agudo (SCASEST/IAMSEST) — anticoagulación terapéutica",
        "Anticoagulación durante técnicas de depuración extrarrenal (TRRC) y ECMO",
        "Prevención de trombosis en prótesis valvulares mecánicas (peri-procedimiento)"
      ],
      contraindicaciones: [
        "Trombopenia inducida por heparina (TIH) previa — usar argatrobán o bivalirudina",
        "Sangrado activo mayor no controlado",
        "Hipertensión intracraneal grave o hemorragia intracraneal reciente"
      ],
      precauciones: [
        "Monitorizar aPTT cada 6 h hasta estabilización (objetivo: 60-100 s, 1,5-2,5 × normal)",
        "Trombopenia inducida por heparina (TIH): descenso plaquetario > 50% entre días 5-14 — sospechar y suspender",
        "Antídoto: sulfato de protamina (1 mg neutraliza 100 UI de heparina)",
        "Ajustar dosis en obesidad mórbida — usar peso ajustado, no real"
      ]
    },
    presentaciones: [
      {
        label: "25000 UI / 500 ml SSF",
        dosis_mg: 25000, dilucion_ml: 500, suero: "SSF",
        concMgMl: 25000 / 500,                // 50 UI/ml (UI tratadas como mg)
        dosisRange: "10 – 30 UI/kg/h",
        dosisMin: 10, softMax: 30, hardMax: 40,
        unidad: "UI/kg/h", calcTipo: "mg_kg_h"
      }
    ]
  },

  // ── I ─────────────────────────────────────────────────────
  {
    nombre: "INSULINA",
    categoria: "Endocrinológico",
    isoColor: ISO_COLORS.neutral,
    icono: "💉",
    modos: ["perfusion"],
    info: {
      indicaciones: [
        "Hiperglucemia en paciente crítico (objetivo glucemia: 140-180 mg/dL en UCI general)",
        "Cetoacidosis diabética (CAD) y estado hiperosmolar hiperglucémico (EHH)",
        "Hiperpotasemia severa — combinada con glucosa hipertónica (insulina-glucosa)"
      ],
      contraindicaciones: [
        "Hipoglucemia activa (glucemia < 70 mg/dL) — suspender y tratar"
      ],
      precauciones: [
        "Monitorización de glucemia cada 1-2 h al inicio y cada 2-4 h tras estabilización",
        "Hipoglucemia — riesgo mayor en ayuno, fallo renal e insuficiencia hepática",
        "La insulina se adsorbe al PVC de los sistemas de infusión — purgar el sistema antes de conectar",
        "En CAD: no suspender hasta resolución (bicarbonato > 18, pH > 7,3, glucemia < 200) — solapar con insulina SC"
      ]
    },
    presentaciones: [
      {
        label: "50 UI / 50 ml SSF",
        dosis_mg: 50, dilucion_ml: 50, suero: "SSF",
        concMgMl: 50 / 50,                    // 1 UI/ml (UI tratadas como mg)
        dosisRange: "1 – 10 UI/h",
        dosisMin: 1, softMax: 10, hardMax: 20,
        unidad: "UI/h", calcTipo: "mg_h"
      }
    ]
  },

  // ── K ─────────────────────────────────────────────────────
  {
    nombre: "KETAMINA",
    categoria: "Sedoanalgesia",
    isoColor: ISO_COLORS.sedoanalgesia,
    icono: "😴",
    modos: ["perfusion", "puntual"],
    puntual: {
      descripcion: "Inducción / sedación para procedimiento (bolo IV)",
      dosis_mg_kg: 1.5,
      via: "IV lento en 1-2 min",
      nota: "Rango: 1-2 mg/kg. Analgesia subanestésica: 0,1-0,3 mg/kg IV. Inicio rápido (< 1 min)"
    },
    info: {
      indicaciones: [
        "Sedoanalgesia en UCI en pacientes con inestabilidad hemodinámica (estimulante simpático)",
        "Inducción en secuencia rápida (ISR) especialmente en asma severo y shock",
        "Analgesia multimodal subanestésica en dosis bajas (0,1-0,3 mg/kg/h)",
        "Status asmático refractario a broncodilatadores convencionales"
      ],
      contraindicaciones: [
        "Hipertensión intracraneal grave (relativa — el efecto sobre PIC es controvertido con normocapnia)",
        "Psicosis activa o esquizofrenia no controlada",
        "Hipertensión arterial grave no controlada (estimulante simpático)"
      ],
      precauciones: [
        "Alucinaciones y fenómenos disociativos — reducir con benzodiacepinas concomitantes",
        "Aumento de secreciones — tener aspiración disponible; valorar atropina profiláctica",
        "Estimulante simpático: taquicardia e HTA frecuentes — contraindicado si se deben evitar",
        "No deprime la respiración a dosis anestésicas habituales — ventaja en vía aérea difícil"
      ]
    },
    presentaciones: [
      {
        label: "250 mg / 50 ml SSF",
        dosis_mg: 250, dilucion_ml: 50, suero: "SSF",
        concMgMl: 250 / 50,                   // 5 mg/ml
        dosisRange: "0,1 – 3 mg/kg/h",
        dosisMin: 0.1, softMax: 3, hardMax: 5,
        unidad: "mg/kg/h", calcTipo: "mg_kg_h"
      }
    ]
  },

  // ── L ─────────────────────────────────────────────────────
  {
    nombre: "LABETALOL",
    categoria: "Antihipertensivo",
    isoColor: ISO_COLORS.antihipertensivo,
    icono: "📉",
    modos: ["puntual", "perfusion"],
    puntual: {
      descripcion: "Crisis hipertensiva (bolo IV)",
      dosis_mg_kg: 0.25,
      via: "IV en 1-2 min — repetir cada 10 min (máx 300 mg total)",
      nota: "Dosis fija habitual: 20-80 mg/bolo. Doblar dosis sucesivas: 20, 40, 80 mg"
    },
    info: {
      indicaciones: [
        "Crisis hipertensiva aguda — especialmente en embarazo (eclampsia) y disección aórtica",
        "Hipertensión perioperatoria e intraoperatoria",
        "Control urgente de PA en feocromocitoma (combinado con alfabloqueante previo)"
      ],
      contraindicaciones: [
        "Asma activo o broncoespasmo significativo (betabloqueante no selectivo)",
        "Bloqueo AV 2.º-3.er grado o bradicardia severa (FC < 60 lpm)",
        "Insuficiencia cardíaca descompensada / shock cardiogénico",
        "Enfermedad arterial periférica grave"
      ],
      precauciones: [
        "Broncoespasmo en pacientes con EPOC — usar con extrema precaución",
        "Bradicardia e hipotensión — monitorización continua de PA y ECG",
        "No suspender bruscamente en pacientes con cardiopatía isquémica (rebote adrenérgico)",
        "Enmascaramiento de hipoglucemia en diabéticos tratados con insulina"
      ]
    },
    presentaciones: [
      {
        label: "200 mg / 250 ml Dx5%",
        dosis_mg: 200, dilucion_ml: 250, suero: "Dx5%",
        concMgMl: 200 / 250,                  // 0,8 mg/ml
        dosisRange: "10 – 100 mg/h",
        dosisMin: 10, softMax: 100, hardMax: 150,
        unidad: "mg/h", calcTipo: "mg_h"
      }
    ]
  },

  {
    nombre: "LEVETIRACETAM",
    categoria: "Neurológico",
    isoColor: ISO_COLORS.neutral,
    icono: "🧠",
    modos: ["carga_mantenimiento"],
    carga: {
      descripcion: "Dosis de carga IV (status epiléptico / inicio IV urgente)",
      dosis_mg_kg: 60,
      tiempo_min: 15,
      via: "IV en 15 min",
      nota: "Rango: 40-60 mg/kg (máx 4500 mg). Velocidad máxima: 5 mg/kg/min. Bien tolerado hemodinámicamente"
    },
    info: {
      indicaciones: [
        "Status epiléptico convulsivo — segunda/tercera línea tras benzodiacepinas",
        "Epilepsia cuando no es posible la vía oral (sustitución del tratamiento habitual)",
        "Prevención de convulsiones en TCE grave y postoperatorio neuroquirúrgico"
      ],
      contraindicaciones: [
        "Hipersensibilidad conocida a levetiracetam",
        "Insuficiencia renal grave no ajustada (eliminación renal — reducir dosis)"
      ],
      precauciones: [
        "Ajuste de dosis en insuficiencia renal (ClCr < 50 ml/min): reducir 50%",
        "Irritabilidad, agitación y alteraciones del comportamiento — frecuentes en UCI",
        "Habitualmente se administra IV de forma intermitente (cada 12 h), no en perfusión continua",
        "Buena tolerabilidad hemodinámica (sin hipotensión ni bradicardia significativas)"
      ]
    },
    presentaciones: [
      {
        label: "4000 mg / 250 ml SSF",
        dosis_mg: 4000, dilucion_ml: 250, suero: "SSF",
        concMgMl: 4000 / 250,                 // 16 mg/ml
        dosisRange: "0,5 – 2 mg/kg/h",
        dosisMin: 0.5, softMax: 2, hardMax: 3,
        unidad: "mg/kg/h", calcTipo: "mg_kg_h"
      }
    ]
  },

  {
    nombre: "LEVOSIMENDAN",
    categoria: "Vasoactivo",
    isoColor: ISO_COLORS.vasoactivo,
    icono: "🫀",
    modos: ["carga_mantenimiento"],
    carga: {
      descripcion: "Dosis de carga (omitir si PAS < 100 mmHg o FC > 100 lpm)",
      dosis_mcg_kg: 12,
      tiempo_min: 10,
      via: "IV en 10 min",
      nota: "Rango de carga: 6-12 mcg/kg. Muchos protocolos omiten la carga para reducir hipotensión"
    },
    info: {
      indicaciones: [
        "Insuficiencia cardíaca aguda descompensada con bajo gasto refractaria a tratamiento convencional",
        "Shock cardiogénico como puente a trasplante o dispositivo de asistencia ventricular",
        "Bajo gasto cardíaco postoperatorio tras cirugía cardíaca de alto riesgo"
      ],
      contraindicaciones: [
        "Hipotensión severa (PAS < 85 mmHg) no corregida",
        "Taquicardia sinusal significativa (FC > 120 lpm)",
        "Insuficiencia renal (ClCr < 30 ml/min) o hepática grave",
        "Antecedentes de torsades de pointes"
      ],
      precauciones: [
        "Hipotensión frecuente especialmente durante la carga — monitorización invasiva de PA",
        "Taquicardia refleja — puede requerir betabloqueante concomitante",
        "Hipopotasemia — monitorizar y corregir K⁺ antes y durante la infusión",
        "Efecto hemodinámico persiste 24-48 h post-infusión por metabolitos activos de vida media larga"
      ]
    },
    presentaciones: [
      {
        label: "12,5 mg / 250 ml Dx5%",
        dosis_mg: 12.5, dilucion_ml: 250, suero: "Dx5%",
        concUgMl: (12.5 * 1000) / 250,        // 50 mcg/ml
        dosisRange: "0,05 – 0,2 mcg/kg/min",
        dosisMin: 0.05, softMax: 0.2, hardMax: 0.4,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ]
  },

  // ── M ─────────────────────────────────────────────────────
  {
    nombre: "MAGNESIO (SULFATO)",
    categoria: "Electrolitos / Antiarrítmico",
    isoColor: ISO_COLORS.antiarritmico,
    icono: "⚡",
    modos: ["puntual", "perfusion", "carga_mantenimiento"],
    puntual: {
      descripcion: "Torsades de pointes / Broncoespasmo severo refractario",
      dosis_fija_mg: 2000,
      via: "IV en 1-5 min (urgencia) o en 10-15 min",
      nota: "Eclampsia: bolo de 4 g (4000 mg) en 15-20 min. Hipomagnasemia: 1-2 g en 15 min"
    },
    carga: {
      descripcion: "Carga para eclampsia / preeclampsia grave",
      dosis_fija_mg: 4000,
      tiempo_min: 15,
      via: "IV en 15-20 min",
      nota: "Seguir con perfusión de mantenimiento de 1-2 g/h. Antídoto: gluconato cálcico 1 g IV"
    },
    info: {
      indicaciones: [
        "Torsades de pointes — primera línea independientemente del nivel sérico de Mg²⁺",
        "Eclampsia y preeclampsia grave — prevención y tratamiento de convulsiones",
        "Broncoespasmo severo refractario a broncodilatadores inhalados (crisis asmática)"
      ],
      contraindicaciones: [
        "Bloqueo AV avanzado",
        "Insuficiencia renal grave (acumulación — reducir dosis y monitorizar)",
        "Miastenia gravis (potencia el bloqueo neuromuscular)"
      ],
      precauciones: [
        "Signos de toxicidad: pérdida de reflejos tendinosos (> 3,5 mmol/L), depresión respiratoria (> 5 mmol/L), parada cardíaca (> 7,5 mmol/L)",
        "Monitorizar reflejo rotuliano y frecuencia respiratoria (< 12 rpm = suspender)",
        "Niveles séricos terapéuticos: 2-3,5 mmol/L (4,8-8,4 mg/dL)",
        "Antídoto disponible: gluconato cálcico 1 g IV — tener preparado"
      ]
    },
    presentaciones: [
      {
        label: "4500 mg / 250 ml SSF",
        dosis_mg: 4500, dilucion_ml: 250, suero: "SSF",
        concMgMl: 4500 / 250,                 // 18 mg/ml
        dosisRange: "2 – 4 mg/min",
        dosisMin: 2, softMax: 4, hardMax: 6,
        unidad: "mg/min", calcTipo: "mg_min"
      }
    ]
  },

  {
    nombre: "MIDAZOLAM",
    categoria: "Sedoanalgesia",
    isoColor: ISO_COLORS.sedoanalgesia,
    icono: "😴",
    modos: ["perfusion", "puntual"],
    puntual: {
      descripcion: "Sedación para procedimiento / Status epiléptico",
      dosis_mg_kg: 0.05,
      via: "IV lento (titulando 1-2 mg cada 2 min hasta efecto)",
      nota: "Sedación procedimiento: 0,01-0,1 mg/kg. Status epiléptico: 0,1-0,2 mg/kg IV"
    },
    info: {
      indicaciones: [
        "Sedación y ansiólisis en UCI en pacientes con ventilación mecánica",
        "Sedación para procedimientos invasivos (intubación, broncoscopia, drenajes)",
        "Status epiléptico refractario a benzodiacepinas de primera línea"
      ],
      contraindicaciones: [
        "Hipersensibilidad a benzodiacepinas",
        "Glaucoma de ángulo cerrado no tratado",
        "Insuficiencia respiratoria severa sin soporte ventilatorio disponible"
      ],
      precauciones: [
        "Depresión respiratoria e hipotensión — especialmente en ancianos y pacientes hipovolémicos",
        "Acumulación significativa en insuficiencia renal y/o hepática con uso prolongado",
        "Asociado a delirium en UCI con uso prolongado — considerar alternativas (dexmedetomidina)",
        "Tolerancia y dependencia — reducción gradual al retirar en uso > 72 h"
      ]
    },
    presentaciones: [
      {
        label: "250 mg puro / 50 ml",
        dosis_mg: 250, dilucion_ml: 50, suero: "Puro",
        concMgMl: 250 / 50,                   // 5 mg/ml
        dosisRange: "0,02 – 0,2 mg/kg/h",
        dosisMin: 0.02, softMax: 0.2, hardMax: 0.4,
        unidad: "mg/kg/h", calcTipo: "mg_kg_h"
      }
    ]
  },

  {
    nombre: "MILRINONA",
    categoria: "Vasoactivo",
    isoColor: ISO_COLORS.vasoactivo,
    icono: "🫀",
    modos: ["carga_mantenimiento"],
    carga: {
      descripcion: "Dosis de carga (puede omitirse si hipotensión)",
      dosis_mcg_kg: 50,
      tiempo_min: 10,
      via: "IV en 10 min",
      nota: "La carga causa hipotensión con frecuencia — monitorización invasiva de PA imprescindible"
    },
    info: {
      indicaciones: [
        "Shock cardiogénico con bajo gasto — inodilatador (inotrópico + vasodilatador)",
        "Disfunción aguda del ventrículo derecho (TEP masivo, HTP, postoperatorio cardíaco)",
        "Bajo gasto cardíaco postoperatorio refractario a dobutamina"
      ],
      contraindicaciones: [
        "Estenosis aórtica o pulmonar severa hemodinámicamente significativa",
        "Miocardiopatía hipertrófica obstructiva",
        "Infarto agudo de miocardio (puede empeorar isquemia — usar con extrema precaución)"
      ],
      precauciones: [
        "Hipotensión frecuente especialmente con la carga — monitorización invasiva de PA",
        "Arritmias auriculares y ventriculares — monitorización ECG continua",
        "Ajustar dosis en insuficiencia renal (excreción renal predominante)",
        "No combinar con furosemida en la misma vía (precipita)"
      ]
    },
    presentaciones: [
      {
        label: "30 mg / 250 ml SSF",
        dosis_mg: 30, dilucion_ml: 250, suero: "SSF",
        concUgMl: (30 * 1000) / 250,          // 120 mcg/ml
        dosisRange: "0,375 – 0,75 mcg/kg/min",
        dosisMin: 0.375, softMax: 0.75, hardMax: 1.0,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ]
  },

  {
    nombre: "MORFINA",
    categoria: "Sedoanalgesia",
    isoColor: ISO_COLORS.opiaceo,
    icono: "😴",
    modos: ["perfusion", "puntual"],
    puntual: {
      descripcion: "Bolo analgésico IV",
      dosis_mg_kg: 0.1,
      via: "IV lento en 2-5 min",
      nota: "Dosis habitual: 2-5 mg IV. Titular de 2 en 2 mg con intervalos de 5 min"
    },
    info: {
      indicaciones: [
        "Analgesia en UCI para dolor moderado-severo en pacientes con VMI",
        "Dolor agudo severo (politraumatismo, pancreatitis grave, SCA)",
        "Edema agudo de pulmón — efecto venodilatador y ansiolítico además de analgésico"
      ],
      contraindicaciones: [
        "Depresión respiratoria severa sin soporte ventilatorio asegurado",
        "Hipertensión intracraneal grave (aumenta la PaCO₂ si deprime la respiración)",
        "Íleo paralítico severo — riesgo de perforación",
        "Hipersensibilidad o alergia conocida a morfina"
      ],
      precauciones: [
        "Depresión respiratoria dosis-dependiente — tener naloxona disponible",
        "Hipotensión por liberación de histamina — administrar lentamente",
        "Acumulación de metabolitos activos (morfina-6-glucurónido) en insuficiencia renal — riesgo de sedación prolongada",
        "Estreñimiento — tratamiento laxante profiláctico si uso > 24-48 h"
      ]
    },
    presentaciones: [
      {
        label: "50 mg / 50 ml SSF",
        dosis_mg: 50, dilucion_ml: 50, suero: "SSF",
        concMgMl: 50 / 50,                    // 1 mg/ml
        dosisRange: "2 – 20 mg/h",
        dosisMin: 2, softMax: 20, hardMax: 30,
        unidad: "mg/h", calcTipo: "mg_h"
      }
    ]
  },

  // ── N ─────────────────────────────────────────────────────
  {
    nombre: "NALOXONA",
    categoria: "Antídotos",
    isoColor: ISO_COLORS.neutral,
    icono: "🔄",
    modos: ["puntual", "perfusion"],
    puntual: {
      descripcion: "Reversión de sobredosis / depresión respiratoria por opioides",
      dosis_fija_mg: 0.4,
      via: "IV / IM / SC — repetir cada 2-3 min hasta respuesta (máx 10 mg)",
      nota: "En pacientes dependientes de opioides: titular a 0,04-0,1 mg IV para evitar síndrome de abstinencia brusco"
    },
    info: {
      indicaciones: [
        "Sobredosis e intoxicación por opioides con depresión respiratoria",
        "Reversión de depresión respiratoria postoperatoria por opioides",
        "Prurito intenso refractario inducido por opioides intratecales (dosis muy bajas)"
      ],
      contraindicaciones: [
        "Hipersensibilidad conocida a naloxona"
      ],
      precauciones: [
        "Duración de acción corta (30-90 min) — puede producirse re-opiación después del bolo inicial",
        "Síndrome de abstinencia agudo en pacientes con dependencia de opioides — titular dosis mínima eficaz",
        "Edema agudo de pulmón postnaloxona (raramente, mecanismo no completamente aclarado)",
        "En intoxicaciones por opioides de vida media larga (metadona, fentanilo parches): perfusión continua"
      ]
    },
    presentaciones: [
      {
        label: "4 mg / 250 ml SSF",
        dosis_mg: 4, dilucion_ml: 250, suero: "SSF",
        concUgMl: (4 * 1000) / 250,           // 16 mcg/ml
        dosisRange: "5 – 15 mcg/kg/h",
        dosisMin: 5, softMax: 15, hardMax: 20,
        unidad: "mcg/kg/h", calcTipo: "mcg_kg_h"
      }
    ]
  },

  {
    nombre: "NIMODIPINO",
    categoria: "Neuroprotección",
    isoColor: ISO_COLORS.neutral,
    icono: "🧠",
    modos: ["perfusion"],
    info: {
      indicaciones: [
        "Prevención y tratamiento del vasoespasmo cerebral tras hemorragia subaracnoidea (HSA) aneurismática",
        "Reducción del déficit neurológico isquémico tardío en HSA"
      ],
      contraindicaciones: [
        "Hipotensión severa (PAS < 90 mmHg) — puede agravar la hipoperfusión cerebral",
        "Edema cerebral grave con HIC no controlada (relativa)"
      ],
      precauciones: [
        "Monitorización continua de PA — hipotensión puede reducir la PPC (Presión de Perfusión Cerebral)",
        "Incompatible con cloruro de polivinilo (PVC) — usar siempre vías y llaves de polietileno o poliuretano",
        "No mezclar con otros fármacos en la misma vía",
        "Proteger de la luz (fotosensible) — cubrir la vía y el frasco"
      ]
    },
    presentaciones: [
      {
        label: "10 mg puro / 50 ml",
        dosis_mg: 10, dilucion_ml: 50, suero: "Puro",
        concUgMl: (10 * 1000) / 50,           // 200 mcg/ml
        dosisRange: "0,25 – 2 mcg/kg/min",
        dosisMin: 0.25, softMax: 2, hardMax: 3,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ]
  },

  {
    nombre: "NITROGLICERINA",
    categoria: "Antihipertensivo / Coronario",
    isoColor: ISO_COLORS.antihipertensivo,
    icono: "❤️",
    modos: ["perfusion"],
    info: {
      indicaciones: [
        "Angina inestable / SCASEST con dolor anginoso refractario a nitratos sublinguales",
        "Edema agudo de pulmón hipertensivo (reduce precarga y poscarga)",
        "Crisis hipertensiva en contexto de insuficiencia cardíaca aguda"
      ],
      contraindicaciones: [
        "Uso de inhibidores PDE5 (sildenafilo, tadalafilo, vardenafilo) en las últimas 24-48 h — hipotensión severa potencialmente fatal",
        "Hipotensión arterial (PAS < 90 mmHg) o hipovolemia no corregida",
        "Hipertensión intracraneal (vasodilatación cerebral)",
        "Estenosis aórtica severa con dependencia de precarga"
      ],
      precauciones: [
        "Taquifilaxia (tolerancia) con uso continuo > 24-48 h — necesaria ventana libre de nitratos",
        "Cefalea intensa y pulsátil (efecto vasodilatador sistémico frecuente)",
        "Absorción por cloruro de polivinilo (PVC) — usar siempre vías de polietileno (hasta 80% de pérdida de dosis en PVC)",
        "Taquicardia refleja — especialmente a dosis altas"
      ]
    },
    presentaciones: [
      {
        label: "50 mg / 500 ml Dx5%",
        dosis_mg: 50, dilucion_ml: 500, suero: "Dx5%",
        concUgMl: (50 * 1000) / 500,          // 100 mcg/ml
        dosisRange: "5 – 200 mcg/min",
        dosisMin: 5, softMax: 200, hardMax: 300,
        unidad: "mcg/min", calcTipo: "mcg_min"
      }
    ]
  },

  {
    nombre: "NORADRENALINA",
    categoria: "Vasoactivo",
    isoColor: ISO_COLORS.vasoactivo,
    icono: "💉",
    modos: ["perfusion"],
    info: {
      indicaciones: [
        "Shock séptico / distributivo — vasopresor de primera línea (Guías SSC 2021)",
        "Shock vasopléjico postoperatorio (cirugía cardíaca, trasplante hepático)",
        "Hipotensión arterial refractaria a reposición adecuada de fluidos"
      ],
      contraindicaciones: [
        "Hipovolemia no corregida — iniciar reposición simultánea y no retrasar noradrenalina en shock séptico",
        "Isquemia mesentérica activa o trombosis vascular periférica extensa (relativa)"
      ],
      precauciones: [
        "Vía central OBLIGATORIA — necrosis tisular grave e irreversible por extravasación en vía periférica",
        "Monitorización invasiva de PA obligatoria — ajuste fino de dosis imposible con manguito",
        "Isquemia distal periférica y digital a dosis altas — vigilar extremidades",
        "No mezclar con bicarbonato sódico en la misma vía (inactivación por alcalinización)"
      ]
    },
    presentaciones: [
      {
        label: "10 mg / 250 ml Dx5%",
        dosis_mg: 10, dilucion_ml: 250, suero: "Dx5%",
        concUgMl: (10 * 1000) / 250,          // 40 mcg/ml
        dosisRange: "0,01 – 3 mcg/kg/min",
        dosisMin: 0.01, softMax: 3, hardMax: 5,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      },
      {
        label: "40 mg / 50 ml Dx5% (concentrada)",
        dosis_mg: 40, dilucion_ml: 50, suero: "Dx5%",
        concUgMl: (40 * 1000) / 50,           // 800 mcg/ml
        dosisRange: "0,01 – 3 mcg/kg/min",
        dosisMin: 0.01, softMax: 3, hardMax: 5,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      },
      {
        label: "40 mg / 250 ml Dx5%",
        dosis_mg: 40, dilucion_ml: 250, suero: "Dx5%",
        concUgMl: (40 * 1000) / 250,          // 160 mcg/ml
        dosisRange: "0,01 – 3 mcg/kg/min",
        dosisMin: 0.01, softMax: 3, hardMax: 5,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ]
  },

  // ── O ─────────────────────────────────────────────────────
  {
    nombre: "OCTREÓTIDO",
    categoria: "Digestivo / Hemostasia",
    isoColor: ISO_COLORS.neutral,
    icono: "🔴",
    modos: ["carga_mantenimiento"],
    carga: {
      descripcion: "Bolo IV inicial antes de iniciar la perfusión",
      dosis_fija_mg: 0.05,
      via: "IV en bolo rápido o en 3-5 min",
      nota: "50 mcg (0,05 mg) en bolo IV. Iniciar perfusión continua inmediatamente después"
    },
    info: {
      indicaciones: [
        "Hemorragia digestiva alta por varices esofágicas o gástricas — análogo de somatostatina de acción prolongada",
        "Fístulas pancreáticas y enterocutáneas de alto débito",
        "Síndrome carcinoide con síntomas sistémicos graves (diarrea secretora, rubor)"
      ],
      contraindicaciones: [
        "Hipersensibilidad conocida a octreótido o análogos de somatostatina"
      ],
      precauciones: [
        "Hiperglucemia o hipoglucemia — monitorizar glucemia cada 4-6 h",
        "Bradicardia sinusal e intervalo QT prolongado — monitorizar ECG si uso prolongado",
        "Colelitiasis con uso crónico (no relevante en uso agudo de UCI)",
        "Vida media más larga que somatostatina (1,5-2 h) — permite dosificación más estable"
      ]
    },
    presentaciones: [
      {
        label: "500 mcg / 250 ml SSF",
        dosis_mg: 0.5, dilucion_ml: 250, suero: "SSF",
        concUgMl: (0.5 * 1000) / 250,         // 2 mcg/ml
        dosisRange: "25 – 50 mcg/h",
        dosisMin: 25, softMax: 50, hardMax: 100,
        unidad: "mcg/h", calcTipo: "mcg_h"
      }
    ]
  },

  {
    nombre: "OMEPRAZOL",
    categoria: "Digestivo / Hemostasia",
    isoColor: ISO_COLORS.neutral,
    icono: "🔴",
    modos: ["puntual", "perfusion"],
    puntual: {
      descripcion: "Bolo IV (sangrado GI alto / profilaxis)",
      dosis_fija_mg: 80,
      via: "IV en 20-30 min",
      nota: "Carga: 80 mg IV. Iniciar perfusión de 8 mg/h a continuación en sangrado activo. Alternativa: 40 mg/12h IV"
    },
    info: {
      indicaciones: [
        "Hemorragia digestiva alta ulcerosa — reducción de ácido para estabilizar el coágulo endoscópico",
        "Profilaxis de úlcera de estrés en UCI (ventilación mecánica > 48 h o coagulopatía)",
        "Sustitución IV del tratamiento oral en pacientes sin acceso digestivo"
      ],
      contraindicaciones: [
        "Hipersensibilidad a omeprazol o a los benzimidazoles sustituidos",
        "Uso concomitante con nelfinavir (antiretroviral)"
      ],
      precauciones: [
        "Hipomagnesemia con uso prolongado (> 3 meses) — monitorizar en UCI si tratamiento previo prolongado",
        "Aumento del riesgo de infección por C. difficile y neumonía nosocomial con uso prolongado",
        "Reducir dosis en insuficiencia hepática grave",
        "Interacciona con clopidogrel (reducción del efecto antiplaquetario) — valorar alternativa (pantoprazol)"
      ]
    },
    presentaciones: [
      {
        label: "80 mg / 100 ml SSF",
        dosis_mg: 80, dilucion_ml: 100, suero: "SSF",
        concMgMl: 80 / 100,                   // 0,8 mg/ml
        dosisRange: "4 – 8 mg/h",
        dosisMin: 4, softMax: 8, hardMax: 12,
        unidad: "mg/h", calcTipo: "mg_h"
      }
    ]
  },

  // ── P ─────────────────────────────────────────────────────
  {
    nombre: "PROPOFOL",
    categoria: "Sedoanalgesia",
    isoColor: ISO_COLORS.sedoanalgesia,
    icono: "😴",
    modos: ["perfusion", "puntual"],
    puntual: {
      descripcion: "Inducción anestésica / sedación para procedimiento",
      dosis_mg_kg: 1.5,
      via: "IV lento (40 mg cada 10 s hasta efecto)",
      nota: "UCI / paciente debilitado: 0,5-1 mg/kg. Ancianos o ASA III-IV: reducir 30-50%"
    },
    info: {
      indicaciones: [
        "Sedación en UCI en pacientes con ventilación mecánica invasiva",
        "Sedación para procedimientos invasivos y diagnósticos",
        "Inducción anestésica (bolo)"
      ],
      contraindicaciones: [
        "Hipotensión severa sin soporte vasopresor (bolo produce hipotensión significativa)",
        "Hipersensibilidad conocida al propofol (formulación lipídica — alergia al huevo y soja: valorar individualmente)"
      ],
      precauciones: [
        "Síndrome de infusión de propofol (PRIS): dosis > 4 mg/kg/h durante > 48 h — acidosis metabólica, rabdomiólisis, fallo cardíaco y renal",
        "Monitorizar triglicéridos cada 48 h en infusiones prolongadas (aporta 1,1 kcal/ml como emulsión lipídica)",
        "Hipotensión y apnea frecuentes en bolo — administrar lentamente y tener soporte ventilatorio disponible",
        "No mezclar con otros fármacos en la misma vía ni en la misma jeringa"
      ]
    },
    presentaciones: [
      {
        label: "1000 mg puro / 100 ml",
        dosis_mg: 1000, dilucion_ml: 100, suero: "Puro",
        concMgMl: 1000 / 100,                 // 10 mg/ml
        dosisRange: "0,5 – 5 mg/kg/h",
        dosisMin: 0.5, softMax: 5, hardMax: 8,
        unidad: "mg/kg/h", calcTipo: "mg_kg_h"
      }
    ]
  },

  // ── R ─────────────────────────────────────────────────────
  {
    nombre: "REMIFENTANILO",
    categoria: "Sedoanalgesia",
    isoColor: ISO_COLORS.opiaceo,
    icono: "😴",
    modos: ["perfusion"],
    info: {
      indicaciones: [
        "Analgesia en UCI con ventilación mecánica — opioide de elección cuando se planifica destete precoz",
        "Analgosedación (analgesia primero) con niveles de sedación variables sin acumulación",
        "Procedimientos dolorosos en UCI cuando se requiere analgesia potente y de corta duración"
      ],
      contraindicaciones: [
        "Paciente sin soporte ventilatorio asegurado — depresión respiratoria intensa a dosis analgésicas",
        "Hipersensibilidad conocida a remifentanilo o fentanilos"
      ],
      precauciones: [
        "Vida media ultrashort (3-5 min): el dolor reaparece bruscamente al suspender — planificar analgesia de rescate",
        "Rigidez torácica con bolos rápidos — administrar siempre en perfusión continua, nunca en bolo",
        "Hiperalgesia inducida por opioides con uso prolongado o dosis altas",
        "Bradicardia e hipotensión — monitorización continua de PA y FC"
      ]
    },
    presentaciones: [
      {
        label: "5 mg / 250 ml SSF",
        dosis_mg: 5, dilucion_ml: 250, suero: "SSF",
        concUgMl: (5 * 1000) / 250,           // 20 mcg/ml
        dosisRange: "0,025 – 0,3 mcg/kg/min",
        dosisMin: 0.025, softMax: 0.3, hardMax: 0.5,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ]
  },

  {
    nombre: "ROCURONIO",
    categoria: "Relajante muscular",
    isoColor: ISO_COLORS.relajante,
    icono: "🔒",
    modos: ["carga_mantenimiento"],
    carga: {
      descripcion: "Dosis de intubación (bolo IV)",
      dosis_mg_kg: 0.6,
      via: "IV en bolo rápido",
      nota: "ISR (secuencia rápida): 1,2 mg/kg. Inicio: < 60 s. Duración: 30-60 min (0,6 mg/kg). Antídoto: sugammadex"
    },
    info: {
      indicaciones: [
        "Intubación orotraqueal incluyendo intubación de secuencia rápida (ISR)",
        "Relajación muscular en ventilación mecánica invasiva"
      ],
      contraindicaciones: [
        "Administrar sin tener asegurada la vía aérea (salvo en ISR por indicación urgente)",
        "Hipersensibilidad conocida a rocuronio",
        "Miastenia gravis grave (resistencia variable y respuesta impredecible)"
      ],
      precauciones: [
        "No tiene efecto analgésico ni sedante — combinar siempre con sedación y analgesia adecuadas",
        "Monitorizar grado de bloqueo con train-of-four (TOF) durante mantenimiento",
        "Antídoto específico disponible: sugammadex (4 mg/kg bloqueo profundo; 16 mg/kg ISR)",
        "Almacenar en nevera a 2-8 °C (estable 12 semanas a temperatura ambiente)"
      ]
    },
    presentaciones: [
      {
        label: "500 mg puro / 50 ml",
        dosis_mg: 500, dilucion_ml: 50, suero: "Puro",
        concMgMl: 500 / 50,                   // 10 mg/ml
        dosisRange: "0,3 – 0,6 mg/kg/h",
        dosisMin: 0.3, softMax: 0.6, hardMax: 1.0,
        unidad: "mg/kg/h", calcTipo: "mg_kg_h"
      }
    ]
  },

  // ── S ─────────────────────────────────────────────────────
  {
    nombre: "SOMATOSTATINA",
    categoria: "Digestivo / Hemostasia",
    isoColor: ISO_COLORS.neutral,
    icono: "🔴",
    modos: ["carga_mantenimiento"],
    carga: {
      descripcion: "Bolo inicial antes de iniciar la perfusión",
      dosis_fija_mg: 0.25,
      via: "IV en bolo rápido (o en 3-5 min)",
      nota: "250 mcg en bolo IV — iniciar la perfusión continua inmediatamente después"
    },
    info: {
      indicaciones: [
        "Hemorragia digestiva alta por varices esofágicas o gástricas (primera línea farmacológica)",
        "Hemorragia por úlcera péptica refractaria a tratamiento endoscópico",
        "Fístulas digestivas de alto débito (pancreáticas, intestinales)"
      ],
      contraindicaciones: [
        "Hipersensibilidad conocida a somatostatina"
      ],
      precauciones: [
        "Hiperglucemia o hipoglucemia — monitorizar glucemia cada 4-6 h durante la perfusión",
        "Bradicardia e hipotensión transitoria especialmente con el bolo inicial — administrar lentamente",
        "Náuseas y molestias abdominales frecuentes al inicio",
        "Vida media muy corta (1-3 min): el efecto cesa rápidamente al suspender — no interrumpir la perfusión"
      ]
    },
    presentaciones: [
      {
        label: "3 mg / 250 ml SSF",
        dosis_mg: 3, dilucion_ml: 250, suero: "SSF",
        concUgMl: (3 * 1000) / 250,           // 12 mcg/ml
        dosisRange: "3,5 mcg/kg/h",
        dosisMin: 3.5, softMax: 3.5, hardMax: 4.0,
        unidad: "mcg/kg/h", calcTipo: "mcg_kg_h"
      }
    ]
  },

  {
    nombre: "SUCCINILCOLINA",
    categoria: "Relajante muscular",
    isoColor: ISO_COLORS.relajante,
    icono: "🔒",
    modos: ["puntual"],
    puntual: {
      descripcion: "Intubación de secuencia rápida (ISR)",
      dosis_mg_kg: 1.5,
      via: "IV en bolo rápido",
      nota: "Rango: 1-2 mg/kg. Inicio: < 60 s. Duración: 5-10 min. No usar si hiperpotasemia, grandes quemados, aplastamiento, o desnervación > 24-72 h"
    },
    info: {
      indicaciones: [
        "Intubación de secuencia rápida (ISR) — relajante despolarizante de elección por su rapidez de acción y duración ultracorta",
        "Situaciones donde se necesita el inicio más rápido posible de bloqueo neuromuscular"
      ],
      contraindicaciones: [
        "Hiperpotasemia conocida o riesgo elevado (quemaduras extensas > 48h, rabdomiólisis, aplastamiento, lesión medular > 24-72h)",
        "Miopatías con riesgo de rabdomiólisis (distrofias musculares, miopatías congénitas)",
        "Hipertermia maligna — desencadenante conocido",
        "Glaucoma de ángulo abierto con presión intraocular elevada (relativa)"
      ],
      precauciones: [
        "Hiperpotasemia grave potencialmente fatal en pacientes con denervación, inmovilización prolongada o grandes quemados",
        "Puede aumentar transitoriamente la presión intragástrica e intracraneal",
        "No existe antídoto específico — el bloqueo revierte espontáneamente en 5-10 min",
        "Fasciculaciones musculares previas al bloqueo — pueden causar mialgia postoperatoria"
      ]
    },
    presentaciones: [
      {
        label: "200 mg / 10 ml (puro)",
        dosis_mg: 200, dilucion_ml: 10, suero: "Puro",
        concMgMl: 200 / 10,                   // 20 mg/ml
        dosisRange: "1 – 1,5 mg/kg (bolo único)",
        dosisMin: 1, softMax: 1.5, hardMax: 2,
        unidad: "mg/kg", calcTipo: "mg_kg_h"
      }
    ]
  },

  // ── T ─────────────────────────────────────────────────────
  {
    nombre: "TERLIPRESINA",
    categoria: "Vasoactivo",
    isoColor: ISO_COLORS.vasoactivo,
    icono: "💉",
    modos: ["puntual", "perfusion"],
    puntual: {
      descripcion: "Bolo IV (sangrado varicoso / síndrome hepatorrenal)",
      dosis_fija_mg: 2,
      via: "IV en bolo lento en 1-2 min — repetir cada 4-6 h",
      nota: "Sangrado varicoso: 1-2 mg/4-6h. SHR: 0,5-1 mg/4-6h. Reducir a 1 mg si peso < 50 kg"
    },
    info: {
      indicaciones: [
        "Hemorragia digestiva por varices esofágicas y gástricas — vasoconstricción esplácnica",
        "Síndrome hepatorrenal tipo 1 (SHR-AKI) — combinado con albúmina IV",
        "Shock distributivo por vasodilatación severa refractaria (uso fuera de ficha técnica)"
      ],
      contraindicaciones: [
        "Cardiopatía isquémica activa o arritmias ventriculares severas",
        "Enfermedad arterial periférica grave o isquemia mesentérica activa",
        "Embarazo (vasoconstricción uterina y placentaria)",
        "Asma bronquial severo (broncoespasmo)"
      ],
      precauciones: [
        "Isquemia periférica, coronaria o mesentérica — vigilar signos de isquemia durante el tratamiento",
        "Hiponatremia dilucional — monitorizar sodio plasmático",
        "Bradicardia e hipertensión arterial — monitorización ECG y PA continua",
        "En SHR: combinar siempre con albúmina IV (1 g/kg día 1, luego 20-40 g/día)"
      ]
    },
    presentaciones: [
      {
        label: "5 mg / 250 ml SSF",
        dosis_mg: 5, dilucion_ml: 250, suero: "SSF",
        concMgMl: 5 / 250,                    // 0,02 mg/ml
        dosisRange: "0,25 – 2 mg/h",
        dosisMin: 0.25, softMax: 2, hardMax: 4,
        unidad: "mg/h", calcTipo: "mg_h"
      }
    ]
  },

  // ── U ─────────────────────────────────────────────────────
  {
    nombre: "URAPIDILO",
    categoria: "Antihipertensivo",
    isoColor: ISO_COLORS.antihipertensivo,
    icono: "📉",
    modos: ["puntual", "perfusion"],
    puntual: {
      descripcion: "Crisis hipertensiva (bolo IV)",
      dosis_fija_mg: 25,
      via: "IV en 20 segundos — repetir a los 5 min si PA no desciende",
      nota: "Segunda dosis: 25 mg. Tercera dosis: 50 mg. Total máximo: 100 mg. No mezclar con soluciones alcalinas"
    },
    info: {
      indicaciones: [
        "Crisis hipertensiva urgente y emergencia hipertensiva",
        "Hipertensión perioperatoria e intraoperatoria",
        "Hipertensión en disección aórtica (combinado con betabloqueante)",
        "Hipertensión en el embarazo cuando labetalol no está disponible"
      ],
      contraindicaciones: [
        "Estenosis aórtica o mitral severa hemodinámicamente significativa",
        "Hipovolemia no corregida"
      ],
      precauciones: [
        "Hipotensión especialmente con la primera dosis — monitorización continua de PA",
        "Incompatible con soluciones alcalinas (pH > 8) — no mezclar con bicarbonato en la misma vía",
        "Acción relativamente rápida y titulable — ventaja frente a otros antihipertensivos IV"
      ]
    },
    presentaciones: [
      {
        label: "250 mg puro / 50 ml",
        dosis_mg: 250, dilucion_ml: 50, suero: "Puro",
        concUgMl: (250 * 1000) / 50,          // 5000 mcg/ml
        dosisRange: "2,5 – 7 mcg/kg/min",
        dosisMin: 2.5, softMax: 7, hardMax: 10,
        unidad: "mcg/kg/min", calcTipo: "mcg_kg_min"
      }
    ]
  },

  // ── V ─────────────────────────────────────────────────────
  {
    nombre: "VALPROICO (Ácido)",
    categoria: "Neurológico",
    isoColor: ISO_COLORS.neutral,
    icono: "🧠",
    modos: ["carga_mantenimiento"],
    carga: {
      descripcion: "Dosis de carga IV (status epiléptico / inicio IV)",
      dosis_mg_kg: 25,
      tiempo_min: 10,
      via: "IV en 5-15 min con monitorización ECG",
      nota: "Rango: 15-30 mg/kg. Velocidad máxima: 6 mg/kg/min. Continuar con perfusión de mantenimiento"
    },
    info: {
      indicaciones: [
        "Status epiléptico convulsivo — segunda línea tras benzodiacepinas",
        "Epilepsia cuando la vía oral no está disponible (sustitución de tratamiento habitual)",
        "Manía aguda y trastorno bipolar cuando la vía oral no es posible"
      ],
      contraindicaciones: [
        "Hepatopatía severa o fallo hepático agudo / crónico avanzado — riesgo de hepatotoxicidad fatal",
        "Embarazo — teratogénico (espina bífida, malformaciones cardíacas, deterioro neurocognitivo fetal)",
        "Mitocondropatías y enfermedades del ciclo de la urea — riesgo de encefalopatía hiperamoniémica",
        "Porfiria aguda intermitente"
      ],
      precauciones: [
        "Monitorizar transaminasas y amoniemia — hepatotoxicidad y encefalopatía hiperamoniémica",
        "Monitorizar niveles séricos (objetivo: 50-100 mg/L) especialmente con cambios de dosis",
        "Múltiples interacciones: aumenta efecto de warfarina, lamotrigina y fenobarbital",
        "Pancreatitis aguda (rara pero potencialmente grave) — clínica abdominal = suspender y analítica"
      ]
    },
    presentaciones: [
      {
        label: "1600 mg / 500 ml Dx5%",
        dosis_mg: 1600, dilucion_ml: 500, suero: "Dx5%",
        concMgMl: 1600 / 500,                 // 3,2 mg/ml
        dosisRange: "1 mg/kg/h",
        dosisMin: 1, softMax: 1.5, hardMax: 2.0,
        unidad: "mg/kg/h", calcTipo: "mg_kg_h"
      }
    ]
  },

  {
    nombre: "VASOPRESINA",
    categoria: "Vasoactivo",
    isoColor: ISO_COLORS.vasoactivo,
    icono: "💉",
    modos: ["perfusion"],
    info: {
      indicaciones: [
        "Shock séptico refractario a noradrenalina — coadyuvante vasopresor (dosis fija 0,03-0,04 UI/min)",
        "Shock vasopléjico postcirugía cardíaca y poscirculación extracorpórea",
        "Diabetes insípida central — sustitución de ADH endógena (uso off-label IV en UCI)"
      ],
      contraindicaciones: [
        "Cardiopatía isquémica activa grave (vasoconstricción coronaria)",
        "Isquemia mesentérica activa"
      ],
      precauciones: [
        "Isquemia periférica, coronaria y mesentérica a dosis altas — no superar 0,04 UI/min en shock séptico",
        "Vía central obligatoria — irritante y vasoconstrictor potente en vía periférica",
        "No titular al alza en shock séptico — usar siempre dosis fija como complemento a noradrenalina",
        "Hiponatremia con uso prolongado (efecto antidiurético)"
      ]
    },
    presentaciones: [
      {
        label: "100 UI / 500 ml SSF",
        dosis_mg: 100, dilucion_ml: 500, suero: "SSF",
        concMgMl: 100 / 500,                  // 0,2 UI/ml (UI tratadas como mg)
        dosisRange: "0,5 – 2,4 UI/h",
        dosisMin: 0.5, softMax: 2.4, hardMax: 4,
        unidad: "UI/h", calcTipo: "mg_h"
      }
    ]
  }
];

// Categorías únicas para filtrado
const categorias = [...new Set(farmacos.map(f => f.categoria))].sort();
