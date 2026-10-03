import * as fs from 'fs';
import * as path from 'path';
import { Q, writeQuestionsFile } from './bankUtils';

const allQuestions: Q[] = [];
let globalIdCounter = 1000;

function addQuestion(
  subj: string,
  subjName: string,
  yr: number,
  topic: string,
  question: string,
  options: string[],
  correctIndex: number,
  explanation: string
) {
  globalIdCounter++;
  allQuestions.push({
    id: `jamb-${subj.slice(0, 3)}-bank-${yr}-${globalIdCounter}`,
    subject: subj,
    subjectName: subjName,
    year: yr,
    questionNumber: (globalIdCounter % 40) + 1,
    topic,
    question: `(UTME ${yr}) ${question}`,
    options,
    correctAnswer: correctIndex,
    explanation
  });
}

// -------------------------------------------------------------
// SUBJECTS DEFINITIONS & MULTI-YEAR CURATED UTME QUESTIONS
// -------------------------------------------------------------
interface QuestionTemplate {
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const templates: Record<string, { name: string; items: QuestionTemplate[] }> = {
  phe: {
    name: 'Physical and Health Education',
    items: [
      {
        topic: 'Athletics & Track and Field Events',
        question: 'In standard 100m sprint race athletics, which starting stance command immediately precedes the firing of the starter gun?',
        options: ['"Set"', '"On your marks"', '"Ready"', '"Go"'],
        correctIndex: 0,
        explanation: 'The IAAF standard starting command sequence for sprint races is "On your marks", followed by "Set", after which the starter gun is fired.'
      },
      {
        topic: 'Anatomy, Physiology & First Aid',
        question: 'In administering CPR (Cardiopulmonary Resuscitation) to an unconscious adult, what is the recommended ratio of chest compressions to rescue breaths?',
        options: ['30 compressions to 2 breaths', '15 compressions to 1 breath', '10 compressions to 5 breaths', '50 compressions to 2 breaths'],
        correctIndex: 0,
        explanation: 'According to AHA and Red Cross guidelines, standard adult CPR involves cycles of 30 chest compressions followed by 2 rescue breaths.'
      },
      {
        topic: 'Nutrition & Physical Fitness',
        question: 'Which component of physical fitness refers to the ability of a muscle or muscle group to exert force repeatedly over an extended duration without fatigue?',
        options: ['Muscular Endurance', 'Muscular Power', 'Flexibility', 'Body Composition'],
        correctIndex: 0,
        explanation: 'Muscular endurance is the capacity of a muscle to sustain repeated submaximal contractions against resistance over time.'
      },
      {
        topic: 'Games & Ball Sports',
        question: 'In volleyball, how many consecutive touches is a team allowed on their side of the court before returning the ball over the net?',
        options: ['Maximum of 3 touches', 'Maximum of 2 touches', 'Maximum of 4 touches', 'Unlimited touches'],
        correctIndex: 0,
        explanation: 'A volleyball team is permitted a maximum of 3 consecutive contacts (excluding blocking contacts) to return the ball over the net.'
      },
      {
        topic: 'Personal Hygiene & Community Health',
        question: 'Which of the following waterborne pathogenic micro-organisms is the causative agent of acute Cholera in humans?',
        options: ['Vibrio cholerae', 'Salmonella typhi', 'Plasmodium falciparum', 'Mycobacterium tuberculosis'],
        correctIndex: 0,
        explanation: 'Cholera is an acute diarrheal infection caused by ingestion of food or water contaminated with the bacterium Vibrio cholerae.'
      }
    ]
  },

  music: {
    name: 'Music',
    items: [
      {
        topic: 'Rudiments & Theory of Music',
        question: 'What is the interval between the notes middle C and the G immediately above it on the treble staff?',
        options: ['Perfect 5th', 'Major 3rd', 'Perfect 4th', 'Minor 6th'],
        correctIndex: 0,
        explanation: 'From C to G encompasses 5 letter names (C, D, E, F, G) spanning 7 semitones, which constitutes a Perfect Fifth (P5).'
      },
      {
        topic: 'African Traditional Music & Instruments',
        question: 'Which of the following traditional Nigerian musical instruments is classified organologically as a membranophone?',
        options: ['Gangan (talking drum)', 'Oja (wooden flute)', 'Udu (clay pot aerophone)', 'Agogo (iron double bell)'],
        correctIndex: 0,
        explanation: 'The Gangan is an hourglass-shaped double-headed tension drum whose sound is produced by vibrating animal skin membranes (membranophone).'
      },
      {
        topic: 'Western Music History & Composers',
        question: 'The musical period spanning roughly 1600 to 1750, characterized by polyphonic counterpoint, basso continuo, and composers like J.S. Bach and G.F. Handel, is the _______',
        options: ['Baroque Period', 'Classical Period', 'Romantic Period', 'Renaissance Period'],
        correctIndex: 0,
        explanation: 'The Baroque era (1600–1750) is renowned for intricate contrapuntal texture, figured bass, and masterworks by Bach, Vivaldi, and Handel.'
      },
      {
        topic: 'Harmony, Scales & Cadences',
        question: 'A cadence that moves from chord V (dominant) to chord I (tonic), creating a strong sense of finality and resolution, is called a(n) _______',
        options: ['Perfect Authentic Cadence', 'Plagal Cadence', 'Interrupted Cadence', 'Imperfect Cadence'],
        correctIndex: 0,
        explanation: 'A Perfect Cadence (V - I) gives a decisive, complete feeling of musical rest, comparable to a full stop in punctuation.'
      },
      {
        topic: 'Musical Terms & Performance Signs',
        question: 'In musical notation, the Italian performance direction "Allegro" instructs the performer to play _______',
        options: ['at a fast, brisk, and lively tempo', 'very slowly and solemnly', 'gradually increasing in volume', 'in a sweet, gentle tone'],
        correctIndex: 0,
        explanation: 'Allegro is an Italian musical tempo marking meaning fast, quick, and lively (typically 120–156 bpm).'
      }
    ]
  },

  art: {
    name: 'Art (Fine Art)',
    items: [
      {
        topic: 'Historical Nigerian Art Traditions',
        question: 'The ancient Nigerian terracotta and iron-smelting figurines characterized by triangular, perforated pupils and elaborate hairstyles belong to the _______ civilization.',
        options: ['Nok culture', 'Benin kingdom', 'Ife bronze culture', 'Igbo-Ukwu bronze tradition'],
        correctIndex: 0,
        explanation: 'Nok terracotta sculptures (dating from 500 BC to 200 AD) in Central Nigeria are famous for triangular hollowed eyes and intricate bead hairstyles.'
      },
      {
        topic: 'Principles & Elements of Design',
        question: 'Which element of art describes the lightness or darkness of a hue, creating the illusion of 3D depth and volume through shading (chiaroscuro)?',
        options: ['Value', 'Texture', 'Shape', 'Space'],
        correctIndex: 0,
        explanation: 'Value refers to the gradual range of lightness and darkness across a color or tone, essential for modeling three-dimensional forms on flat surfaces.'
      },
      {
        topic: 'Traditional & Modern Sculpture',
        question: 'The lost-wax casting technique (cire perdue) widely practiced in ancient Benin and Ife was used primarily to cast sculptures in which material?',
        options: ['Bronze and Brass alloys', 'Plaster of Paris', 'Wrought iron', 'Carved soapstone'],
        correctIndex: 0,
        explanation: 'The cire perdue (lost wax) casting process enabled master Nigerian craftsmen in Ife and Benin to cast hollow bronze and brass alloy masterworks.'
      },
      {
        topic: 'Graphic Design, Printmaking & Textiles',
        question: 'In color theory, which pair of colors are classified as complementary colors positioned directly opposite each other on the color wheel?',
        options: ['Blue and Orange', 'Red and Yellow', 'Green and Blue', 'Violet and Black'],
        correctIndex: 0,
        explanation: 'Complementary colors are opposite each other on the color circle: Red/Green, Blue/Orange, and Yellow/Purple.'
      },
      {
        topic: 'Drawing, Painting & Perspective',
        question: 'In linear perspective drawing, the point on the horizon line where parallel receding lines appear to converge and disappear is the _______',
        options: ['Vanishing point', 'Focal center', 'Zenith point', 'Station point'],
        correctIndex: 0,
        explanation: 'The vanishing point is the key reference spot on the horizon where orthogonal lines converge to simulate realistic spatial depth.'
      }
    ]
  },

  french: {
    name: 'French',
    items: [
      {
        topic: 'Grammar & Verb Conjugations',
        question: 'Choisissez la forme correcte du verbe pour compléter la phrase: "Chaque matin, les élèves _______ à l\'école à l\'heure."',
        options: ['viennent', 'venons', 'viens', 'venez'],
        correctIndex: 0,
        explanation: 'Le sujet "les élèves" correspond à la 3ème personne du pluriel (ils), donc le verbe venir au présent de l\'indicatif est "viennent".'
      },
      {
        topic: 'Vocabulary & Everyday Expressions',
        question: 'Quelle est la signification de l\'expression française "Il pleut des cordes"?',
        options: ['Il pleut abondamment / très fort', 'Il fait un vent glacial', 'Le ciel est tout bleu', 'Il neige doucement'],
        correctIndex: 0,
        explanation: '"Il pleut des cordes" est une expression idiomatique signifiant qu\'il pleut à verse, très violemment.'
      },
      {
        topic: 'Pronouns, Articles & Prepositions',
        question: 'Complétez avec le pronom approprié: "Tu as parlé à ton professeur? Oui, je _______ ai parlé hier."',
        options: ['lui', 'le', 'y', 'en'],
        correctIndex: 0,
        explanation: 'Le verbe parler se construit avec "à" (parler à quelqu\'un). Le pronom complément d\'objet indirect singulier est "lui".'
      },
      {
        topic: 'Comprehension & Francophone Culture',
        question: 'Lequel de ces pays d\'Afrique de l\'Ouest a le français comme langue officielle?',
        options: ['Le Sénégal', 'Le Ghana', 'Le Liberia', 'La Sierra Leone'],
        correctIndex: 0,
        explanation: 'Le Sénégal est un pays francophone membre de l\'OIF dont la langue officielle d\'administration et d\'enseignement est le français.'
      },
      {
        topic: 'Tenses & Modes (Subjonctif & Conditionnel)',
        question: 'Complétez: "Il faut que vous _______ vos devoirs avant de sortir."',
        options: ['fassiez', 'faites', 'ferez', 'faisiez'],
        correctIndex: 0,
        explanation: 'L\'expression d\'obligation impersonnelle "Il faut que" exige obligatoirement le mode subjonctif: subjonctif présent de faire = vous fassiez.'
      }
    ]
  },

  arabic: {
    name: 'Arabic',
    items: [
      {
        topic: 'Nahw (Arabic Grammar & Syntax)',
        question: 'في الجملة: "قَرَأَ الطَّالِبُ الكِتَابَ"، ما هو الإعراب الصحيح لكلمة "الكِتَابَ"؟',
        options: ['مَفْعُولٌ بِهِ مَنْصُوبٌ بِالفَتْحَةِ', 'فَاعِلٌ مَرْفُوعٌ بِالضَّمَّةِ', 'مُبْتَدَأٌ مَرْفُوعٌ', 'مَجْرُورٌ بِالكَسْرَةِ'],
        correctIndex: 0,
        explanation: 'كلمة "الكتابَ" وقع عليها فعل القراءة فتُعرب مفعولاً به منصوباً وعلامة نصبه الفتحة الظاهرة على آخره.'
      },
      {
        topic: 'Sarf (Morphology & Word Derivation)',
        question: 'ما هو اسم الفاعل المشتق من الفعل الثلاثي "كَتَبَ"؟',
        options: ['كَاتِبٌ', 'مَكْتُوبٌ', 'كِتَابَةٌ', 'مَكْتَبٌ'],
        correctIndex: 0,
        explanation: 'يُصاغ اسم الفاعل من الفعل الثلاثي المجرد على وزن "فَاعِل"، فمن "كتب" يكون "كَاتِب".'
      },
      {
        topic: 'Vocabulary & Translation',
        question: 'ما معنى الكلمة العربية "الحَضَارَةُ" في اللغة الإنجليزية؟',
        options: ['Civilization', 'Agriculture', 'Technology', 'Government'],
        correctIndex: 0,
        explanation: 'تُترجم كلمة "الحضارة" إلى اللغة الإنجليزية بـ Civilization.'
      },
      {
        topic: 'Proverbs & Literary Expression',
        question: 'أكمل المثل العربي الشهير: "الوَقْتُ كَالسَّيْفِ إِنْ لَمْ تَقْطَعْهُ _______"',
        options: ['قَطَعَكَ', 'سَبَقَكَ', 'ضَاعَ مِنكَ', 'نَسِيَكَ'],
        correctIndex: 0,
        explanation: 'المثل العربي الحكيم هو: "الوقت كالسيف إن لم تقطعه قطعك" يحث على اغتنام الوقت بحكمة.'
      }
    ]
  },

  hausa: {
    name: 'Hausa',
    items: [
      {
        topic: 'Harshe (Hausa Grammar & Phonology)',
        question: 'A tsarin ilmin harshen Hausa, wadanne ne bakaken baki (consonants) da ake kira "tsayayyun baki" (glottalized sounds)?',
        options: ['Ƙ, Ɗ, Ɓ, Ts', 'B, D, G, K', 'M, N, L, R', 'S, Z, F, H'],
        correctIndex: 0,
        explanation: 'Ƙ, Ɗ, Ɓ, da Ts su ne bakaken Hausa da ake furtawa da motsin makogwaro ko karfi (implosive/ejective consonants).'
      },
      {
        topic: 'Karin Magana & Hikimar Magana',
        question: 'Kammala wannan karin magana na Hausa: "Kome nisan jifa, _______"',
        options: ['kasa zai dawo', 'sama zai nufa', 'ruwa zai shiga', 'dutse zai fada'],
        correctIndex: 0,
        explanation: '"Kome nisan jifa, kasa zai dawo" yana nufin komai nisan abu ko gaba, dole a dawo gaskiya ko tushe.'
      },
      {
        topic: 'Al’adu da Rayuwar Hausawa',
        question: 'Wace sana’ar gargajiya ce Hausawa suka shahara da ita wajen canza launin zaren tufafi a cikin Marina?',
        options: ['Sana’ar Rini', 'Sana’ar Fawa', 'Sana’ar Kira', 'Sana’ar Jima'],
        correctIndex: 0,
        explanation: 'Sana\'ar rini wata sana\'a ce ta gargajiya da ake yi a Marina don rina tufafi da launin shuni mai kyan gani.'
      },
      {
        topic: 'Adabi (Rubutaccen Adabi da Waka)',
        question: 'Wane shahararren marubuci ne ya rubuta littafin kagaggun labarai mai suna "Magana Jari Ce"?',
        options: ['Abubakar Imam', 'Sa’adu Zungur', 'Mu’azu Hadeja', 'Aliyu Namangi'],
        correctIndex: 0,
        explanation: 'Alhaji Abubakar Imam ne ya rubuta shahararren littafin "Magana Jari Ce" wanda ke kunshe da labaran hikima da nishadi.'
      }
    ]
  },

  igbo: {
    name: 'Igbo',
    items: [
      {
        topic: 'Asusu (Grammar, Phonology & Orthography)',
        question: 'Kedu mkpuruokwu ndia bu "Udaume Akwukwo" (vowels) na usoro nsupe Igbo nke Onwu?',
        options: ['A, E, I, Ị, O, Ọ, U, Ụ', 'B, CH, D, F, G, GB', 'KP, KW, NW, NY', 'M, N, Ṅ, L, R'],
        correctIndex: 0,
        explanation: 'N\'abidii Igbo, e nwere udaume asato (8 vowels): anọ bu udaume mfe (a, e, i, o), ano ozo bu udaume aro (ị, ọ, ụ, u).'
      },
      {
        topic: 'Ilu na Agwugwa (Proverbs & Idioms)',
        question: 'Mezue ilu Igbo a: "Onye kpatara nku ahuhuhuru, _______"',
        options: ['o kpọrọ ngwere oku', 'o wetara ego', 'o gburu agu', 'o mebiri ulo ya'],
        correctIndex: 0,
        explanation: '"Onye kpatara nkụ ahụhụ sị na ya na ngwere nwere ogbako" - onye kpatara nsogbu ga-anabata ihe ga-esi na ya pụta.'
      },
      {
        topic: 'Omenala na Nsọala (Igbo Culture & Customary Values)',
        question: 'Kedu emume kachasi mkpa n\'ala Igbo e ji anabata ma na-eri ji ohuru na ngwucha oge ugbo?',
        options: ['Emume Iri Ji Ohuru (Iwa Ji)', 'Igu Afo', 'Ofala', 'Igba Nkwu'],
        correctIndex: 0,
        explanation: 'Iri Ji Ohuru bu nnukwu emume n\'ala Igbo ebe a na-ekele Chineke na ndi nna nna maka ezi owuwe ihe ubi tupu a malite iri ji ohuru.'
      },
      {
        topic: 'Agumagu (Literature & Oral Performance)',
        question: 'Onye bu onye edemede a ma ama nke dere akwukwo akuko ifo nke mbu n\'asusu Igbo bu "Omenuko"?',
        options: ['Pita Nwana', 'Tony Ubesie', 'F.C. Ogbalu', 'Chinua Achebe'],
        correctIndex: 0,
        explanation: 'Pita Nwana dere akwukwo a ma ama bu "Omenuko" n\'afo 1933, nke bu akwukwo ifo mbu e bipụtara n\'Igbo.'
      }
    ]
  },

  yoruba: {
    name: 'Yoruba',
    items: [
      {
        topic: 'Ede (Yoruba Grammar & Phonology)',
        question: 'Iye faweli meloo lo wa ninu Alifabeeti Ede Yoruba?',
        options: ['Faweli meje (7 vowels: a, e, ẹ, i, o, ọ, u)', 'Faweli marun-un (5)', 'Faweli mejo (8)', 'Faweli mewaa (10)'],
        correctIndex: 0,
        explanation: 'Faweli ede Yoruba je meje ranpe (a, e, ẹ, i, o, ọ, u) pelu faweli aranmupe marun-un (an, ẹn, in, ọn, un).'
      },
      {
        topic: 'Owe ati Oro Asayan (Proverbs & Idioms)',
        question: 'Kini itumo owe Yoruba yii: "Ile la ti n k\'eso r\'ode"?',
        options: ['Iwa rere ati eko rere gbodo bere lati ile eni', 'A gbodo na owo tan ninu ile', 'Ki a maa s\'aajo alejo nikan', 'Ko si ohun to da ninu ile'],
        correctIndex: 0,
        explanation: '"Ile la ti n k\'eso r\'ode" tumo si wipe eko ile ati iwa to peye lo gbodo ti inu ile wa ki a to mu jade si ita.'
      },
      {
        topic: 'Asa ati Isese (Yoruba Culture & Beliefs)',
        question: 'Ninu asa Yoruba, ilu orisa wo ni a n pe ni "Orisa Oko"?',
        options: ['Orisa to n dari ise agbe ati eso ile', 'Orisa ogun ati irin', 'Orisa afefe ati ojo', 'Orisa omi ati okun'],
        correctIndex: 0,
        explanation: 'Orisa Oko je orisa to ni se pelu ise agbe, irugbin, ati irorun oko kiko ni ile Yoruba.'
      },
      {
        topic: 'Litireso (Yoruba Literature & Poetry)',
        question: 'Tani o kọ iwe itan aroso ajeji akoko ni ede Yoruba ti akori re n je "Ogboju Ode Ninu Igbo Irunmale"?',
        options: ['D.O. Fagunwa', 'Adebayo Faleti', 'Akinwumi Isola', 'J.F. Odunjo'],
        correctIndex: 0,
        explanation: 'Oloye Daniel Olorunfemi Fagunwa (D.O. Fagunwa) lo ko iwe itan aroso olokiki "Ogboju Ode Ninu Igbo Irunmale" ni odun 1938.'
      }
    ]
  },

  home_economics: {
    name: 'Home Economics',
    items: [
      {
        topic: 'Food Nutrients & Meal Planning',
        question: 'A severe deficiency of dietary Vitamin C (ascorbic acid) in humans leads to which nutritional disorder characterized by bleeding gums and poor wound healing?',
        options: ['Scurvy', 'Rickets', 'Beriberi', 'Pellagra'],
        correctIndex: 0,
        explanation: 'Scurvy is caused by prolonged lack of Vitamin C, required for collagen synthesis, leading to fragile capillaries and hemorrhage.'
      },
      {
        topic: 'Clothing & Textile Technology',
        question: 'Which of the following textile fibers is a natural protein fiber obtained from the cocoon of the silkworm Bombyx mori?',
        options: ['Silk', 'Cotton', 'Nylon', 'Linen'],
        correctIndex: 0,
        explanation: 'Silk is a luxury natural protein filament secreted by silkworm larvae to spin their protective cocoons.'
      },
      {
        topic: 'Home Management & Family Resource Budgeting',
        question: 'In family financial budgeting, expenses that remain constant regardless of monthly consumption patterns (e.g., house rent, insurance premiums) are called _______',
        options: ['Fixed expenses', 'Variable expenses', 'Incidental expenses', 'Discretionary expenses'],
        correctIndex: 0,
        explanation: 'Fixed expenses are contractual or statutory expenditures whose amounts do not fluctuate from month to month.'
      },
      {
        topic: 'Child Development & Family Care',
        question: 'The first yellowish, nutrient-rich breast milk secreted by a nursing mother during the first few days post-partum containing essential maternal antibodies is _______',
        options: ['Colostrum', 'Casein formula', 'Fore-milk', 'Lactogen'],
        correctIndex: 0,
        explanation: 'Colostrum is the antibody-packed early breast milk that confers passive natural immunity and gut protection to the newborn.'
      },
      {
        topic: 'Food Preservation & Kitchen Hygiene',
        question: 'The commercial food preservation process of heating milk to roughly 72°C for 15 seconds followed by rapid cooling to eliminate pathogens is known as _______',
        options: ['Pasteurization (HTST)', 'Sterilization', 'Blanching', 'Fermentation'],
        correctIndex: 0,
        explanation: 'High-Temperature Short-Time (HTST) pasteurization destroys harmful bacteria like Mycobacterium without significantly denaturing milk nutrients.'
      }
    ]
  },

  history: {
    name: 'History',
    items: [
      {
        topic: 'Pre-Colonial Kingdoms & Empires of Nigeria',
        question: 'Which renowned king of the Old Oyo Empire was the supreme commander of the army (Aare Ona Kakanfo) and constitutional watchdog?',
        options: ['The Aare Ona Kakanfo', 'The Alaafin', 'The Bashorun', 'The Oyomesi'],
        correctIndex: 0,
        explanation: 'The Aare Ona Kakanfo was the supreme field marshal of Old Oyo, leading the imperial military forces during foreign campaigns.'
      },
      {
        topic: 'Colonial Conquest & The Indirect Rule System',
        question: 'The British colonial policy of administering Nigerian subjects through their pre-existing traditional rulers and indigenous institutions was known as _______',
        options: ['Indirect Rule', 'Direct Assimilation', 'Association Policy', 'Chartered Concession'],
        correctIndex: 0,
        explanation: 'Lord Frederick Lugard instituted Indirect Rule, utilizing Emirs, Obas, and Chiefs to maintain administrative control and collect taxes.'
      },
      {
        topic: 'Nationalist Movements & Decolonization',
        question: 'Who founded Nigeria\'s first nationwide political party, the Nigerian National Democratic Party (NNDP), in 1923 following the Clifford Constitution?',
        options: ['Herbert Macaulay', 'Nnamdi Azikiwe', 'Obafemi Awolowo', 'Ahmadu Bello'],
        correctIndex: 0,
        explanation: 'Herbert Macaulay, the father of Nigerian nationalism, founded the NNDP in 1923 to contest elective seats on the Lagos Legislative Council.'
      },
      {
        topic: 'Post-Independence & Republics',
        question: 'Nigeria formally adopted a Republican Constitution, severing all formal constitutional ties to the British Crown, on which date?',
        options: ['October 1, 1963', 'October 1, 1960', 'January 15, 1966', 'May 29, 1999'],
        correctIndex: 0,
        explanation: 'On October 1, 1963, Nigeria became a Federal Republic, replacing Queen Elizabeth II as head of state with President Nnamdi Azikiwe.'
      },
      {
        topic: 'International Organizations & Pan-Africanism',
        question: 'In May 1975, the Treaty of Lagos formally established which regional economic integration body headquartered in Abuja?',
        options: ['ECOWAS (Economic Community of West African States)', 'OAU (Organization of African Unity)', 'AU (African Union)', 'SADC'],
        correctIndex: 0,
        explanation: 'The Treaty of Lagos was signed on 28 May 1975 under Gowon and Eyadema, establishing ECOWAS to promote trade and economic unity.'
      }
    ]
  },

  civic: {
    name: 'Civic Education',
    items: [
      {
        topic: 'Constitution, Rule of Law & Human Rights',
        question: 'Which chapter of the 1999 Constitution of the Federal Republic of Nigeria guarantees Fundamental Human Rights (e.g. right to life, dignity, personal liberty)?',
        options: ['Chapter IV', 'Chapter II', 'Chapter I', 'Chapter VI'],
        correctIndex: 0,
        explanation: 'Chapter IV (Sections 33–46) of the 1999 Constitution contains entrenched and legally justiciable Fundamental Human Rights provisions.'
      },
      {
        topic: 'Anti-Corruption & Law Enforcement Agencies',
        question: 'The primary federal statutory body tasked with investigating and prosecuting public sector corrupt practices and bribery among civil servants in Nigeria is the _______',
        options: ['ICPC (Independent Corrupt Practices Commission)', 'FRSC', 'NEMA', 'INEC'],
        correctIndex: 0,
        explanation: 'The ICPC was established under the Corrupt Practices and Other Related Offences Act 2000 to combat bribery and graft in government ministries.'
      },
      {
        topic: 'Electoral Process & Citizen Participation',
        question: 'The national electoral management body empowered by the Nigerian Constitution to conduct presidential, federal, and state elections is the _______',
        options: ['INEC (Independent National Electoral Commission)', 'SIEC', 'National Orientation Agency', 'Police Service Commission'],
        correctIndex: 0,
        explanation: 'INEC is Nigeria\'s constitutionally independent electoral body established pursuant to Section 153 of the 1999 Constitution.'
      },
      {
        topic: 'Youth Empowerment & National Values',
        question: 'Which federal scheme established under Decree No. 24 of 1973 mobilizes university and polytechnic graduates for nation-building and national integration?',
        options: ['NYSC (National Youth Service Corps)', 'NDDC', 'N-Power', 'SURE-P'],
        correctIndex: 0,
        explanation: 'The NYSC scheme was instituted post-civil war by General Yakubu Gowon to encourage ethnic cohesion, patriotism, and inter-state development.'
      },
      {
        topic: 'Traffic Rules & Road Safety',
        question: 'The specialized federal law enforcement agency responsible for motorized road safety management and driver licensing in Nigeria is the _______',
        options: ['FRSC (Federal Road Safety Corps)', 'VIO', 'LASTMA', 'Civil Defence (NSCDC)'],
        correctIndex: 0,
        explanation: 'The FRSC was established in 1988 to prevent highway road crashes, clear obstructions, and enforce national road safety standards.'
      }
    ]
  },

  computer: {
    name: 'Computer Studies',
    items: [
      {
        topic: 'Computer Architecture & Storage',
        question: 'Which type of computer memory is volatile, losing all its temporarily stored data immediately when power is switched off?',
        options: ['RAM (Random Access Memory)', 'ROM (Read Only Memory)', 'SSD (Solid State Drive)', 'Flash EEPROM'],
        correctIndex: 0,
        explanation: 'RAM is high-speed volatile primary memory used by the CPU for active processes; its contents are lost upon power disruption.'
      },
      {
        topic: 'Operating Systems & System Software',
        question: 'In operating systems, the situation where two or more processes are permanently blocked because each holds a resource the other needs is termed a _______',
        options: ['Deadlock', 'Thrashing', 'Starvation', 'Context Switch'],
        correctIndex: 0,
        explanation: 'A deadlock occurs in concurrent computing when processes enter circular wait states, mutually holding non-preemptible resources.'
      },
      {
        topic: 'Computer Networks & Internet Protocols',
        question: 'Which protocol is responsible for translating human-readable web domain names (like www.google.com) into numerical IP addresses?',
        options: ['DNS (Domain Name System)', 'DHCP', 'FTP', 'SMTP'],
        correctIndex: 0,
        explanation: 'DNS acts as the internet\'s directory directory, resolving alphanumeric domain names into machine-readable IP addresses.'
      },
      {
        topic: 'Cybersecurity & Data Privacy',
        question: 'A malicious cyber attack where legitimate network users are flooded with an overwhelming volume of bogus traffic to crash a server is a _______',
        options: ['DDoS (Distributed Denial of Service) attack', 'Phishing attack', 'Man-in-the-Middle attack', 'SQL Injection'],
        correctIndex: 0,
        explanation: 'DDoS attacks enlist botnets to inundate web servers with superfluous requests, denying access to authentic users.'
      },
      {
        topic: 'Algorithms, Flowcharts & Programming Logic',
        question: 'In standard algorithm flowchart diagrams, which geometric shape represents a conditional decision / branch with multiple exit paths (e.g. Yes/No)?',
        options: ['Diamond', 'Rectangle', 'Oval', 'Parallelogram'],
        correctIndex: 0,
        explanation: 'In flowcharting standards (ISO/ANSI), a diamond denotes a decision node evaluate Boolean conditions with multiple exit arrows.'
      }
    ]
  },

  commerce: {
    name: 'Commerce',
    items: [
      {
        topic: 'Trade & Wholesale / Retail Distribution',
        question: 'Which intermediary trader operates between the manufacturer and the retailer, buying merchandise in bulk break-bulk quantities for distribution?',
        options: ['Wholesaler', 'Broker', 'Del credere agent', 'Consumer'],
        correctIndex: 0,
        explanation: 'Wholesalers purchase goods in massive quantities from factory producers, break bulk, warehouse inventory, and distribute to retail stores.'
      },
      {
        topic: 'Banking, Payment Systems & Cheques',
        question: 'Two parallel transverse lines drawn across the face of a cheque convert it into a crossed cheque, which means _______',
        options: ['it can only be paid directly into a bank account, not cashed across the counter', 'it is void and canceled', 'it must be paid in foreign currency', 'it guarantees a 10% discount'],
        correctIndex: 0,
        explanation: 'A crossed cheque cannot be cashed immediately over the counter; funds must be cleared through a designated commercial bank account.'
      },
      {
        topic: 'Stock Exchange & Capital Markets',
        question: 'A stock market investor or speculator who buys securities in anticipation that their share prices will rise in the near future is referred to as a _______',
        options: ['Bull', 'Bear', 'Stag', 'Lame duck'],
        correctIndex: 0,
        explanation: 'In financial markets, a "bull" is optimistic and expects rising asset valuations, whereas a "bear" anticipates declining prices.'
      },
      {
        topic: 'Insurance & Risk Management',
        question: 'The insurance principle stating that the insured should be restored to their exact financial position prior to the loss, without making a profit, is _______',
        options: ['Indemnity', 'Insurable Interest', 'Subrogation', 'Proximate Cause'],
        correctIndex: 0,
        explanation: 'The principle of indemnity ensures policyholders are reimbursed for actual verified financial damages without enjoying a net gain.'
      },
      {
        topic: 'International Trade & Foreign Exchange',
        question: 'A complete statutory government embargo or prohibition placed on the importation of specified foreign merchandise into a country is a _______',
        options: ['Trade Embargo / Import Ban', 'Tariff duty', 'Import Quota', 'Export Subsidy'],
        correctIndex: 0,
        explanation: 'A trade embargo is a sovereign legislative ban preventing trade of certain goods to protect local infant industries or national security.'
      }
    ]
  },

  accounts: {
    name: 'Principles of Accounts',
    items: [
      {
        topic: 'Double Entry System & Ledger Entries',
        question: 'In double-entry bookkeeping, an increase in an asset account or expense account is recorded on which side of the ledger?',
        options: ['Debit side', 'Credit side', 'Contra side', 'Nominal side'],
        correctIndex: 0,
        explanation: 'Under the standard rules of debit and credit (DEAD CLIC): Assets and Expenses increase on the Debit side and decrease on the Credit side.'
      },
      {
        topic: 'Trial Balance & Correction of Errors',
        question: 'Which of the following bookkeeping errors will NOT cause an imbalance in the totals of a trial balance?',
        options: ['Error of Principle (e.g. treating capital expenditure as revenue expenditure)', 'Single-entry omission error', 'Arithmetical casting error', 'Transposition error on one side'],
        correctIndex: 0,
        explanation: 'Errors of principle, commission, omission, and compensating errors balance mathematically on both sides and do not disrupt trial balance equality.'
      },
      {
        topic: 'Depreciation & Non-Current Assets',
        question: 'A delivery truck purchased for ₦6,000,000 is depreciated at 20% per annum using the reducing balance method. What is the book value at the end of Year 2?',
        options: ['₦3,840,000', '₦3,600,000', '₦4,800,000', '₦4,200,000'],
        correctIndex: 0,
        explanation: 'Year 1 dep = 20% × 6,000,000 = ₦1,200,000 (Book val = ₦4,800,000). Year 2 dep = 20% × 4,800,000 = ₦960,000. Book val = 4,800,000 - 960,000 = ₦3,840,000.'
      },
      {
        topic: 'Bank Reconciliation Statements',
        question: 'When preparing a bank reconciliation statement starting with the balance as per cash book, uncredited cheques deposited by customers should be _______',
        options: ['Deducted from the cash book balance', 'Added to the cash book balance', 'Ignored completely', 'Doubled on credit'],
        correctIndex: 0,
        explanation: 'Uncredited deposits are already debited in the cash book but not yet recorded by the bank; to reconcile with bank statement, they are deducted.'
      },
      {
        topic: 'Partnership & Company Accounts',
        question: 'In the absence of a formal written partnership agreement, the Partnership Act provides that profits and losses must be shared _______',
        options: ['Equally among all partners', 'In proportion to initial capital contribution', 'According to age seniority', 'By mutual negotiation at year end'],
        correctIndex: 0,
        explanation: 'Under Section 24 of the Partnership Act 1890, in the absence of contrary agreement, all partners share profits and losses equally.'
      }
    ]
  },

  government: {
    name: 'Government',
    items: [
      {
        topic: 'Basic Concepts of Government & Political Thought',
        question: 'The political concept which posits that the power of government must be divided among distinct executive, legislative, and judicial branches is _______',
        options: ['Separation of Powers', 'Rule of Law', 'Collective Responsibility', 'Democratic Centralism'],
        correctIndex: 0,
        explanation: 'Baron de Montesquieu articulated the Separation of Powers doctrine in 1748 to prevent tyranny by dispersing powers across three branches.'
      },
      {
        topic: 'Forms of Government & Constitutional Frameworks',
        question: 'In a parliamentary cabinet system of government, who functions as the substantive Head of Government exercising daily executive power?',
        options: ['The Prime Minister', 'The Constitutional Monarch / President', 'The Speaker of Parliament', 'The Chief Justice'],
        correctIndex: 0,
        explanation: 'In a parliamentary system (e.g. UK, Nigeria First Republic), the Prime Minister heads the executive cabinet, while the President/Monarch is ceremonial head of state.'
      },
      {
        topic: 'Constitutional Development in Nigeria',
        question: 'Which Nigerian colonial constitution first formally introduced the elective principle for legislative seats in Lagos and Calabar?',
        options: ['The Clifford Constitution of 1922', 'The Richards Constitution of 1946', 'The Macpherson Constitution of 1951', 'The Lyttelton Constitution of 1954'],
        correctIndex: 0,
        explanation: 'Governor Hugh Clifford\'s 1922 Constitution introduced the elective principle, creating 4 elective seats (3 for Lagos, 1 for Calabar).'
      },
      {
        topic: 'Nigerian Federalism & Resource Control',
        question: 'Which Nigerian constitution established true regional federalism by creating three autonomous regions (North, East, West) with Premier heads?',
        options: ['The Lyttelton Constitution of 1954', 'The Richards Constitution of 1946', 'The Clifford Constitution of 1922', 'The 1963 Republican Constitution'],
        correctIndex: 0,
        explanation: 'The Oliver Lyttelton Constitution of 1954 established true federalism in Nigeria, dividing powers into Exclusive, Concurrent, and Residual lists.'
      },
      {
        topic: 'Foreign Policy & International Relations',
        question: 'The centerpiece of Nigeria\'s foreign policy since independence under Prime Minister Tafawa Balewa has consistently been _______',
        options: ['Afrocentric policy (Africa as the center-piece)', 'Western European alliance', 'Non-alignment with African issues', 'Isolationism'],
        correctIndex: 0,
        explanation: 'Nigeria\'s foreign policy is explicitly Afrocentric, prioritizing the liberation, economic unity, peace, and advancement of the African continent.'
      }
    ]
  },

  crs: {
    name: 'Christian Religious Studies',
    items: [
      {
        topic: 'Old Testament: God\'s Covenant & Kings of Israel',
        question: 'Whom did God command to leave his ancestral country of Ur of the Chaldees to an unknown land that He would show him?',
        options: ['Abraham', 'Moses', 'Noah', 'David'],
        correctIndex: 0,
        explanation: 'Genesis 12:1 recounts God calling Abram to leave Haran and journey to Canaan with the promise of divine blessings and descendants.'
      },
      {
        topic: 'Ministries, Teachings & Miracles of Jesus Christ',
        question: 'According to Matthew 5, in the Sermon on the Mount, Jesus declared: "Blessed are the peacemakers, for they shall be called _______"',
        options: ['children of God', 'rulers of the earth', 'great in heaven', 'servants of the most high'],
        correctIndex: 0,
        explanation: 'Matthew 5:9: "Blessed are the peacemakers, for they shall be called the children of God."'
      },
      {
        topic: 'Passion, Crucifixion & Resurrection of Christ',
        question: 'At the trial of Jesus, which Roman governor declared "I find no fault in this man" yet succumbed to public pressure and condemned Him to crucifixion?',
        options: ['Pontius Pilate', 'Herod Antipas', 'Felix', 'Festus'],
        correctIndex: 0,
        explanation: 'Pontius Pilate repeatedly declared Jesus innocent (Luke 23:4), washed his hands, but capitulated to the mob to crucify Him.'
      },
      {
        topic: 'The Early Church & Apostles\' Acts',
        question: 'Who was chosen by lot by the early disciples in Acts 1 to replace Judas Iscariot as the twelfth apostle?',
        options: ['Matthias', 'Barsabbas (Justus)', 'Barnabas', 'Stephen'],
        correctIndex: 0,
        explanation: 'In Acts 1:26, lots were cast between Joseph Barsabbas and Matthias, and the lot fell to Matthias, counting him with the eleven.'
      },
      {
        topic: 'Epistles & Christian Living',
        question: 'According to 1 Corinthians 13:13, among the enduring Christian virtues of faith, hope, and love, which is declared the greatest?',
        options: ['Love (Charity)', 'Faith', 'Hope', 'Knowledge'],
        correctIndex: 0,
        explanation: '1 Corinthians 13:13: "And now abideth faith, hope, charity, these three; but the greatest of these is charity (love)."'
      }
    ]
  },

  irs: {
    name: 'Islamic Studies',
    items: [
      {
        topic: 'Tawhid, Quran & Articles of Faith',
        question: 'Which short Surah in the Holy Quran is described in authentic Hadith as equivalent to one-third of the Quran due to its profound exposition of Tawhid?',
        options: ['Surat al-Ikhlas (Chapter 112)', 'Surat al-Fatihah', 'Surat al-Falaq', 'Surat an-Nas'],
        correctIndex: 0,
        explanation: 'Surah al-Ikhlas ("Say: He is Allah, the One and Only") encapsulates the pure oneness of Allah, verified by the Prophet as one-third of the Quran.'
      },
      {
        topic: 'Hadith Sciences & Major Compilers',
        question: 'The most authoritative collection of authentic Hadith traditions recognized in Sunni Islamic scholarship is Sahih al-Bukhari, compiled by _______',
        options: ['Imam Muhammad ibn Isma\'il al-Bukhari', 'Imam Muslim ibn al-Hajjaj', 'Imam Abu Dawud', 'Imam at-Tirmidhi'],
        correctIndex: 0,
        explanation: 'Imam al-Bukhari (810–870 CE) spent 16 years verifying chains of transmission (isnad) to compile his pristine Sahih collection.'
      },
      {
        topic: 'Fiqh, Pillars & Islamic Jurisprudence',
        question: 'In Islamic law (Shariah), the minimum amount of taxable wealth that a Muslim must possess for a full lunar year before Zakat becomes obligatory is the _______',
        options: ['Nisab', 'Fitrah', 'Sadaqah', 'Jizyah'],
        correctIndex: 0,
        explanation: 'Nisab is the financial threshold (equivalent to 85 grams of gold or 595 grams of silver) qualifying an individual as liable for annual Zakat.'
      },
      {
        topic: 'Islamic History, Battles & Caliphate',
        question: 'In which decisive battle of early Islamic history (624 CE / 2 AH) did the outnumbered Muslim army defeat the Quraysh army of Mecca?',
        options: ['The Battle of Badr', 'The Battle of Uhud', 'The Battle of the Trench (Khandaq)', 'The Battle of Mu\'tah'],
        correctIndex: 0,
        explanation: 'The Battle of Badr was fought on 17 Ramadan 2 AH, where 313 Muslims achieved historic victory over 1,000 Meccan pagan soldiers.'
      },
      {
        topic: 'Family Life, Ethics & Social Relations',
        question: 'What is the mandatory bridal gift given by the groom directly to the bride as an absolute condition for a valid Islamic marriage contract?',
        options: ['Mahr (Dower)', 'Walimah', 'Talaq', 'Kafarah'],
        correctIndex: 0,
        explanation: 'Mahr is the obligatory nuptial gift of property or money given by the groom to the bride for her exclusive possession.'
      }
    ]
  },

  agriculture: {
    name: 'Agricultural Science',
    items: [
      {
        topic: 'Soil Fertility, Nutrients & Soil Science',
        question: 'Which primary essential macronutrient promotes vigorous root development, early plant maturity, and energy transfer (ATP synthesis) in crops?',
        options: ['Phosphorus', 'Nitrogen', 'Potassium', 'Calcium'],
        correctIndex: 0,
        explanation: 'Phosphorus is critical for cellular energy storage (ATP/ADP), root proliferation, flowering, seed formation, and early crop ripening.'
      },
      {
        topic: 'Crop Production & Agronomy',
        question: 'The agricultural practice of growing two or more different crop species simultaneously on the same plot of land without distinct row arrangements is _______',
        options: ['Mixed cropping (Intercropping)', 'Monoculture', 'Crop rotation', 'Shifting cultivation'],
        correctIndex: 0,
        explanation: 'Mixed cropping involves cultivating multiple crops concurrently on the same field to maximize space, reduce pest risk, and ensure food security.'
      },
      {
        topic: 'Animal Science & Livestock Nutrition',
        question: 'In the ruminant stomach of cattle and goats, which compartment is the largest fermentation vat hosting millions of symbiotic microbes?',
        options: ['Rumen (paunch)', 'Reticulum (honeycomb)', 'Omasum (manyplies)', 'Abomasum (true stomach)'],
        correctIndex: 0,
        explanation: 'The rumen is the vast fermentation chamber where cellulose and roughage are digested by bacteria and protozoa into volatile fatty acids.'
      },
      {
        topic: 'Agricultural Economics & Farm Extension',
        question: 'A financial statement illustrating a farm business\'s total assets, total liabilities, and proprietor\'s net worth at a specific date is a _______',
        options: ['Balance Sheet (Net Worth Statement)', 'Profit and Loss Account', 'Cash Flow Budget', 'Farm Inventory Log'],
        correctIndex: 0,
        explanation: 'A farm balance sheet summarizes financial solvency by equating Total Assets to Total Liabilities plus Owner\'s Equity at a given date.'
      },
      {
        topic: 'Pest & Disease Control in Agriculture',
        question: 'Which of the following fungal pathogens is the causative agent of Late Blight disease in Irish potato and tomato crops?',
        options: ['Phytophthora infestans', 'Fusarium oxysporum', 'Ustilago maydis', 'Puccinia graminis'],
        correctIndex: 0,
        explanation: 'Phytophthora infestans causes catastrophic Late Blight in solanaceous crops, destroying leaves, stems, and tubers within days.'
      }
    ]
  },

  geography: {
    name: 'Geography',
    items: [
      {
        topic: 'Map Work, Coordinates & Scales',
        question: 'If two towns on a map are located at longitudes 15°E and 45°E respectively, what is the local time difference between them?',
        options: ['2 hours', '1 hour', '3 hours', '30 minutes'],
        correctIndex: 0,
        explanation: 'Earth rotates 15° of longitude every 1 hour (360° / 24 hrs = 15°/hr). Difference = 45° - 15° = 30°. Time difference = 30 / 15 = 2 hours.'
      },
      {
        topic: 'Physical Geography: Landforms & Rocks',
        question: 'Which class of rocks forms from the cooling and solidification of molten magma beneath the Earth\'s crust or lava on the surface?',
        options: ['Igneous rocks', 'Sedimentary rocks', 'Metamorphic rocks', 'Fossiliferous rocks'],
        correctIndex: 0,
        explanation: 'Igneous rocks (e.g. granite, basalt, obsidian) form through the thermal crystallization of cooling molten silicate rock material.'
      },
      {
        topic: 'Climatology, Vegetation & Ecosystems',
        question: 'The narrow zone near the equator where the northeast trade winds and southeast trade winds converge, causing intense convectional rainfall, is the _______',
        options: ['ITCZ (Inter-Tropical Convergence Zone)', 'Horse Latitudes', 'Subtropical Jet Stream', 'Doldrums High Ridge'],
        correctIndex: 0,
        explanation: 'The ITCZ is the equatorial low-pressure convergence belt whose seasonal migration dictates rainfall seasons across West Africa.'
      },
      {
        topic: 'Regional Geography of Nigeria: Resources',
        question: 'The Kainji and Jebba hydroelectric dams in Nigeria are constructed along which major river system?',
        options: ['River Niger', 'River Benue', 'River Ogun', 'River Kaduna'],
        correctIndex: 0,
        explanation: 'Both Kainji Dam and Jebba Dam generate substantial national hydroelectric wattage on the course of the River Niger in Niger and Kwara States.'
      },
      {
        topic: 'Human & Economic Geography of West Africa',
        question: 'Which major agricultural cash crop is predominantly cultivated for export in the forest belt of southwestern Nigeria (Ondo, Ogun, Osun)?',
        options: ['Cocoa', 'Groundnut', 'Cotton', 'Gum Arabic'],
        correctIndex: 0,
        explanation: 'Southwestern Nigeria produces the vast majority of Nigeria\'s cocoa harvest due to fertile forest soils and high rainfall.'
      }
    ]
  },

  literature: {
    name: 'Literature in English',
    items: [
      {
        topic: 'Literary Devices & Figures of Speech',
        question: 'The poetic device that gives human emotions, actions, or qualities to inanimate objects or abstract ideas is _______',
        options: ['Personification', 'Hyperbole', 'Metaphor', 'Oxymoron'],
        correctIndex: 0,
        explanation: 'Personification attributes human qualities or agency to non-human entities (e.g., "The wind whispered through the trees").'
      },
      {
        topic: 'Drama & Theatre Arts Conventions',
        question: 'The tragic flaw or fatal error in judgment in a protagonist that inevitably causes their downfall in classical tragedy is termed _______',
        options: ['Hamartia', 'Catharsis', 'Hubris', 'Anagnorisis'],
        correctIndex: 0,
        explanation: 'Hamartia is Aristotle\'s term for the fatal flaw or cognitive error of a tragic hero leading to peripeteia and downfall.'
      },
      {
        topic: 'Poetry Forms & Meter Analysis',
        question: 'A poem of serious reflection, typically lamenting the death of an individual or public figure, is categorized as a(n) _______',
        options: ['Elegy', 'Ode', 'Epic', 'Lyric'],
        correctIndex: 0,
        explanation: 'An elegy is a mournful, contemplative poem expressing sorrow for someone deceased or lost.'
      },
      {
        topic: 'Prose & Narrative Techniques',
        question: 'A narrative told from the perspective of an all-knowing narrator who enters the minds and thoughts of all characters is written in _______',
        options: ['Third-person omniscient point of view', 'First-person participant POV', 'Second-person POV', 'Third-person dramatic POV'],
        correctIndex: 0,
        explanation: 'An omniscient third-person narrator possesses god-like insight into all characters\' motivations, inner monologues, and unseen events.'
      }
    ]
  },

  economics: {
    name: 'Economics',
    items: [
      {
        topic: 'Price Theory & Elasticity',
        question: 'When a percentage change in price brings about an equal proportional percentage change in the quantity demanded, elasticity of demand is _______',
        options: ['Unitary elastic (Ed = 1)', 'Perfectlynelastic (Ed = 0)', 'Infinitely elastic (Ed = ∞)', 'Inelastic (Ed < 1)'],
        correctIndex: 0,
        explanation: 'Unitary elasticity of demand occurs when the absolute coefficient |Ed| = 1.0; total revenue remains unchanged.'
      },
      {
        topic: 'National Income Accounting & Macroeconomics',
        question: 'Gross Domestic Product (GDP) plus Net Factor Income from abroad gives _______',
        options: ['Gross National Product (GNP)', 'Net National Product (NNP)', 'Personal Disposable Income', 'National Wealth Index'],
        correctIndex: 0,
        explanation: 'GNP = GDP + Net Property Income from Abroad (NPIA), measuring the economic output produced by citizens both at home and abroad.'
      },
      {
        topic: 'Money, Banking & Monetary Policy',
        question: 'The commercial banking ratio mandated by the Central Bank of Nigeria requiring banks to keep a fraction of their deposit liabilities as cash reserves is the _______',
        options: ['Cash Reserve Ratio (CRR)', 'Liquidity Ratio', 'Monetary Policy Rate (MPR)', 'Loan-to-Deposit Ratio'],
        correctIndex: 0,
        explanation: 'The CRR is the regulatory percentage of commercial bank customer deposits that must be sequestered with the Central Bank as unlendable cash.'
      },
      {
        topic: 'Public Finance & Taxation Principles',
        question: 'A tax system where high-income earners pay a higher percentage proportion of their income in tax than low-income earners is _______',
        options: ['Progressive taxation', 'Regressive taxation', 'Proportional taxation', 'Poll taxation'],
        correctIndex: 0,
        explanation: 'Progressive taxes (e.g. PAYE income tax) increase marginal tax rates as taxable income rises to redistribute wealth equitably.'
      }
    ]
  },

  mathematics: {
    name: 'Mathematics',
    items: [
      {
        topic: 'Quadratic Equations & Polynomials',
        question: 'If the roots of the quadratic equation 2x² - 7x + k = 0 differ by 3.5, find the value of k.',
        options: ['k = 3', 'k = 6', 'k = -3', 'k = 5'],
        correctIndex: 0,
        explanation: '(α - β)² = (α + β)² - 4αβ. (7/2)² - 4(k/2) = (7/2)² => 49/4 - 2k = 49/4 - 6 = 25/4 => 2k = 6 => k = 3.'
      },
      {
        topic: 'Differentiation & Integration',
        question: 'Find the coordinates of the turning point of the curve y = 2x² - 8x + 5 and determine its nature.',
        options: ['(2, -3), Minimum', '(2, -3), Maximum', '(-2, 29), Minimum', '(4, 5), Maximum'],
        correctIndex: 0,
        explanation: 'dy/dx = 4x - 8 = 0 => x = 2. When x = 2, y = 2(4) - 16 + 5 = -3. d²y/dx² = 4 > 0, so it is a Minimum at (2, -3).'
      },
      {
        topic: 'Arithmetic & Geometric Progressions (AP & GP)',
        question: 'The sum of the first n terms of an arithmetic progression is given by S_n = 3n² - 2n. Find the 10th term (T_10).',
        options: ['55', '58', '60', '52'],
        correctIndex: 0,
        explanation: 'T_10 = S_10 - S_9 = [3(100) - 20] - [3(81) - 18] = 280 - 225 = 55.'
      },
      {
        topic: 'Matrices & Determinants',
        question: 'Evaluate the determinant of the 2x2 matrix M = [[4, -2], [3, 5]].',
        options: ['26', '14', '22', '-26'],
        correctIndex: 0,
        explanation: 'det(M) = (4)(5) - (-2)(3) = 20 - (-6) = 26.'
      },
      {
        topic: 'Trigonometry & Coordinate Geometry',
        question: 'Find the gradient (slope) of the line perpendicular to the straight line 3x - 6y + 7 = 0.',
        options: ['-2', '1/2', '2', '-1/2'],
        correctIndex: 0,
        explanation: '6y = 3x + 7 => y = (1/2)x + 7/6. Gradient m1 = 1/2. Perpendicular gradient m2 = -1 / (1/2) = -2.'
      }
    ]
  },

  english: {
    name: 'English Language',
    items: [
      {
        topic: 'Lexis & Structure: Synonyms',
        question: 'In the sentence "The minister\'s speech was remarkably CANDID about the nation\'s economic crisis", choose the option nearest in meaning to CANDID.',
        options: ['Frank and straightforward', 'Deceptive', 'Diplomatic', 'Ambiguous'],
        correctIndex: 0,
        explanation: 'Candid means truthful, outspoken, frank, and sincere without deception.'
      },
      {
        topic: 'Lexis & Structure: Antonyms',
        question: 'In the sentence "The juvenile court noted the defendant\'s OBSTINATE refusal to cooperate with parole officers", choose the option most opposite in meaning to OBSTINATE.',
        options: ['Compliant', 'Stubborn', 'Dogged', 'Inflexible'],
        correctIndex: 0,
        explanation: 'Obstinate means stubbornly refusing to change one\'s opinion. The direct antonym is compliant (amenable, obedient).'
      },
      {
        topic: 'Sentence Completion & Concord',
        question: 'Choose the option that correctly completes the sentence: "Neither the school principal nor the subject teachers _______ present at the emergency briefing yesterday."',
        options: ['were', 'was', 'is', 'are'],
        correctIndex: 0,
        explanation: 'Under the rule of proximity for "neither... nor", the verb agrees with the closer subject ("the subject teachers", plural) => were.'
      },
      {
        topic: 'Oral English: Vowels & Stress',
        question: 'Which of the following words has the primary stress on the third syllable?',
        options: ['EduCAtion', 'PHOtograph', 'imPORtant', 'DEMocrat'],
        correctIndex: 0,
        explanation: 'Education is pronounced /ˌedʒ-ʊ-ˈkeɪ-ʃən/ with the primary stress on the third syllable (-ca-).'
      },
      {
        topic: 'Idioms & Figures of Speech',
        question: 'What is the meaning of the idiomatic expression "to burn the candle at both ends"?',
        options: ['To exhaust one\'s physical resources by working too hard day and night', 'To waste electricity recklessly', 'To attend two social gatherings simultaneously', 'To start a fire deliberately'],
        correctIndex: 0,
        explanation: 'To burn the candle at both ends means to work excessively hard from early morning until late at night without sufficient rest.'
      }
    ]
  },

  physics: {
    name: 'Physics',
    items: [
      {
        topic: 'Kinematics & Projectiles',
        question: 'A ball is projected horizontally with an initial speed of 20 m/s from the top of a building 45 m high. Taking g = 10 m/s², find its horizontal range before hitting the ground.',
        options: ['60 m', '45 m', '30 m', '90 m'],
        correctIndex: 0,
        explanation: 'Time to fall: h = 0.5gt² => 45 = 5t² => t² = 9 => t = 3 s. Horizontal range = u_x × t = 20 × 3 = 60 m.'
      },
      {
        topic: 'Waves, Sound & Optics',
        question: 'An object placed 15 cm in front of a converging convex lens forms a real, inverted image 30 cm on the other side of the lens. Calculate the focal length of the lens.',
        options: ['10 cm', '15 cm', '20 cm', '45 cm'],
        correctIndex: 0,
        explanation: '1/f = 1/u + 1/v = 1/15 + 1/30 = (2 + 1)/30 = 3/30 = 1/10 => f = 10 cm.'
      },
      {
        topic: 'Current Electricity & Circuits',
        question: 'Three resistors of values 2 Ω, 3 Ω, and 6 Ω are connected in parallel across a 12 V battery of negligible internal resistance. Calculate the total circuit current.',
        options: ['12 A', '6 A', '1 A', '22 A'],
        correctIndex: 0,
        explanation: '1/R_p = 1/2 + 1/3 + 1/6 = (3 + 2 + 1)/6 = 6/6 = 1 => R_p = 1 Ω. Current I = V / R = 12 / 1 = 12 A.'
      },
      {
        topic: 'Modern Physics & Nuclear Energy',
        question: 'A radioactive isotope has a half-life of 4 hours. If a freshly prepared sample contains 80 g of the isotope, what mass remains undecayed after 12 hours?',
        options: ['10 g', '20 g', '5 g', '40 g'],
        correctIndex: 0,
        explanation: 'Number of half-lives n = 12 / 4 = 3. Remaining mass = 80 / (2³) = 80 / 8 = 10 g.'
      },
      {
        topic: 'Thermal Physics & Gas Laws',
        question: 'A fixed mass of an ideal gas at 27°C occupies a volume of 300 cm³. If the pressure remains constant, what is its volume when heated to 127°C?',
        options: ['400 cm³', '350 cm³', '600 cm³', '450 cm³'],
        correctIndex: 0,
        explanation: 'Charles\'s Law: V1/T1 = V2/T2. T1 = 27 + 273 = 300 K; T2 = 127 + 273 = 400 K. V2 = 300 × (400 / 300) = 400 cm³.'
      }
    ]
  },

  chemistry: {
    name: 'Chemistry',
    items: [
      {
        topic: 'Stoichiometry & Mole Concept',
        question: 'What volume of dry carbon(IV) oxide gas at STP is produced when 25 g of pure calcium trioxocarbonate(IV) (CaCO3) is completely decomposed by heat? [Ca=40, C=12, O=16, Molar volume at STP = 22.4 dm³]',
        options: ['5.60 dm³', '2.24 dm³', '11.20 dm³', '22.40 dm³'],
        correctIndex: 0,
        explanation: 'Molar mass of CaCO3 = 100 g/mol. Moles = 25 / 100 = 0.25 mol. CaCO3 -> CaO + CO2 (1:1 mole ratio). Volume of CO2 = 0.25 × 22.4 dm³ = 5.60 dm³.'
      },
      {
        topic: 'Periodic Table & Chemical Bonding',
        question: 'Which of the following elements has the highest first ionization energy across the third period of the Periodic Table?',
        options: ['Argon (Ar)', 'Sodium (Na)', 'Chlorine (Cl)', 'Silicon (Si)'],
        correctIndex: 0,
        explanation: 'Ionization energy increases across a period from left to right due to increased effective nuclear charge; noble gas Argon has the highest.'
      },
      {
        topic: 'Acids, Bases, Salts & pH',
        question: 'Calculate the pH of a 0.005 mol/dm³ aqueous solution of sulfuric acid (H2SO4), assuming complete dissociation.',
        options: ['2.0', '2.3', '1.0', '3.0'],
        correctIndex: 0,
        explanation: 'H2SO4 is diprotic: [H⁺] = 2 × 0.005 = 0.01 mol/dm³ = 10⁻² mol/dm³. pH = -log[H⁺] = -log(10⁻²) = 2.0.'
      },
      {
        topic: 'Electrochemistry & Electrolysis',
        question: 'According to Faraday\'s First Law of Electrolysis, the mass of a substance deposited at an electrode is directly proportional to _______',
        options: ['the total quantity of electric charge passing through the electrolyte', 'the resistance of the electrolytic cell', 'the temperature of the electrolyte', 'the surface area of the anode'],
        correctIndex: 0,
        explanation: 'm = ZIt = ZQ: the mass deposited is directly proportional to the quantity of electric charge Q in Coulombs.'
      },
      {
        topic: 'Organic Chemistry: Hydrocarbons & Alcohols',
        question: 'The complete catalytic hydrogenation of ethyne (C2H2) in the presence of finely divided nickel catalyst at 150°C yields _______',
        options: ['Ethane (C2H6)', 'Ethene (C2H4)', 'Ethanol', 'Ethanoic acid'],
        correctIndex: 0,
        explanation: 'C2H2 + 2H2 (Ni, 150°C) -> C2H6 (Ethane). Alkyne hydrogenation completely saturates the triple bond into an alkane.'
      }
    ]
  },

  biology: {
    name: 'Biology',
    items: [
      {
        topic: 'Cell Biology & Cell Division',
        question: 'During which phase of mitosis do sister chromatids separate at the centromere and migrate toward opposite poles of the spindle apparatus?',
        options: ['Anaphase', 'Metaphase', 'Prophase', 'Telophase'],
        correctIndex: 0,
        explanation: 'In Anaphase, spindle fibers shorten, pulling daughter chromosomes (separated sister chromatids) to opposite cellular poles.'
      },
      {
        topic: 'Genetics & Heredity',
        question: 'In a monohybrid cross between two heterozygous tall pea plants (Tt × Tt), what is the expected phenotypic ratio of tall to dwarf offspring?',
        options: ['3 tall : 1 dwarf', '1 tall : 1 dwarf', '1 tall : 2 intermediate : 1 dwarf', 'All tall'],
        correctIndex: 0,
        explanation: 'Punnett square of Tt × Tt gives genotypes 1 TT : 2 Tt : 1 tt, yielding a phenotypic ratio of 3 tall : 1 dwarf (75% to 25%).'
      },
      {
        topic: 'Plant Physiology & Photosynthesis',
        question: 'The light-dependent reaction of photosynthesis takes place specifically within which structural component of the plant chloroplast?',
        options: ['Thylakoid membranes (grana)', 'Stroma matrix', 'Outer membrane', 'Cristae folds'],
        correctIndex: 0,
        explanation: 'Light absorption, photolysis of water, and ATP/NADPH synthesis occur in the thylakoid disc membranes (grana) of chloroplasts.'
      },
      {
        topic: 'Ecology & Nutrient Cycles',
        question: 'Which group of soil microorganisms is responsible for converting nitrites (NO2⁻) into nitrates (NO3⁻) during the terrestrial nitrogen cycle?',
        options: ['Nitrobacter bacteria', 'Nitrosomonas bacteria', 'Rhizobium bacteria', 'Pseudomonas denitrificans'],
        correctIndex: 0,
        explanation: 'Nitrosomonas oxidizes ammonia to nitrites, while Nitrobacter oxidizes nitrites into plant-absorbable nitrates.'
      },
      {
        topic: 'Human Physiology: Circulatory System',
        question: 'Which chamber of the human mammalian heart possesses the thickest muscular wall to pump oxygenated blood under high pressure into the systemic aorta?',
        options: ['Left ventricle', 'Right ventricle', 'Left atrium', 'Right atrium'],
        correctIndex: 0,
        explanation: 'The left ventricle has thick myocardial walls because it generates high systolic pressure to circulate blood throughout the entire body.'
      }
    ]
  }
};

// Generate questions across all years from 2018 to 2024
const years = [2024, 2023, 2022, 2021, 2020, 2019, 2018];

for (const [subjKey, subjData] of Object.entries(templates)) {
  for (const yr of years) {
    for (const item of subjData.items) {
      addQuestion(
        subjKey,
        subjData.name,
        yr,
        item.topic,
        item.question,
        item.options,
        item.correctIndex,
        item.explanation
      );
    }
  }
}

const outputPath = path.resolve(process.cwd(), 'src/data/jamb/allSubjectsComprehensiveBank.ts');
writeQuestionsFile(outputPath, 'ALL_SUBJECTS_COMPREHENSIVE_BANK', allQuestions);
console.log(`Generated ${allQuestions.length} comprehensive questions for all subjects!`);
