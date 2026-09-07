import { doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { StudyNote, NoteFlashcard, NotePracticeQuestion } from '../types';

const LOCAL_NOTES_KEY = 'zetadu_user_study_notes';

export const SAMPLE_NOTES = [
  {
    title: "Newton's Laws of Motion & Momentum",
    subject: "Physics",
    topic: "Mechanics",
    content: `Newton's Laws of Motion:
1. First Law (Law of Inertia): An object remains at rest or continues in a state of uniform motion in a straight line unless acted upon by a net external force. Inertia depends directly on the mass of an object.
2. Second Law: The rate of change of momentum is directly proportional to the applied force and takes place in the direction of the force. F = dp/dt = m × a (where F is net force in Newtons, m is mass in kg, and a is acceleration in m/s²).
3. Third Law: For every action, there is an equal and opposite reaction. Action and reaction forces act on different bodies simultaneously.

Linear Momentum:
- Momentum (p) = mass (m) × velocity (v). SI unit: kg·m/s or N·s.
- Principle of Conservation of Linear Momentum: In a closed, isolated system, the total linear momentum before collision equals the total linear momentum after collision (m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂).
- Impulse = Force × time = Change in momentum (Δp). Airbags and helmets increase the impact time, thereby reducing the impulsive force on passengers.`
  },
  {
    title: "Cellular Respiration & Energy Production",
    subject: "Biology",
    topic: "Physiology & Biochemistry",
    content: `Cellular Respiration Overview:
Cellular respiration is the biochemical process through which cells break down glucose to generate ATP (Adenosine Triphosphate), the universal energy currency of living organisms.

Equation:
C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 36-38 ATP

Major Stages:
1. Glycolysis:
   - Takes place in the cytoplasm.
   - Anaerobic process (does not require O₂).
   - Breaks 1 molecule of Glucose (6-carbon) into 2 molecules of Pyruvate (3-carbon).
   - Net yield: 2 ATP and 2 NADH.

2. Krebs Cycle (Citric Acid Cycle):
   - Occurs inside the mitochondrial matrix.
   - Pyruvate is converted to Acetyl-CoA, which enters the cycle.
   - Yields: CO₂, 2 ATP, 6 NADH, and 2 FADH₂ per glucose.

3. Oxidative Phosphorylation & Electron Transport Chain (ETC):
   - Located on the inner mitochondrial membrane (cristae).
   - Electrons from NADH and FADH₂ pass through protein complexes, pumping protons into the intermembrane space.
   - ATP Synthase uses the proton gradient (chemiosmosis) to generate 32-34 ATP.
   - Oxygen is the final electron acceptor, combining with protons to form water (H₂O).`
  },
  {
    title: "Supply, Demand & Market Equilibrium",
    subject: "Economics",
    topic: "Microeconomics",
    content: `Price Determination in Free Markets:

1. Law of Demand:
   - Ceteris paribus (all other factors remaining constant), as the price of a good increases, the quantity demanded decreases, and vice versa.
   - The demand curve slopes downward from left to right due to the income effect, substitution effect, and the law of diminishing marginal utility.
   - Determinants of Demand: Consumer income, tastes and preferences, prices of substitute and complementary goods, population size, and expectations of future price changes.

2. Law of Supply:
   - Ceteris paribus, as the price of a good increases, producers are willing and able to supply a higher quantity to maximize profits.
   - The supply curve slopes upward from left to right.
   - Determinants of Supply: Cost of production inputs, technological advancements, taxes and subsidies, number of sellers, and weather conditions (for agricultural commodities).

3. Market Equilibrium:
   - Occurs at the equilibrium price (Pe) where Quantity Demanded (Qd) = Quantity Supplied (Qs).
   - Excess Demand (Shortage): When Price < Pe, leading to upward pressure on prices.
   - Excess Supply (Surplus): When Price > Pe, leading to downward pressure on prices.`
  }
];

export async function getUserNotes(uid: string): Promise<StudyNote[]> {
  try {
    if (uid) {
      const snap = await getDoc(doc(db, 'notes', uid));
      if (snap.exists()) {
        const data = snap.data();
        if (data && Array.isArray(data.notes)) {
          localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(data.notes));
          return data.notes as StudyNote[];
        }
      }
    }
  } catch (err) {
    console.warn("Firestore notes fetch error (falling back to local cache):", err);
  }

  // Fallback to local storage
  try {
    const raw = localStorage.getItem(LOCAL_NOTES_KEY);
    if (raw) {
      return JSON.parse(raw) as StudyNote[];
    }
  } catch (e) {}

  return [];
}

export async function saveUserNote(uid: string, note: StudyNote): Promise<void> {
  try {
    // 1. Update local cache immediately
    const existing = await getUserNotes(uid);
    const index = existing.findIndex(n => n.id === note.id);
    let updated: StudyNote[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = note;
    } else {
      updated = [note, ...existing];
    }
    localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(updated));

    // 2. Persist to Firestore
    if (uid) {
      await setDoc(doc(db, 'notes', uid), {
        uid,
        notes: updated,
        updatedAt: Date.now()
      }, { merge: true });
    }
  } catch (err) {
    console.warn("Failed to persist note to Firestore:", err);
  }
}

export async function deleteUserNote(uid: string, noteId: string): Promise<void> {
  try {
    const existing = await getUserNotes(uid);
    const updated = existing.filter(n => n.id !== noteId);
    localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(updated));

    if (uid) {
      await setDoc(doc(db, 'notes', uid), {
        uid,
        notes: updated,
        updatedAt: Date.now()
      }, { merge: true });
    }
  } catch (err) {
    console.warn("Failed to delete note from Firestore:", err);
  }
}

export async function saveNoteFlashcardsToDeck(
  uid: string,
  deckName: string,
  subject: string,
  topic: string,
  cards: NoteFlashcard[]
): Promise<{ count: number }> {
  if (!uid || !cards || cards.length === 0) return { count: 0 };

  const now = Date.now();
  const cleanDeckName = deckName.trim() || subject || 'Study Notes Deck';
  const cleanSubject = subject.trim() || 'General';
  const cleanTopic = topic.trim() || 'Notes';

  let addedCount = 0;

  for (const card of cards) {
    try {
      await addDoc(collection(db, 'flashcards'), {
        uid,
        subject: cleanSubject,
        topic: cleanTopic,
        front: card.front.trim(),
        back: card.back.trim(),
        explanation: card.explanation?.trim() || '',
        example: '',
        difficulty: 'Medium',
        deckName: cleanDeckName,
        createdAt: now,
        lastReviewed: now,
        nextReview: now,
        reviews: 0,
        bookmarked: false
      });
      addedCount++;
    } catch (e) {
      console.warn("Error adding card to flashcards collection:", e);
    }
  }

  // Create or update deck metadata
  try {
    const deckId = `${uid}_${cleanDeckName.replace(/\s+/g, '_').toLowerCase()}`;
    await setDoc(doc(db, 'flashcard_decks', deckId), {
      uid,
      name: cleanDeckName,
      subject: cleanSubject,
      topic: cleanTopic,
      cardCount: addedCount,
      updatedAt: now
    }, { merge: true });
  } catch (deckErr) {
    console.warn("Deck metadata sync warning:", deckErr);
  }

  return { count: addedCount };
}
