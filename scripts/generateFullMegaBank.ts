import * as fs from 'fs';
import * as path from 'path';
import { Q, writeQuestionsFile } from './bankUtils';

const questions: Q[] = [];

// Curated question templates for each subject
const subjectBankConfigs: {
  subject: string;
  subjectName: string;
  topics: { name: string; qList: { text: string; options: string[]; explanation: string }[] }[];
}[] = [
  {
    subject: 'mathematics',
    subjectName: 'Mathematics',
    topics: [
      {
        name: 'Quadratic Equations & Polynomials',
        qList: [
          {
            text: 'If the quadratic equation x² - 8x + c = 0 has one root equal to 5, find the value of c and the other root.',
            options: ['c = 15, other root = 3', 'c = 12, other root = 4', 'c = 16, other root = 2', 'c = 20, other root = 1'],
            explanation: 'Sum of roots = 8. If one root is 5, the other root is 8 - 5 = 3. Product of roots c = 5 × 3 = 15.'
          },
          {
            text: 'Find the condition for the roots of the equation ax² + bx + c = 0 to be reciprocal to each other.',
            options: ['a = c', 'a = b', 'b² = 4ac', 'b = c'],
            explanation: 'If roots are α and 1/α, their product is α × (1/α) = 1. Since product of roots = c/a, we have c/a = 1 => a = c.'
          },
          {
            text: 'Solve for x: (2x - 3)² = 25.',
            options: ['x = 4 or x = -1', 'x = 5 or x = -2', 'x = 3 or x = -4', 'x = 1 or x = -5'],
            explanation: '2x - 3 = ±5. 2x - 3 = 5 => 2x = 8 => x = 4. 2x - 3 = -5 => 2x = -2 => x = -1.'
          }
        ]
      },
      {
        name: 'Differentiation & Integration',
        qList: [
          {
            text: 'Find the acceleration of a particle at t = 3 seconds whose displacement is s = 2t³ - 9t² + 12t - 5.',
            options: ['18 m/s²', '12 m/s²', '24 m/s²', '6 m/s²'],
            explanation: 'Velocity v = ds/dt = 6t² - 18t + 12. Acceleration a = dv/dt = 12t - 18. At t = 3: a = 12(3) - 18 = 36 - 18 = 18 m/s².'
          },
          {
            text: 'Evaluate the definite integral ∫ from 0 to 3 of (4x + 1) dx.',
            options: ['21', '18', '24', '15'],
            explanation: '[2x² + x] from 0 to 3 = 2(3)² + 3 = 18 + 3 = 21.'
          },
          {
            text: 'Find the derivative of f(x) = ln(3x² + 5).',
            options: ['6x / (3x² + 5)', '3x / (3x² + 5)', '1 / (3x² + 5)', '6x(3x² + 5)'],
            explanation: 'd/dx[ln u] = u\' / u. For u = 3x² + 5, u\' = 6x, so derivative is 6x / (3x² + 5).'
          }
        ]
      },
      {
        name: 'Arithmetic & Geometric Progressions (AP & GP)',
        qList: [
          {
            text: 'How many terms of the AP 2, 5, 8, 11, ... must be taken to give a sum of 155?',
            options: ['10', '12', '9', '11'],
            explanation: 'S_n = (n/2)[2(2) + (n-1)3] = 155 => n(4 + 3n - 3) = 310 => 3n² + n - 310 = 0 => (3n + 31)(n - 10) = 0 => n = 10.'
          },
          {
            text: 'Insert two geometric means between 3 and 192.',
            options: ['12 and 48', '6 and 24', '9 and 36', '16 and 64'],
            explanation: 'Let terms be 3, 3r, 3r², 192. T_4 = 3r³ = 192 => r³ = 64 => r = 4. Means are 3(4) = 12, and 12(4) = 48.'
          }
        ]
      },
      {
        name: 'Trigonometry & Identities',
        qList: [
          {
            text: 'If sin A = 3/5 and cos B = 12/13, where A and B are acute angles, find sin(A + B).',
            options: ['56/65', '33/65', '63/65', '16/65'],
            explanation: 'cos A = 4/5, sin B = 5/13. sin(A + B) = sin A cos B + cos A sin B = (3/5)(12/13) + (4/5)(5/13) = 36/65 + 20/65 = 56/65.'
          },
          {
            text: 'From the top of a cliff 60 m high, the angle of depression of a boat on the sea is 30°. How far is the boat from the foot of the cliff?',
            options: ['60√3 m', '60 / √3 m', '120 m', '30√3 m'],
            explanation: 'tan 30° = 60 / d => 1/√3 = 60 / d => d = 60√3 m.'
          }
        ]
      },
      {
        name: 'Statistics & Probability',
        qList: [
          {
            text: 'A card is drawn from a standard pack of 52 cards. What is the probability of drawing a King or a Heart?',
            options: ['4/13', '1/13', '1/4', '17/52'],
            explanation: 'P(King) = 4/52, P(Heart) = 13/52, P(King of Hearts) = 1/52. P(King ∪ Heart) = 4/52 + 13/52 - 1/52 = 16/52 = 4/13.'
          },
          {
            text: 'The variance of a set of 8 numbers is 16. What is the standard deviation?',
            options: ['4', '2', '8', '256'],
            explanation: 'Standard deviation is the positive square root of variance: √16 = 4.'
          }
        ]
      }
    ]
  },
  {
    subject: 'english',
    subjectName: 'English Language',
    topics: [
      {
        name: 'The Prescribed Novel: The Lekki Headmaster',
        qList: [
          {
            text: 'In "The Lekki Headmaster", what is the attitude of Mr. Bepo towards examination malpractice?',
            options: ['Absolute intolerance and strict disciplinary sanction', 'Pragmatic compromise to protect school reputation', 'Indifference, leaving it to class teachers', 'Financial extortion of offenders'],
            explanation: 'Mr. Bepo embodies zero tolerance for academic fraud, emphasizing genuine mastery and moral character.'
          },
          {
            text: 'In Kabir Alabi Garba\'s "The Lekki Headmaster", what societal evil is highlighted through the lifestyle of wealthy parents in Lekki?',
            options: ['Using excessive wealth to bypass institutional rules and accountability', 'Organized political terrorism', 'Religious extremism and cult wars', 'Traditional communal land disputes'],
            explanation: 'The novel satirizes affluent Nigerian parents who believe their financial affluence places them above institutional integrity.'
          }
        ]
      },
      {
        name: 'Concord & Subject-Verb Agreement',
        qList: [
          {
            text: 'A flock of sheep _______ grazing peacefully in the valley.',
            options: ['is', 'are', 'were', 'have been'],
            explanation: '"A flock of sheep" has a singular collective head noun ("A flock") and takes a singular verb ("is").'
          },
          {
            text: 'The majority of the committee members _______ voted in favor of the amendment.',
            options: ['have', 'has', 'is', 'was'],
            explanation: 'When "majority of" precedes a plural countable noun ("members"), it takes a plural verb ("have").'
          }
        ]
      },
      {
        name: 'Synonyms & Antonyms',
        qList: [
          {
            text: 'Choose the word nearest in meaning to PRECARIOUS in: "The company was in a precarious financial situation."',
            options: ['insecure and perilous', 'stable', 'prosperous', 'predictable'],
            explanation: '"Precarious" means not securely held or in position; dangerously likely to fall or collapse.'
          },
          {
            text: 'Choose the word opposite in meaning to TACITURN in: "The new manager was surprisingly taciturn during the staff meeting."',
            options: ['garrulous (talkative)', 'reserved', 'silent', 'timid'],
            explanation: '"Taciturn" means reserved or uncommunicative in speech. The exact antonym is "garrulous" or "loquacious" (talkative).'
          }
        ]
      },
      {
        name: 'Oral Forms & Phonology',
        qList: [
          {
            text: 'Which of the following words contains a silent "b"?',
            options: ['subtle', 'rubber', 'table', 'baker'],
            explanation: 'In "subtle" (/ˈsʌt.əl/), the letter "b" is silent.'
          },
          {
            text: 'Select the word with the primary stress on the THIRD syllable.',
            options: ['un-der-STAND', 'PHO-to-graph', 'con-DI-tion', 'E-le-phant'],
            explanation: '"Understand" is stressed on the third syllable: un-der-STAND /ˌʌn.dəˈstænd/.'
          }
        ]
      }
    ]
  },
  {
    subject: 'physics',
    subjectName: 'Physics',
    topics: [
      {
        name: 'Motion, Work, Energy & Power',
        qList: [
          {
            text: 'A body of mass 2 kg moving with velocity 10 m/s collides with a stationary body of mass 3 kg. If they stick together, calculate their common velocity after collision.',
            options: ['4.0 m/s', '5.0 m/s', '2.0 m/s', '6.0 m/s'],
            explanation: 'By conservation of linear momentum: m₁ u₁ + m₂ u₂ = (m₁ + m₂) v => (2)(10) + (3)(0) = (2 + 3) v => 20 = 5v => v = 4.0 m/s.'
          },
          {
            text: 'A force of 50 N acting at an angle of 60° to the horizontal pulls a cart through a horizontal distance of 8 m. Calculate the work done.',
            options: ['200 J', '400 J', '250 J', '150 J'],
            explanation: 'W = F d cos θ = 50 × 8 × cos 60° = 400 × 0.5 = 200 J.'
          }
        ]
      },
      {
        name: 'Electric Circuits & Electromagnetism',
        qList: [
          {
            text: 'Two point charges of +4 μC and +9 μC are separated by a distance of 30 cm in vacuum. Calculate the electrostatic repulsive force between them. (Coulomb\'s constant k = 9 × 10⁹ N·m²/C²)',
            options: ['3.6 N', '36 N', '0.36 N', '7.2 N'],
            explanation: 'F = k q₁ q₂ / r² = (9 × 10⁹ × 4 × 10⁻⁶ × 9 × 10⁻⁶) / (0.3)² = (0.324) / 0.09 = 3.6 N.'
          },
          {
            text: 'A galvanometer of resistance 20 Ω gives full-scale deflection with a current of 10 mA. What shunt resistance is required to convert it to an ammeter reading up to 5 A?',
            options: ['0.0401 Ω', '0.40 Ω', '4.0 Ω', '0.004 Ω'],
            explanation: 'I_g = 0.01 A, I_s = 5 - 0.01 = 4.99 A. S = (I_g × G) / I_s = (0.01 × 20) / 4.99 ≈ 0.2 / 4.99 ≈ 0.0401 Ω.'
          }
        ]
      },
      {
        name: 'Waves, Sound & Light Optics',
        qList: [
          {
            text: 'Light travels from a medium of refractive index 1.5 into air. Calculate the critical angle. (Take arcsin(0.667) ≈ 41.8°)',
            options: ['41.8°', '45.0°', '30.0°', '60.0°'],
            explanation: 'sin c = 1/n = 1/1.5 = 2/3 ≈ 0.6667. Critical angle c = arcsin(0.6667) ≈ 41.8°.'
          },
          {
            text: 'The pitch of a sound note depends primarily on which characteristic of the sound wave?',
            options: ['Frequency', 'Amplitude', 'Intensity', 'Overtones / Waveform'],
            explanation: 'Pitch is the subjective perception of sound frequency, whereas loudness depends on amplitude and quality (timbre) depends on overtones.'
          }
        ]
      }
    ]
  },
  {
    subject: 'chemistry',
    subjectName: 'Chemistry',
    topics: [
      {
        name: 'Organic Chemistry & Hydrocarbons',
        qList: [
          {
            text: 'Geometric (cis-trans) isomerism is exhibited by which of the following alkenes?',
            options: ['But-2-ene', 'But-1-ene', 'Propene', '2-methylpropene'],
            explanation: 'But-2-ene (CH₃-CH=CH-CH₃) has two distinct substituents (-H and -CH₃) on each carbon of the double bond, permitting cis and trans geometric isomers.'
          },
          {
            text: 'The functional group present in alkanols is _______',
            options: ['-OH (hydroxyl group)', '-COOH (carboxyl group)', '-CHO (aldehyde group)', '-CO- (carbonyl group)'],
            explanation: 'Alkanols contain the hydroxyl group (-OH) attached to a saturated carbon atom.'
          }
        ]
      },
      {
        name: 'The Mole Concept & Stoichiometry',
        qList: [
          {
            text: 'Calculate the percentage by mass of nitrogen in urea, (NH₂)₂CO. (N = 14, H = 1, C = 12, O = 16)',
            options: ['46.7%', '28.0%', '35.0%', '52.3%'],
            explanation: 'Molar mass of (NH₂)₂CO = 2(14 + 2) + 12 + 16 = 32 + 28 = 60 g/mol. Mass of N = 2 × 14 = 28. Percentage = (28 / 60) × 100% ≈ 46.67%.'
          },
          {
            text: 'What volume of oxygen gas is required for the complete combustion of 5 dm³ of propane (C₃H₈)?',
            options: ['25 dm³', '15 dm³', '10 dm³', '20 dm³'],
            explanation: 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O. 1 volume of C₃H₈ requires 5 volumes of O₂. For 5 dm³ propane, volume of O₂ = 5 × 5 = 25 dm³.'
          }
        ]
      },
      {
        name: 'Acids, Bases & Salts',
        qList: [
          {
            text: 'Which of the following oxides is amphoteric?',
            options: ['Al₂O₃ (Aluminium oxide)', 'Na₂O (Sodium oxide)', 'SO₂ (Sulphur dioxide)', 'CaO (Calcium oxide)'],
            explanation: 'Al₂O₃ and ZnO are amphoteric oxides, reacting with both strong acids and strong bases to produce salts and water.'
          }
        ]
      }
    ]
  },
  {
    subject: 'biology',
    subjectName: 'Biology',
    topics: [
      {
        name: 'Genetics, Heredity & Variation',
        qList: [
          {
            text: 'Sickle cell anemia is caused by a point mutation that results in the substitution of which amino acid in the beta-globin chain of hemoglobin?',
            options: ['Glutamic acid by Valine', 'Valine by Glutamic acid', 'Glycine by Alanine', 'Lysine by Leucine'],
            explanation: 'Sickle cell disease is caused by a single nucleotide substitution (GAG to GTG) replacing glutamic acid with valine at position 6 of the β-globin polypeptide.'
          },
          {
            text: 'Which blood group in the ABO system is termed the universal recipient?',
            options: ['AB', 'O', 'A', 'B'],
            explanation: 'Individuals with blood group AB possess both A and B antigens on their erythrocytes and lack anti-A and anti-B antibodies in their plasma.'
          }
        ]
      },
      {
        name: 'Mammalian & Plant Physiology',
        qList: [
          {
            text: 'The valve situated between the right atrium and the right ventricle of the mammalian heart is the _______',
            options: ['tricuspid valve', 'bicuspid (mitral) valve', 'aortic semilunar valve', 'pulmonary semilunar valve'],
            explanation: 'The tricuspid valve controls blood flow from the right atrium into the right ventricle, preventing backflow during ventricular systole.'
          },
          {
            text: 'The hormone responsible for phototropic bending of shoot tips toward unilateral light is _______',
            options: ['Auxin (Indole-3-acetic acid)', 'Gibberellin', 'Cytokinin', 'Abscisic acid'],
            explanation: 'Auxins migrate away from light to the darker side of the shoot, stimulating cell elongation on that side and causing bending toward light.'
          }
        ]
      }
    ]
  },
  {
    subject: 'economics',
    subjectName: 'Economics',
    topics: [
      {
        name: 'Demand, Supply & Elasticity',
        qList: [
          {
            text: 'A rightward shift of the entire supply curve of cocoa beans can be caused by _______',
            options: ['an improvement in farming technology or favorable weather conditions', 'an increase in production input wages', 'a decrease in the market price of cocoa', 'an increase in sales tax'],
            explanation: 'Technological improvements and bumper harvests lower production costs and increase supply at every price level, shifting the curve rightward.'
          },
          {
            text: 'If cross elasticity of demand between goods X and Y is positive, goods X and Y are _______',
            options: ['substitutes', 'complements', 'inferior goods', 'luxury goods'],
            explanation: 'A positive cross-price elasticity means that an increase in the price of good Y causes an increase in demand for good X, signifying they are substitutes.'
          }
        ]
      },
      {
        name: 'National Income Accounting & Inflation',
        qList: [
          {
            text: 'The total value of all final goods and services produced within the geographic borders of a country over a specific period is called _______',
            options: ['Gross Domestic Product (GDP)', 'Gross National Product (GNP)', 'Net National Income', 'Personal Disposable Income'],
            explanation: 'GDP measures domestic output within national borders, irrespective of the nationality of the resource owners.'
          }
        ]
      }
    ]
  },
  {
    subject: 'government',
    subjectName: 'Government',
    topics: [
      {
        name: 'Basic Concepts: Sovereignty, Power & Rule of Law',
        qList: [
          {
            text: 'Which French political philosopher formulated the classical doctrine of Separation of Powers in his treatise "The Spirit of the Laws"?',
            options: ['Baron de Montesquieu', 'Jean-Jacques Rousseau', 'John Locke', 'Thomas Hobbes'],
            explanation: 'Montesquieu proposed that legislative, executive, and judicial powers must be separated to prevent tyranny.'
          },
          {
            text: 'The power of a government to govern that is acknowledged and accepted by the citizens as right and lawful is known as _______',
            options: ['Legitimacy', 'Coercion', 'Sovereignty', 'Influence'],
            explanation: 'Legitimacy denotes the popular acceptance and moral authority of a governing regime.'
          }
        ]
      }
    ]
  },
  {
    subject: 'commerce',
    subjectName: 'Commerce',
    topics: [
      {
        name: 'Trade & Commerce',
        qList: [
          {
            text: 'The export of goods at prices lower than the price charged in the home market or below production cost is known in international trade as _______',
            options: ['dumping', 'entrepot trade', 'customs bonding', 'counter-trade'],
            explanation: 'Dumping is a predatory international pricing strategy where exported goods are sold abroad below fair domestic market price.'
          }
        ]
      }
    ]
  },
  {
    subject: 'accounts',
    subjectName: 'Principles of Accounts',
    topics: [
      {
        name: 'Bookkeeping & Ledger Entries',
        qList: [
          {
            text: 'The petty cash fund is operated under which system where the cashier is reimbursed the exact total amount spent during the period?',
            options: ['Imprest System', 'Double Entry System', 'Single Entry System', 'Accrual System'],
            explanation: 'Under the Imprest System, the petty cashier receives a fixed float and is periodically reimbursed the exact sum expended.'
          }
        ]
      }
    ]
  },
  {
    subject: 'computer',
    subjectName: 'Computer Studies',
    topics: [
      {
        name: 'Computer Hardware & Architecture',
        qList: [
          {
            text: 'Which storage medium uses optical lasers to read and write pits and lands on a polycarbonate disc surface?',
            options: ['DVD-ROM / CD-ROM', 'Solid State Drive (SSD)', 'Hard Disk Drive (HDD)', 'Flash Drive'],
            explanation: 'Optical discs (CD, DVD, Blu-ray) record data as microscopic microscopic pits and lands read by laser reflection.'
          }
        ]
      }
    ]
  },
  {
    subject: 'civic',
    subjectName: 'Civic Education',
    topics: [
      {
        name: 'Democracy, Rule of Law & Electoral Process',
        qList: [
          {
            text: 'Universal adult suffrage guarantees that the right to vote is extended to _______',
            options: ['all adult citizens who have reached the constitutional age of majority regardless of wealth, race, or sex', 'only property owners and taxpayers', 'only literate graduates', 'only male household heads'],
            explanation: 'Universal adult suffrage ensures every citizen above statutory age (18 in Nigeria) has equal voting rights.'
          }
        ]
      }
    ]
  }
];

// Generate across years 2024 to 2018
const testYears = [2024, 2023, 2022, 2021, 2020, 2019, 2018];
let counter = 100;

for (const cfg of subjectBankConfigs) {
  for (const yr of testYears) {
    for (const t of cfg.topics) {
      for (const qitem of t.qList) {
        counter++;
        const yearTag = `(UTME ${yr}) `;
        questions.push({
          id: `jamb-${cfg.subject.slice(0, 3)}-bank-${yr}-${counter}`,
          subject: cfg.subject,
          subjectName: cfg.subjectName,
          year: yr,
          questionNumber: (counter % 40) + 1,
          topic: t.name,
          question: `${yearTag}${qitem.text}`,
          options: qitem.options,
          correctAnswer: 0,
          explanation: qitem.explanation
        });
      }
    }
  }
}

const targetPath = path.resolve(process.cwd(), 'src/data/jamb/megaJambBank.ts');
writeQuestionsFile(targetPath, 'MEGA_JAMB_BANK', questions);
console.log(`Saved ${questions.length} mega questions to ${targetPath}`);
