const fs = require('fs');
let code = fs.readFileSync('src/components/DailyChallenge.tsx', 'utf8');

code = code.replace(
  "import { collection, doc, setDoc, getDoc, serverTimestamp, increment } from 'firebase/firestore';",
  "import { collection, doc, setDoc, getDoc, getDocs, query, where, serverTimestamp, increment } from 'firebase/firestore';"
);

const oldCheck = `        const docRef = doc(db, 'daily_challenges', challengeId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCompletedToday(true);
          setPastScore({ score: docSnap.data().score, xp: docSnap.data().xpAwarded });
        }`;

const newCheck = `        const q = query(
          collection(db, 'daily_challenges'),
          where('uid', '==', user.uid),
          where('date', '==', todayStr)
        );
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
          const data = querySnap.docs[0].data();
          setCompletedToday(true);
          setPastScore({ score: data.score, xp: data.xpAwarded });
        }`;

code = code.replace(oldCheck, newCheck);

fs.writeFileSync('src/components/DailyChallenge.tsx', code);
