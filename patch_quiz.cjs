const fs = require('fs');
let code = fs.readFileSync('src/components/Quiz.tsx', 'utf8');

const importAdd = `import { getLevelInfo, checkAndAwardAchievements } from '../lib/achievements';\nimport { increment } from 'firebase/firestore';`;

if (!code.includes('../lib/achievements')) {
   code = code.replace("import { addDoc, collection, serverTimestamp, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';", 
                       "import { addDoc, collection, serverTimestamp, doc, setDoc, getDoc, deleteDoc, increment } from 'firebase/firestore';\nimport { checkAndAwardAchievements } from '../lib/achievements';");
}

const oldSubmit = `        await addDoc(collection(db, 'learning_data'), {
          uid: user.uid,
          subject,
          topic,
          difficulty,
          score: finalScore,
          totalQuestions: questions.length,
          answeredQuestions: questions.map((q, i) => ({ 
             ...q, 
             userAnswerIndex: answers[i]
          })),
          updatedAt: serverTimestamp()
        });`;

const newSubmit = `        const docRef = await addDoc(collection(db, 'learning_data'), {
          uid: user.uid,
          subject,
          topic,
          difficulty,
          score: finalScore,
          totalQuestions: questions.length,
          answeredQuestions: questions.map((q, i) => ({ 
             ...q, 
             userAnswerIndex: answers[i]
          })),
          updatedAt: serverTimestamp()
        });
        
        // Phase 4: Award XP (Correct practice answer: +10 XP, Complete practice session: +25 XP)
        const earnedXp = (finalScore * 10) + 25;
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { xp: increment(earnedXp) }, { merge: true });
        
        // Trigger achievements check
        setTimeout(() => checkAndAwardAchievements(user.uid), 1000);`;

code = code.replace(oldSubmit, newSubmit);

fs.writeFileSync('src/components/Quiz.tsx', code);
