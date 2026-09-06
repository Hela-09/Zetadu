const fs = require('fs');
let code = fs.readFileSync('src/components/DailyChallenge.tsx', 'utf8');

const importAdd = `import { checkAndAwardAchievements, calculateStreakBonus } from '../lib/achievements';\n`;

if (!code.includes('../lib/achievements')) {
   code = code.replace("import { useAuth } from '../contexts/AuthContext';", "import { useAuth } from '../contexts/AuthContext';\nimport { checkAndAwardAchievements, calculateStreakBonus } from '../lib/achievements';");
}

const submitOld = `  const handleSubmit = async () => {
    if (isSubmitted || !user) return;
    setIsSubmitted(true);
    
    // Calculate Score
    let finalScore = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] !== undefined && isOptionCorrect(q, answers[idx])) {
        finalScore++;
      }
    });
    
    setScore(finalScore);
    
    // Award XP: base 50 + 15 per correct answer
    const earnedXp = 50 + (finalScore * 15);
    setXpAwarded(earnedXp);

    try {
      // 1. Record daily challenge
      await setDoc(doc(db, 'daily_challenges', challengeId), {
        uid: user.uid,
        date: todayStr,
        score: finalScore,
        totalQuestions: questions.length,
        xpAwarded: earnedXp,
        completedAt: serverTimestamp()
      });

      // 2. Update user profile (XP and Streak)
      const userRef = doc(db, 'users', user.uid);
      
      // Determine if we should increment streak
      // (If lastChallengeDate != todayStr, increment)
      const currentStreak = userProfile?.streak || 0;
      const lastChallenge = userProfile?.lastChallengeDate;
      let newStreak = currentStreak;
      
      if (lastChallenge !== todayStr) {
        if (lastChallenge) {
          const lastDate = new Date(lastChallenge);
          const todayDate = new Date(todayStr);
          const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
          
          if (diffDays <= 1) {
             newStreak += 1;
          } else {
             newStreak = 1; // broken streak
          }
        } else {
          newStreak = 1;
        }
      }

      await setDoc(userRef, {
        xp: increment(earnedXp),
        streak: newStreak,
        lastChallengeDate: todayStr
      }, { merge: true });

      // Refresh profile to update UI globally
      if (refreshProfile) await refreshProfile();
      
    } catch (err) {
      console.error("Failed to save results", err);
    }
  };`;

const submitNew = `  const handleSubmit = async () => {
    if (isSubmitted || !user) return;
    setIsSubmitted(true);
    
    // Calculate Score
    let finalScore = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] !== undefined && isOptionCorrect(q, answers[idx])) {
        finalScore++;
      }
    });
    
    setScore(finalScore);

    try {
      // Calculate Streak
      const currentStreak = userProfile?.streak || 0;
      const lastChallenge = userProfile?.lastChallengeDate;
      let newStreak = currentStreak;
      let streakBonus = 0;
      
      if (lastChallenge !== todayStr) {
        if (lastChallenge) {
          const lastDate = new Date(lastChallenge);
          const todayDate = new Date(todayStr);
          const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
          
          if (diffDays <= 1) {
             newStreak += 1;
          } else {
             newStreak = 1; // broken streak
          }
        } else {
          newStreak = 1;
        }
      }
      
      if (newStreak > currentStreak) {
         streakBonus = calculateStreakBonus(newStreak);
      }
      
      // Phase 4: Award XP (Complete Daily Challenge: +50 XP, +10 per correct answer)
      const earnedXp = 50 + streakBonus + (finalScore * 10);
      setXpAwarded(earnedXp);

      // 1. Record daily challenge
      await setDoc(doc(db, 'daily_challenges', challengeId), {
        uid: user.uid,
        date: todayStr,
        score: finalScore,
        totalQuestions: questions.length,
        xpAwarded: earnedXp,
        completedAt: serverTimestamp()
      });

      // 2. Update user profile (XP and Streak)
      const userRef = doc(db, 'users', user.uid);

      await setDoc(userRef, {
        xp: increment(earnedXp),
        streak: newStreak,
        lastChallengeDate: todayStr
      }, { merge: true });
      
      // Trigger achievements check
      setTimeout(() => checkAndAwardAchievements(user.uid), 1000);

      // Refresh profile to update UI globally
      if (refreshProfile) await refreshProfile();
      
    } catch (err) {
      console.error("Failed to save results", err);
    }
  };`;

code = code.replace(submitOld, submitNew);
fs.writeFileSync('src/components/DailyChallenge.tsx', code);
