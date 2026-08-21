import fs from 'fs';

let home = fs.readFileSync('src/components/Home.tsx', 'utf8');

home = home.replace(
  `  const handleContinueSubject = (sub: SubjectHistory) => {
    // Just go to subjects for now, real app might auto-open it
    setView('subjects');
  };`,
  `  const handleContinueSubject = (sub: SubjectHistory) => {
    localStorage.setItem('educore_target_subject_id', sub.subjectId || sub.subject || '');
    setView('subjects');
  };`
);

fs.writeFileSync('src/components/Home.tsx', home);
