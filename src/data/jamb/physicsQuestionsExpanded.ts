import { JambQuestion } from '../jambQuestions';

export const PHYSICS_QUESTIONS_EXPANDED: JambQuestion[] = [
  {
    "id": "jamb-phy-2024-05",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2024,
    "questionNumber": 5,
    "topic": "Waves & Sound Acoustics",
    "question": "A sound wave of frequency 512 Hz travels through air at 340 m/s. Calculate its wavelength.",
    "options": [
      "0.66 m",
      "1.51 m",
      "0.33 m",
      "1.74 m"
    ],
    "correctAnswer": 0,
    "explanation": "v = fλ => λ = v / f = 340 / 512 ≈ 0.664 m."
  },
  {
    "id": "jamb-phy-2024-06",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2024,
    "questionNumber": 6,
    "topic": "Electrostatics & Capacitors",
    "question": "Two capacitors of capacitances 4 μF and 6 μF are connected in series across a 100 V DC source. Calculate the equivalent capacitance.",
    "options": [
      "2.4 μF",
      "10 μF",
      "5 μF",
      "1.2 μF"
    ],
    "correctAnswer": 0,
    "explanation": "For capacitors in series: 1/C_eq = 1/C₁ + 1/C₂ = 1/4 + 1/6 = (3 + 2)/12 = 5/12 => C_eq = 12/5 = 2.4 μF."
  },
  {
    "id": "jamb-phy-2024-07",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2024,
    "questionNumber": 7,
    "topic": "Electromagnetic Induction",
    "question": "A transformer has 500 turns in the primary coil and 100 turns in the secondary coil. If an AC voltage of 220 V is applied to the primary, calculate the secondary voltage.",
    "options": [
      "44 V",
      "1100 V",
      "22 V",
      "88 V"
    ],
    "correctAnswer": 0,
    "explanation": "Transformer equation: V_s / V_p = N_s / N_p => V_s = V_p × (N_s / N_p) = 220 × (100 / 500) = 220 × (1/5) = 44 V."
  },
  {
    "id": "jamb-phy-2024-08",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2024,
    "questionNumber": 8,
    "topic": "Radioactivity: Half-life",
    "question": "A radioactive sample has a half-life of 4 hours. What fraction of the original radioactive nuclei remains undecayed after 16 hours?",
    "options": [
      "1/16",
      "1/8",
      "1/4",
      "1/32"
    ],
    "correctAnswer": 0,
    "explanation": "Number of half-lives n = total time / half-life = 16 / 4 = 4. Remaining fraction = (1/2)ⁿ = (1/2)⁴ = 1/16."
  },
  {
    "id": "jamb-phy-2024-09",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2024,
    "questionNumber": 9,
    "topic": "Photoelectric Effect",
    "question": "The minimum frequency of radiation required to eject electrons from a metal surface is known as the _______",
    "options": [
      "threshold frequency",
      "stopping potential",
      "cutoff wavelength",
      "work function"
    ],
    "correctAnswer": 0,
    "explanation": "Threshold frequency (f₀) is the minimum frequency of incident photons below which no photoelectrons are emitted from the metal surface, regardless of intensity."
  },
  {
    "id": "jamb-phy-2023-03",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2023,
    "questionNumber": 3,
    "topic": "Newton's Laws of Motion & Momentum",
    "question": "A bullet of mass 0.05 kg travelling at 400 m/s penetrates a wooden block and comes to rest in 0.02 seconds. Calculate the average retarding force exerted by the block.",
    "options": [
      "1000 N",
      "500 N",
      "2000 N",
      "400 N"
    ],
    "correctAnswer": 0,
    "explanation": "Impulse = Change in momentum = F × Δt = m(v - u) => F × 0.02 = 0.05 × (0 - 400) = -20 => F = -20 / 0.02 = -1000 N (magnitude is 1000 N)."
  },
  {
    "id": "jamb-phy-2023-04",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2023,
    "questionNumber": 4,
    "topic": "Gas Laws: Boyle's and Charles'",
    "question": "A fixed mass of gas occupies 300 cm³ at 27°C. What volume will it occupy at 127°C if the pressure is maintained constant?",
    "options": [
      "400 cm³",
      "350 cm³",
      "450 cm³",
      "250 cm³"
    ],
    "correctAnswer": 0,
    "explanation": "Charles's Law: V₁/T₁ = V₂/T₂. Temperatures must be in Kelvin: T₁ = 27 + 273 = 300 K; T₂ = 127 + 273 = 400 K. V₂ = V₁ × (T₂ / T₁) = 300 × (400 / 300) = 400 cm³."
  },
  {
    "id": "jamb-phy-2023-05",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2023,
    "questionNumber": 5,
    "topic": "Thin Lenses & Optical Instruments",
    "question": "An object is placed 15 cm in front of a converging lens of focal length 10 cm. Find the image distance.",
    "options": [
      "30 cm",
      "25 cm",
      "20 cm",
      "15 cm"
    ],
    "correctAnswer": 0,
    "explanation": "Lens formula: 1/f = 1/u + 1/v => 1/10 = 1/15 + 1/v => 1/v = 1/10 - 1/15 = (3 - 2)/30 = 1/30 => v = 30 cm."
  },
  {
    "id": "jamb-phy-2023-06",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2023,
    "questionNumber": 6,
    "topic": "Current Electricity: Ohm's Law",
    "question": "Three resistors of resistances 2 Ω, 3 Ω, and 6 Ω are connected in parallel. Find the equivalent resistance.",
    "options": [
      "1 Ω",
      "11 Ω",
      "2 Ω",
      "0.5 Ω"
    ],
    "correctAnswer": 0,
    "explanation": "1/R_eq = 1/2 + 1/3 + 1/6 = (3 + 2 + 1)/6 = 6/6 = 1 => R_eq = 1 Ω."
  },
  {
    "id": "jamb-phy-2023-07",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2023,
    "questionNumber": 7,
    "topic": "Pressure in Fluids",
    "question": "Calculate the pressure exerted at a depth of 20 m below the surface of water. (Density of water = 1000 kg/m³, g = 10 m/s², atmospheric pressure = 1.01 × 10⁵ N/m²).",
    "options": [
      "3.01 × 10⁵ N/m²",
      "2.00 × 10⁵ N/m²",
      "1.01 × 10⁵ N/m²",
      "4.01 × 10⁵ N/m²"
    ],
    "correctAnswer": 0,
    "explanation": "Total pressure = P_atm + ρgh = 1.01 × 10⁵ + (1000 × 10 × 20) = 1.01 × 10⁵ + 2.00 × 10⁵ = 3.01 × 10⁵ N/m²."
  },
  {
    "id": "jamb-phy-2022-01",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2022,
    "questionNumber": 1,
    "topic": "Projectiles & Trajectory",
    "question": "A ball is projected with an initial velocity of 40 m/s at an angle of 30° to the horizontal. Calculate its time of flight. (Take g = 10 m/s²)",
    "options": [
      "4.0 s",
      "2.0 s",
      "8.0 s",
      "3.5 s"
    ],
    "correctAnswer": 0,
    "explanation": "Time of flight T = (2u sin θ) / g = (2 × 40 × sin 30°) / 10 = (80 × 0.5) / 10 = 40 / 10 = 4.0 s."
  },
  {
    "id": "jamb-phy-2022-02",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2022,
    "questionNumber": 2,
    "topic": "Heat Capacity & Latent Heat",
    "question": "Calculate the heat energy required to completely melt 2 kg of ice at 0°C without a temperature change. (Specific latent heat of fusion of ice = 3.36 × 10⁵ J/kg)",
    "options": [
      "6.72 × 10⁵ J",
      "1.68 × 10⁵ J",
      "3.36 × 10⁵ J",
      "8.40 × 10⁵ J"
    ],
    "correctAnswer": 0,
    "explanation": "Q = mL_f = 2 kg × 3.36 × 10⁵ J/kg = 6.72 × 10⁵ J."
  },
  {
    "id": "jamb-phy-2022-03",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2022,
    "questionNumber": 3,
    "topic": "Light: Total Internal Reflection",
    "question": "The critical angle for light passing from glass into air is 42°. Calculate the refractive index of the glass.",
    "options": [
      "1.49",
      "1.33",
      "1.66",
      "1.25"
    ],
    "correctAnswer": 0,
    "explanation": "n = 1 / sin(c) = 1 / sin(42°) = 1 / 0.6691 ≈ 1.49."
  },
  {
    "id": "jamb-phy-2022-04",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2022,
    "questionNumber": 4,
    "topic": "Alternating Current (A.C.) Circuits",
    "question": "In an AC circuit, the root-mean-square (r.m.s.) voltage V_rms is related to the peak voltage V₀ by _______",
    "options": [
      "V_rms = V₀ / √2",
      "V_rms = V₀ × √2",
      "V_rms = V₀ / 2",
      "V_rms = 2V₀"
    ],
    "correctAnswer": 0,
    "explanation": "For a sinusoidal alternating voltage, V_rms = V₀ / √2 ≈ 0.707 V₀."
  },
  {
    "id": "jamb-phy-2021-01",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2021,
    "questionNumber": 1,
    "topic": "Work, Energy and Power",
    "question": "An electric motor raises a load of 500 N through a vertical height of 12 m in 10 seconds. Calculate the power developed by the motor.",
    "options": [
      "600 W",
      "60 W",
      "6000 W",
      "120 W"
    ],
    "correctAnswer": 0,
    "explanation": "Work done = Force × distance = 500 × 12 = 6000 J. Power = Work / time = 6000 / 10 = 600 W."
  },
  {
    "id": "jamb-phy-2021-02",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2021,
    "questionNumber": 2,
    "topic": "Simple Harmonic Motion (SHM)",
    "question": "A simple pendulum of length 1.0 m oscillates with small amplitude. Find its period of oscillation. (Take g = 9.8 m/s², π = 3.142)",
    "options": [
      "2.01 s",
      "1.42 s",
      "3.14 s",
      "0.98 s"
    ],
    "correctAnswer": 0,
    "explanation": "Period T = 2π√(L/g) = 2(3.142)√(1.0 / 9.8) = 6.284 × √(0.102) = 6.284 × 0.3194 ≈ 2.01 s."
  },
  {
    "id": "jamb-phy-2021-03",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2021,
    "questionNumber": 3,
    "topic": "Magnetic Fields & Forces on Conductors",
    "question": "A straight wire of length 0.5 m carrying a current of 4 A is placed perpendicular to a uniform magnetic field of flux density 0.8 T. Find the magnetic force on the wire.",
    "options": [
      "1.6 N",
      "0.8 N",
      "3.2 N",
      "0.4 N"
    ],
    "correctAnswer": 0,
    "explanation": "F = B I L sin θ = 0.8 × 4 × 0.5 × sin 90° = 1.6 N."
  },
  {
    "id": "jamb-phy-2024-11",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2024,
    "questionNumber": 11,
    "topic": "Motion, Work, Energy & Power",
    "question": "A car of mass 1200 kg accelerates uniformly from rest to a speed of 25 m/s in 10 seconds. Calculate the work done by the engine.",
    "options": [
      "375 kJ",
      "300 kJ",
      "450 kJ",
      "150 kJ"
    ],
    "correctAnswer": 0,
    "explanation": "Work done equals kinetic energy gained: W = 1/2 m v² = 1/2 × 1200 × (25)² = 600 × 625 = 375,000 J = 375 kJ."
  },
  {
    "id": "jamb-phy-2024-12",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2024,
    "questionNumber": 12,
    "topic": "Electric Circuits & Electromagnetism",
    "question": "Three resistors of 3 Ω, 6 Ω, and 2 Ω are connected in parallel. What is their equivalent resistance?",
    "options": [
      "1.0 Ω",
      "2.0 Ω",
      "11.0 Ω",
      "0.5 Ω"
    ],
    "correctAnswer": 0,
    "explanation": "1/R_eq = 1/3 + 1/6 + 1/2 = 2/6 + 1/6 + 3/6 = 6/6 = 1. Therefore R_eq = 1.0 Ω."
  },
  {
    "id": "jamb-phy-2024-13",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2024,
    "questionNumber": 13,
    "topic": "Waves, Sound & Light Optics",
    "question": "A concave mirror has a focal length of 15 cm. If an object is placed 30 cm in front of the mirror, where is the image formed?",
    "options": [
      "30 cm in front of the mirror (real and inverted)",
      "15 cm behind the mirror (virtual)",
      "10 cm in front of the mirror",
      "45 cm behind the mirror"
    ],
    "correctAnswer": 0,
    "explanation": "1/f = 1/u + 1/v => 1/15 = 1/30 + 1/v => 1/v = 1/15 - 1/30 = 1/30 => v = 30 cm. Since object is at the center of curvature (C = 2f = 30 cm), a real, inverted image of the same size is formed at C."
  },
  {
    "id": "jamb-phy-2024-14",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2024,
    "questionNumber": 14,
    "topic": "Atomic & Nuclear Physics",
    "question": "A radioactive isotope has a half-life of 4 hours. What fraction of the original sample remains after 16 hours?",
    "options": [
      "1/16",
      "1/8",
      "1/4",
      "1/32"
    ],
    "correctAnswer": 0,
    "explanation": "Number of half-lives n = 16 / 4 = 4. Remaining fraction = (1/2)⁴ = 1/16."
  },
  {
    "id": "jamb-phy-2024-15",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2024,
    "questionNumber": 15,
    "topic": "Thermal Physics & Heat Transfer",
    "question": "How much heat is required to convert 2 kg of ice at 0°C to water at 0°C? (Specific latent heat of fusion of ice = 3.36 × 10⁵ J/kg)",
    "options": [
      "6.72 × 10⁵ J",
      "3.36 × 10⁵ J",
      "1.68 × 10⁵ J",
      "8.40 × 10⁵ J"
    ],
    "correctAnswer": 0,
    "explanation": "Q = m L_f = 2 kg × 3.36 × 10⁵ J/kg = 6.72 × 10⁵ J."
  },
  {
    "id": "jamb-phy-2023-01",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2023,
    "questionNumber": 1,
    "topic": "Motion, Work, Energy & Power",
    "question": "A projectile is launched with an initial velocity of 50 m/s at an angle of 30° to the horizontal. Calculate its time of flight. (Take g = 10 m/s²)",
    "options": [
      "5.0 s",
      "10.0 s",
      "2.5 s",
      "8.66 s"
    ],
    "correctAnswer": 0,
    "explanation": "Time of flight T = (2 u sin θ) / g = (2 × 50 × sin 30°) / 10 = (100 × 0.5) / 10 = 50 / 10 = 5.0 s."
  },
  {
    "id": "jamb-phy-2023-02",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2023,
    "questionNumber": 2,
    "topic": "Electric Circuits & Electromagnetism",
    "question": "Faraday's law of electromagnetic induction states that the induced electromotive force (e.m.f.) is directly proportional to the _______",
    "options": [
      "rate of change of magnetic flux linkage",
      "magnitude of the electric resistance",
      "surface area of the conducting coil",
      "total magnetic field strength alone"
    ],
    "correctAnswer": 0,
    "explanation": "Faraday's law: ε = -N (dΦ/dt), where the induced emf is proportional to the time rate of change of magnetic flux linkage."
  },
  {
    "id": "jamb-phy-2020-01",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2020,
    "questionNumber": 1,
    "topic": "Motion, Work, Energy & Power",
    "question": "An object of mass 4 kg rests on a rough horizontal table. If the coefficient of static friction between the object and the table is 0.4, find the minimum horizontal force required to start moving the object. (Take g = 10 m/s²)",
    "options": [
      "16 N",
      "40 N",
      "4 N",
      "10 N"
    ],
    "correctAnswer": 0,
    "explanation": "F_friction = μ R = μ m g = 0.4 × 4 kg × 10 m/s² = 16 N."
  }
];
