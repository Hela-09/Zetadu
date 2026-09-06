import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  dateEarned: string;
}

export const getLevelInfo = (xp: number) => {
  if (xp < 100) return { level: 1, title: 'Beginner', nextXp: 100 };
  if (xp < 250) return { level: 2, title: 'Learner', nextXp: 250 };
  if (xp < 500) return { level: 3, title: 'Scholar', nextXp: 500 };
  if (xp < 1000) return { level: 4, title: 'Expert', nextXp: 1000 };
  if (xp < 2500) return { level: 5, title: 'Master', nextXp: 2500 };
  if (xp < 5000) return { level: 6, title: 'Grandmaster', nextXp: 5000 };
  return { level: 7, title: 'Legend', nextXp: xp }; 
}

export const calculateStreakBonus = (streak: number) => {
   return Math.min(50, streak * 5); 
}

export const checkAndAwardAchievements = async (uid: string) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;
    
    const userData = userSnap.data();
    const currentAchievements: Achievement[] = userData.achievements || [];
    const earnedIds = new Set(currentAchievements.map(a => a.id));
    const newAchievements: Achievement[] = [];
    
    // Check 7-Day Streak
    if (userData.streak >= 7 && !earnedIds.has('streak_7')) {
      newAchievements.push({
        id: 'streak_7',
        title: '7-Day Streak',
        description: 'Completed a daily challenge or practice for 7 days in a row.',
        icon: 'Flame',
        dateEarned: new Date().toISOString()
      });
    }

    // Check First Practice Completed
    if (!earnedIds.has('first_practice')) {
      const q = query(collection(db, 'learning_data'), where('uid', '==', uid));
      const snap = await getDocs(q);
      if (!snap.empty) {
        newAchievements.push({
          id: 'first_practice',
          title: 'First Practice Completed',
          description: 'Completed your first practice session.',
          icon: 'CheckCircle',
          dateEarned: new Date().toISOString()
        });
      }
      
      // Check 100 Correct Answers
      if (!earnedIds.has('correct_100')) {
        let totalCorrect = 0;
        snap.forEach(doc => {
            totalCorrect += (doc.data().score || 0);
        });
        if (totalCorrect >= 100) {
           newAchievements.push({
             id: 'correct_100',
             title: '100 Correct Answers',
             description: 'Answered 100 practice questions correctly.',
             icon: 'Target',
             dateEarned: new Date().toISOString()
           });
        }
      }
      
      // Check Subject Master
      if (!earnedIds.has('subject_master')) {
        const subjectStats: Record<string, number> = {};
        snap.forEach(doc => {
           const d = doc.data();
           if (d.subject) {
             subjectStats[d.subject] = (subjectStats[d.subject] || 0) + (d.score || 0);
           }
        });
        if (Object.values(subjectStats).some(score => score >= 50)) {
           newAchievements.push({
             id: 'subject_master',
             title: 'Subject Master',
             description: 'Answered 50 correct questions in a single subject.',
             icon: 'Trophy',
             dateEarned: new Date().toISOString()
           });
        }
      }
    }

    if (newAchievements.length > 0) {
       await setDoc(userRef, {
         achievements: [...currentAchievements, ...newAchievements]
       }, { merge: true });
    }
  } catch(err) {
     console.error("Error checking achievements:", err);
  }
}
