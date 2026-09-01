const fs = require('fs');

let code = fs.readFileSync('src/components/Practice.tsx', 'utf8');

// 1. Update confirmSubmit to update user XP and Streak
const submitOld = `  const confirmSubmit = async () => {
    setShowSubmitPrompt(false);
    const finalScore = calculateScore();
    setScore(finalScore);
    setIsSubmitted(true);
    
    if (user) {
      try {
        await addDoc(collection(db, 'learning_data'), {
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
      } catch (err) {
        console.warn("Failed to save score:", err);
      }
    }

    await clearSession();
  };`;

const submitNew = `  const confirmSubmit = async () => {
    setShowSubmitPrompt(false);
    const finalScore = calculateScore();
    setScore(finalScore);
    setIsSubmitted(true);
    
    if (user) {
      try {
        await addDoc(collection(db, 'learning_data'), {
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

        // XP and Level Calculation
        const xpEarned = (finalScore * 10) + 50; // 10 XP per correct answer + 50 base XP
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        let newXp = xpEarned;
        let streak = 1;
        let lastActive = new Date().toDateString();

        if (userSnap.exists()) {
           const data = userSnap.data();
           newXp = (data.xp || 0) + xpEarned;
           
           if (data.lastActive !== lastActive) {
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              if (data.lastActive === yesterday.toDateString()) {
                 streak = (data.streak || 0) + 1;
              } else {
                 streak = 1; // reset streak if missed a day
              }
           } else {
              streak = data.streak || 1;
           }
        }
        
        const newLevel = Math.floor(newXp / 1000) + 1;

        await setDoc(userRef, {
           xp: newXp,
           level: newLevel,
           streak: streak,
           lastActive: lastActive,
           updatedAt: serverTimestamp()
        }, { merge: true });

      } catch (err) {
        console.warn("Failed to save score and XP:", err);
      }
    }

    await clearSession();
  };`;

code = code.replace(submitOld, submitNew);
fs.writeFileSync('src/components/Practice.tsx', code);
console.log("Patched confirmSubmit in Practice.tsx");
