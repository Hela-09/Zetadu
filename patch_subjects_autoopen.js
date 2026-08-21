import fs from 'fs';

let subjects = fs.readFileSync('src/components/Subjects.tsx', 'utf8');

const effectCode = `
  useEffect(() => {
    const targetId = localStorage.getItem('educore_target_subject_id');
    if (targetId) {
      localStorage.removeItem('educore_target_subject_id');
      const target = ALL_SUBJECTS.find(s => s.id === targetId);
      if (target) {
        setSelectedSubject(target); // Note: we don't call handleSelectSubject to avoid an infinite loop of saving
      }
    }
  }, []);
`;

subjects = subjects.replace('useEffect(() => {', effectCode + '\n  useEffect(() => {');
fs.writeFileSync('src/components/Subjects.tsx', subjects);
