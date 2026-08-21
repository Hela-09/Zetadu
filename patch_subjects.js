import fs from 'fs';

let subjects = fs.readFileSync('src/components/Subjects.tsx', 'utf8');

// replace setSelectedSubject(subject) with handleSelectSubject(subject) in the onClick handlers
subjects = subjects.replace(
  `import { collection, getDocs, query, where } from 'firebase/firestore';`,
  `import { collection, getDocs, query, where, addDoc, updateDoc } from 'firebase/firestore';`
);

const handleSelectSubjectCode = `
  const handleSelectSubject = async (subject: any) => {
    setSelectedSubject(subject);
    if (user) {
       try {
          const snap = await getDocs(query(collection(db, 'subject_history'), where('uid', '==', user.uid), where('subjectId', '==', subject.id)));
          if (!snap.empty) {
             const docRef = snap.docs[0].ref;
             await updateDoc(docRef, {
                lastOpened: Date.now()
             });
          } else {
             await addDoc(collection(db, 'subject_history'), {
                uid: user.uid,
                subjectId: subject.id,
                name: subject.name,
                category: subject.category,
                lastOpened: Date.now(),
                totalTimeStudied: 0,
                completedQuestions: 0,
                averageScore: 0
             });
          }
       } catch(e) { console.warn(e); }
    }
  };
`;

subjects = subjects.replace(
  `const [progressData, setProgressData] = useState<Record<string, number>>({});`,
  `const [progressData, setProgressData] = useState<Record<string, number>>({});\n${handleSelectSubjectCode}`
);

// We need to change onClick={() => setSelectedSubject(subject)}
subjects = subjects.replace(/onClick=\{\(\) \=\> setSelectedSubject\(subject\)\}/g, `onClick={() => handleSelectSubject(subject)}`);

fs.writeFileSync('src/components/Subjects.tsx', subjects);

