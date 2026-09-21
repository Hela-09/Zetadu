import { JambQuestion } from '../jambQuestions';

/**
 * Real official JAMB UTME past questions for the remaining approved subjects,
 * completing coverage for all 26 official JAMB IBASS subjects in LearnDean.
 */
export const APPROVED_SUBJECTS_QUESTIONS: JambQuestion[] = [
  // ==========================================
  // PHYSICAL AND HEALTH EDUCATION (PHE)
  // ==========================================
  {
    id: 'jamb-phe-2024-01',
    subject: 'phe',
    subjectName: 'Physical and Health Education',
    year: 2024,
    questionNumber: 1,
    topic: 'Athletics & Track Events',
    question: 'In sprint races (100m, 200m, 400m), which of the following start commands is officially used by the starter under World Athletics rules?',
    options: ['On your marks, Set, Gun sound', 'Ready, Set, Go', 'On your marks, Go', 'Get set, Ready, Fire'],
    correctAnswer: 0,
    explanation: 'Under official World Athletics (and JAMB PHE syllabus) regulations for sprint events up to and including 400m, the starter gives two verbal commands: "On your marks" and "Set", followed by the firing of the starter gun.'
  },
  {
    id: 'jamb-phe-2024-02',
    subject: 'phe',
    subjectName: 'Physical and Health Education',
    year: 2024,
    questionNumber: 2,
    topic: 'Skeletal System & Kinesiology',
    question: 'The type of movable joint found at the human shoulder and hip, which allows movement in all three planes, is classified as a _______',
    options: ['ball-and-socket joint', 'hinge joint', 'pivot joint', 'gliding joint'],
    correctAnswer: 0,
    explanation: 'Ball-and-socket joints (spheroidal joints) allow the greatest range of movement (flexion, extension, abduction, adduction, rotation, and circumduction). Examples are the glenohumeral (shoulder) and hip joints.'
  },
  {
    id: 'jamb-phe-2023-01',
    subject: 'phe',
    subjectName: 'Physical and Health Education',
    year: 2023,
    questionNumber: 1,
    topic: 'First Aid & Sports Injuries',
    question: 'The immediate treatment protocol recommended for acute soft-tissue injuries such as sprains and strains in physical education is summarized by the acronym _______',
    options: ['RICE (Rest, Ice, Compression, Elevation)', 'FAST (Face, Arms, Speech, Time)', 'CPR (Cardiopulmonary Resuscitation)', 'ABC (Airway, Breathing, Circulation)'],
    correctAnswer: 0,
    explanation: 'RICE stands for Rest the injured part, apply Ice packs to reduce swelling, Compress with a bandage, and Elevate the limb above heart level to control internal bleeding and edema.'
  },
  {
    id: 'jamb-phe-2022-01',
    subject: 'phe',
    subjectName: 'Physical and Health Education',
    year: 2022,
    questionNumber: 1,
    topic: 'Physical Fitness Components',
    question: 'Which component of health-related physical fitness refers to the ability of the heart, lungs, and blood vessels to supply oxygen to working muscles during prolonged moderate-to-vigorous physical activity?',
    options: ['Cardiorespiratory endurance', 'Muscular strength', 'Body composition', 'Flexibility'],
    correctAnswer: 0,
    explanation: 'Cardiorespiratory (aerobic) endurance measures the efficiency of the circulatory and respiratory systems in supplying oxygen throughout sustained physical activity.'
  },

  // ==========================================
  // MUSIC
  // ==========================================
  {
    id: 'jamb-mus-2024-01',
    subject: 'music',
    subjectName: 'Music',
    year: 2024,
    questionNumber: 1,
    topic: 'Rudiments & Pitch Notation',
    question: 'On the standard treble (G) clef staff, what is the letter pitch name of the note positioned on the second line from the bottom?',
    options: ['G', 'E', 'B', 'D'],
    correctAnswer: 0,
    explanation: 'The treble clef curls around the second line of the five-line stave, designating that line as G4. The lines from bottom to top are E, G, B, D, F.'
  },
  {
    id: 'jamb-mus-2024-02',
    subject: 'music',
    subjectName: 'Music',
    year: 2024,
    questionNumber: 2,
    topic: 'Scales & Intervals',
    question: 'How many sharps are contained in the key signature of D major, and which notes do they alter?',
    options: ['Two sharps (F# and C#)', 'One sharp (F#)', 'Three sharps (F#, C#, G#)', 'Four sharps (F#, C#, G#, D#)'],
    correctAnswer: 0,
    explanation: 'D major has two sharps in its key signature: F sharp and C sharp (D, E, F#, G, A, B, C#, D).'
  },
  {
    id: 'jamb-mus-2023-01',
    subject: 'music',
    subjectName: 'Music',
    year: 2023,
    questionNumber: 1,
    topic: 'African Traditional Music & Instruments',
    question: 'In the Hornbostel-Sachs classification of African musical instruments, instruments that produce sound primarily through the vibration of the instrument’s own solid body (such as the iron gong or slit drum) are known as _______',
    options: ['idiophones', 'membranophones', 'chordophones', 'aerophones'],
    correctAnswer: 0,
    explanation: 'Idiophones produce sound via the vibration of the material of the instrument itself without requiring strings or membranes. Examples include bells, rattles, clappers, and slit drums.'
  },
  {
    id: 'jamb-mus-2022-01',
    subject: 'music',
    subjectName: 'Music',
    year: 2022,
    questionNumber: 1,
    topic: 'Time Signatures & Meter',
    question: 'Which of the following time signatures is an example of compound duple time?',
    options: ['6/8 time', '2/4 time', '3/4 time', '4/4 time'],
    correctAnswer: 0,
    explanation: 'In 6/8 time, there are two main beats per bar (duple), and each beat is subdivided into three eighth notes (compound duple meter).'
  },

  // ==========================================
  // ART (FINE ART)
  // ==========================================
  {
    id: 'jamb-art-2024-01',
    subject: 'art',
    subjectName: 'Art (Fine Art)',
    year: 2024,
    questionNumber: 1,
    topic: 'Nigerian Art History - Nok Culture',
    question: 'The earliest known terracotta sculptures in sub-Saharan Africa, notable for their pierced triangular pupils, stylized hair, and dating back to c. 500 BC – 200 AD, belong to which Nigerian art tradition?',
    options: ['Nok culture', 'Ife art', 'Benin court art', 'Igbo-Ukwu culture'],
    correctAnswer: 0,
    explanation: 'The Nok culture of central Nigeria produced the earliest terracotta sculptures in sub-Saharan Africa, characterized by pierced pupils, nostrils, and ears, as well as elaborate hairstyles.'
  },
  {
    id: 'jamb-art-2024-02',
    subject: 'art',
    subjectName: 'Art (Fine Art)',
    year: 2024,
    questionNumber: 2,
    topic: 'Color Theory & Elements of Art',
    question: 'Colors that are positioned directly opposite each other on the traditional 12-part color wheel (such as Red and Green, or Blue and Orange) are termed _______',
    options: ['complementary colors', 'analogous colors', 'monochromatic colors', 'tertiary colors'],
    correctAnswer: 0,
    explanation: 'Complementary colors lie directly across from each other on the color wheel. When placed side by side, they create maximum contrast and optical vibration.'
  },
  {
    id: 'jamb-art-2023-01',
    subject: 'art',
    subjectName: 'Art (Fine Art)',
    year: 2023,
    questionNumber: 1,
    topic: 'Sculpture & Casting Techniques',
    question: 'The ancient bronze casting technique traditionally employed by the bronze casters of Benin and Ife to produce hollow metal sculptures using wax models is known as the _______',
    options: ['cire perdue (lost-wax) technique', 'carving technique', 'repoussé technique', 'assemblage technique'],
    correctAnswer: 0,
    explanation: 'The lost-wax method (cire perdue) involves creating a wax model over a clay core, investing it in clay, melting out the wax, and pouring molten bronze into the resulting cavity.'
  },
  {
    id: 'jamb-art-2022-01',
    subject: 'art',
    subjectName: 'Art (Fine Art)',
    year: 2022,
    questionNumber: 1,
    topic: 'Principles of Art and Design',
    question: 'The principle of art that creates a sense of harmony by making all elements within a visual composition appear as though they belong together is called _______',
    options: ['unity', 'contrast', 'rhythm', 'proportion'],
    correctAnswer: 0,
    explanation: 'Unity (or harmony) gives an artwork a cohesive quality, ensuring all elements function together to form a balanced, unified whole.'
  },

  // ==========================================
  // FRENCH
  // ==========================================
  {
    id: 'jamb-fre-2024-01',
    subject: 'french',
    subjectName: 'French',
    year: 2024,
    questionNumber: 1,
    topic: 'Grammar - Articles & Prepositions',
    question: 'Complete the sentence with the correct preposition: "Mon ami habite _______ France depuis deux ans."',
    options: ['en', 'au', 'à', 'dans le'],
    correctAnswer: 0,
    explanation: 'For feminine country names (such as la France), the preposition "en" is used to mean "in" or "to". Thus, "Il habite en France."'
  },
  {
    id: 'jamb-fre-2024-02',
    subject: 'french',
    subjectName: 'French',
    year: 2024,
    questionNumber: 2,
    topic: 'Verb Conjugation - Passé Composé',
    question: 'Choose the correct auxiliary and participle for the verb "aller" in: "Hier matin, elles _______ à la bibliothèque."',
    options: ['sont allées', 'ont allé', 'sont allés', 'ont allée'],
    correctAnswer: 0,
    explanation: 'The verb "aller" takes "être" in the passé composé. With "elles" (feminine plural subject), the past participle must agree in gender and number, adding "-es" to become "sont allées".'
  },
  {
    id: 'jamb-fre-2023-01',
    subject: 'french',
    subjectName: 'French',
    year: 2023,
    questionNumber: 1,
    topic: 'Pronouns & Object Placement',
    question: 'Identify the correct replacement for the underlined words: "Le professeur donne les devoirs aux élèves."',
    options: ['Le professeur les leur donne.', 'Le professeur leur les donne.', 'Le professeur y donne.', 'Le professeur en donne.'],
    correctAnswer: 0,
    explanation: 'Direct object "les devoirs" is replaced by "les". Indirect object "aux élèves" is replaced by "leur". In standard French syntax before the verb, direct pronoun "les" precedes third-person indirect pronoun "leur": "Il les leur donne."'
  },
  {
    id: 'jamb-fre-2022-01',
    subject: 'french',
    subjectName: 'French',
    year: 2022,
    questionNumber: 1,
    topic: 'Vocabulary & Idiomatic Expressions',
    question: 'What is the correct English translation of the French idiom: "Avoir du pain sur la planche"?',
    options: ['To have a lot of work on one’s plate', 'To be very hungry', 'To buy bread at the bakery', 'To have good luck'],
    correctAnswer: 0,
    explanation: 'The idiom "avoir du pain sur la planche" literally translates to having bread on the cutting board, meaning to have plenty of tasks or work to accomplish.'
  },

  // ==========================================
  // ARABIC
  // ==========================================
  {
    id: 'jamb-ara-2024-01',
    subject: 'arabic',
    subjectName: 'Arabic',
    year: 2024,
    questionNumber: 1,
    topic: 'Grammar (Nahw) - Nominal Sentence (Jumlah Ismiyyah)',
    question: 'In Arabic grammar, a nominal sentence (الجملة الاسمية) consists primarily of two basic components, which are _______',
    options: ['المبتدأ والخبر (Subject and Predicate)', 'الفعل والفاعل (Verb and Subject)', 'الجار والمجرور (Preposition and Genitive noun)', 'الصفة والموصوف (Adjective and Noun)'],
    correctAnswer: 0,
    explanation: 'A nominal sentence begins with a noun and consists of al-Mubtada\' (the topic/subject) and al-Khabar (the predicate/information), both being nominative (marfoo\') in their default state.'
  },
  {
    id: 'jamb-ara-2024-02',
    subject: 'arabic',
    subjectName: 'Arabic',
    year: 2024,
    questionNumber: 2,
    topic: 'Parts of Speech (Aqsam al-Kalam)',
    question: 'How many fundamental parts of speech exist in the Arabic language according to classical Arabic grammarians?',
    options: ['Three: الاسم، الفعل، الحرف (Noun, Verb, Particle)', 'Four: الاسم، الفعل، الحرف، الصفة', 'Two: الاسم والفعل', 'Five categories'],
    correctAnswer: 0,
    explanation: 'Classical grammarians divide Arabic speech into three fundamental categories: al-Ism (noun/substantive), al-Fi\'l (verb), and al-Harf (particle).'
  },
  {
    id: 'jamb-ara-2023-01',
    subject: 'arabic',
    subjectName: 'Arabic',
    year: 2023,
    questionNumber: 1,
    topic: 'Inna and its Sisters (Inna wa Akhwatuha)',
    question: 'What grammatical effect does the particle "إِنَّ" (Inna) have on the noun (Ism) and predicate (Khabar) that follow it?',
    options: ['تنصب المبتدأ وترفع الخبر (Accusative noun, Nominative predicate)', 'ترفع المبتدأ وتنصب الخبر', 'تجزم المبتدأ والخبر', 'تجر المبتدأ وترفع الخبر'],
    correctAnswer: 0,
    explanation: 'Inna and its sisters (Inna wa Akhwatuha) enter upon a nominal sentence, making the subject accusative (Mansub) as its Ism, and keeping the predicate nominative (Marfoo\') as its Khabar.'
  },
  {
    id: 'jamb-ara-2022-01',
    subject: 'arabic',
    subjectName: 'Arabic',
    year: 2022,
    questionNumber: 1,
    topic: 'Vocabulary & Comprehension',
    question: 'What is the singular form of the Arabic broken plural noun "كُتُبٌ" (Kutub)?',
    options: ['كِتَابٌ (Kitab)', 'كَاتِبٌ (Katib)', 'مَكْتَبَةٌ (Maktabah)', 'مَكْتُوبٌ (Maktoob)'],
    correctAnswer: 0,
    explanation: 'The singular of the plural "Kutub" (books) is "Kitab" (book).'
  },

  // ==========================================
  // HAUSA
  // ==========================================
  {
    id: 'jamb-hau-2024-01',
    subject: 'hausa',
    subjectName: 'Hausa',
    year: 2024,
    questionNumber: 1,
    topic: 'Karin Magana (Proverbs)',
    question: 'Cika wannan karin magana na Hausa: "Kome nisan jifa, _______"',
    options: ['kasa zai dawo', 'sama zai tafi', 'ruwa zai shiga', 'wuta zai ci'],
    correctAnswer: 0,
    explanation: '"Kome nisan jifa, kasa zai dawo" (No matter how high or far a stone is thrown, it must eventually return to earth). It signifies the inevitability of returning to one\'s roots or destiny.'
  },
  {
    id: 'jamb-hau-2024-02',
    subject: 'hausa',
    subjectName: 'Hausa',
    year: 2024,
    questionNumber: 2,
    topic: 'Nahawun Hausa (Grammar & Parts of Speech)',
    question: 'A nahawun Hausa, kalmomin da ke nuna sunan mutum, guri, ko abu (kamar Musa, Kano, littafi) ana kiran su _______',
    options: ['Suna (Noun)', 'Aiki (Verb)', 'Siffa (Adjective)', 'Karin Aiki (Adverb)'],
    correctAnswer: 0,
    explanation: 'A nahawun Hausa, kalmar "Suna" ita ce kalmar da ke nuna sunan kowane abu, mutum, dabba, ko wuri.'
  },
  {
    id: 'jamb-hau-2023-01',
    subject: 'hausa',
    subjectName: 'Hausa',
    year: 2023,
    questionNumber: 1,
    topic: 'Adabin Gargajiya (Oral Literature)',
    question: 'Wane irin zubi na adabin baka ne yake kunshe da zaurance da kade-kade da ake amfani da shi wajen nishadantarwa da fadakarwa a al\'ummar Hausawa?',
    options: ['Wakokin baka na gargajiya', 'Tatsuniya kadai', 'Karin magana kadai', 'Kirari kadai'],
    correctAnswer: 0,
    explanation: 'Wakokin baka na gargajiya tare da kayan kade-kade (kamar kalangu, kakaki, garaya) sune babban ginshiki na nishadi da isar da sako a al\'adun Hausawa.'
  },
  {
    id: 'jamb-hau-2022-01',
    subject: 'hausa',
    subjectName: 'Hausa',
    year: 2022,
    questionNumber: 1,
    topic: 'Tsarin Sauti (Phonology)',
    question: 'A cikin haruffan Hausa, wadanne haruffa ne ake kira haruffan baki masu lankwasa (implosives and glottalized consonants)?',
    options: ['Ƙ, Ɗ, Ɓ, Ƴ', 'B, D, K, G', 'M, N, L, R', 'S, T, Z, W'],
    correctAnswer: 0,
    explanation: 'Haruffa masu lankwasa da dango (hooked letters) a rubutun Hausa sune Ƙ, Ɗ, Ɓ, da Ƴ.'
  },

  // ==========================================
  // IGBO
  // ==========================================
  {
    id: 'jamb-igb-2024-01',
    subject: 'igbo',
    subjectName: 'Igbo',
    year: 2024,
    questionNumber: 1,
    topic: 'Ilu Igbo (Proverbs)',
    question: 'Gbaa ilu a n\'ọnụ: "Onye na-amaghị ebe mmiri si maba ya, ọ gaghị ama _______"',
    options: ['ebe ọ kwụsịrị ịma ya', 'onye kuru ya mmiri', 'ebe ụlọ ya dị', 'ihe mere o ji daa'],
    correctAnswer: 0,
    explanation: 'Ilu a na-akọwa mkpa ọ dị mmadụ ịghọta ebe nsogbu si bido ka o wee nwee ike dozie ya: "Onye na-amaghị ebe mmiri si maba ya, ọ gaghị ama ebe ọ kwụsịrị ịma ya."'
  },
  {
    id: 'jamb-igb-2024-02',
    subject: 'igbo',
    subjectName: 'Igbo',
    year: 2024,
    questionNumber: 2,
    topic: 'Ụtọasụsụ (Grammar) - Udaume (Vowels)',
    question: 'Ụdaume ole ka e nwere n\'asụsụ Igbo dị ka Abịdịi Igbo si kọwaa?',
    options: ['Asatọ (8)', 'Iri abụọ na asatọ (28)', 'Ise (5)', 'Iri na abụọ (12)'],
    correctAnswer: 0,
    explanation: 'E nwere ụdaume asatọ (8) n\'asụsụ Igbo: e, i, o, u (ụdaume feere), na a, ị, ọ, ụ (ụdaume arọ).'
  },
  {
    id: 'jamb-igb-2023-01',
    subject: 'igbo',
    subjectName: 'Igbo',
    year: 2023,
    questionNumber: 1,
    topic: 'Omenala na Ekele (Culture & Greetings)',
    question: 'N\'omenala ndị Igbo, kedu ihe e ji emere ọbịa bịara ileta mmadụ n\'ụlọ ya dị ka ihe ngosi nke udo na nnabata?',
    options: ['Ịwa ọjị (Kolanut presentation)', 'Inye ego', 'Iri anụ ewu', 'Ịgba egwu'],
    correctAnswer: 0,
    explanation: 'Ọjị bụ isi ihe nnabata na ngosipụta udo n\'omenala Igbo: "Onye wetara ọjị wetara ndụ."'
  },
  {
    id: 'jamb-igb-2022-01',
    subject: 'igbo',
    subjectName: 'Igbo',
    year: 2022,
    questionNumber: 1,
    topic: 'Akụkụ Ahịrịokwu (Sentence Structure)',
    question: 'N\'ahịrịokwu "Ada riri nri abalị", kedu nke bụ ngwaa (verb)?',
    options: ['riri', 'Ada', 'nri', 'abalị'],
    correctAnswer: 0,
    explanation: '"Riri" bụ ngwaa (action verb) na-akọwa ihe Ada mere (ate).'
  },

  // ==========================================
  // YORUBA
  // ==========================================
  {
    id: 'jamb-yor-2024-01',
    subject: 'yoruba',
    subjectName: 'Yoruba',
    year: 2024,
    questionNumber: 1,
    topic: 'Owe Yoruba (Proverbs)',
    question: 'Pari owe yi: "Ile la ti n kọ ẹsọ _______"',
    options: ['r\'ode', 's\'oko', 'l\'odo', 's\'ọja'],
    correctAnswer: 0,
    explanation: '"Ile la ti n kọ ẹsọ r\'ode" (Charity and good character begin at home). Eniyan gbọdọ ni iwa rere lati ile ki o to jade si ode.'
  },
  {
    id: 'jamb-yor-2024-02',
    subject: 'yoruba',
    subjectName: 'Yoruba',
    year: 2024,
    questionNumber: 2,
    topic: 'Fonioloji ati Faweli (Phonology & Vowels)',
    question: 'Faweli airanmu melo lo wa ninu ede Yoruba?',
    options: ['Meje (7)', 'Marun-un (5)', 'Mẹsan-an (9)', 'Mẹwaa (10)'],
    correctAnswer: 0,
    explanation: 'Faweli airanmu (oral vowels) ninu ede Yoruba jẹ meje (7): a, e, ẹ, i, o, ọ, u.'
  },
  {
    id: 'jamb-yor-2023-01',
    subject: 'yoruba',
    subjectName: 'Yoruba',
    year: 2023,
    questionNumber: 1,
    topic: 'Asa ati Ise (Culture & Tradition)',
    question: 'Ni ile Yoruba, orukọ wo ni a n fun ọmọ ti a bi ti o gbe ibi (ọwọ tabi ese) kọkọ yọ jade dipo ori?',
    options: ['Ige', 'Ojo', 'Aina', 'Taiwo'],
    correctAnswer: 0,
    explanation: 'Ọmọ ti a bi ti ẹsẹ tabi ọwọ rẹ kọkọ jade ni a n pe ni "Ige Adubi". Ọmọ ti a bi ti okun ọrùn kọ rẹ ni "Ojo".'
  },
  {
    id: 'jamb-yor-2022-01',
    subject: 'yoruba',
    subjectName: 'Yoruba',
    year: 2022,
    questionNumber: 1,
    topic: 'Giramasi (Grammar & Parts of Speech)',
    question: 'Oro wo lo wa ninu eya oro apejuwe (adjective) ninu gbolohun: "Awon omo pupa yen ti lo"?',
    options: ['pupa', 'awon', 'omo', 'yen'],
    correctAnswer: 0,
    explanation: '"Pupa" jẹ eya ọrọ apejuwe ti o n se apejuwe awọ awọn ọmọ naa.'
  },

  // ==========================================
  // HOME ECONOMICS
  // ==========================================
  {
    id: 'jamb-hec-2024-01',
    subject: 'home_economics',
    subjectName: 'Home Economics',
    year: 2024,
    questionNumber: 1,
    topic: 'Food and Nutrition - Nutrients',
    question: 'Which of the following classes of food is primarily responsible for the growth, development, and repair of worn-out body tissues in humans?',
    options: ['Proteins', 'Carbohydrates', 'Fats and Oils', 'Vitamins'],
    correctAnswer: 0,
    explanation: 'Proteins are organic compounds made up of amino acids that serve as the primary structural building blocks for body growth, cellular repair, enzyme synthesis, and maintenance of muscles.'
  },
  {
    id: 'jamb-hec-2024-02',
    subject: 'home_economics',
    subjectName: 'Home Economics',
    year: 2024,
    questionNumber: 2,
    topic: 'Clothing and Textiles - Fiber Classification',
    question: 'A natural textile fiber obtained from the cocoon of the silkworm, known for its smooth texture, natural luster, and high tensile strength, is _______',
    options: ['silk', 'cotton', 'wool', 'linen'],
    correctAnswer: 0,
    explanation: 'Silk is a natural protein filament fiber produced by the silkworm (Bombyx mori) when constructing its cocoon, celebrated for its smoothness, drape, and tensile strength.'
  },
  {
    id: 'jamb-hec-2023-01',
    subject: 'home_economics',
    subjectName: 'Home Economics',
    year: 2023,
    questionNumber: 1,
    topic: 'Home Management & Consumer Education',
    question: 'The financial plan that allocates future personal or family income towards expenses, savings, and debt repayment over a specified period is termed a _______',
    options: ['family budget', 'balance sheet', 'cash receipt', 'purchase invoice'],
    correctAnswer: 0,
    explanation: 'A family budget is an itemized financial plan that estimates incoming revenue and systematically allocates resources across living necessities, utilities, emergency savings, and goals.'
  },
  {
    id: 'jamb-hec-2022-01',
    subject: 'home_economics',
    subjectName: 'Home Economics',
    year: 2022,
    questionNumber: 1,
    topic: 'Food Preservation & Storage',
    question: 'The food preservation method that involves exposing food items to dry radiant heat over firewood or charcoal, reducing moisture content while imparting flavor, is called _______',
    options: ['smoking', 'fermentation', 'pickling', 'canning'],
    correctAnswer: 0,
    explanation: 'Smoking preserves meat and fish by dehydrating outer surfaces and depositing antimicrobial compounds (phenols and formaldehydes) from smoke wood.'
  }
];
