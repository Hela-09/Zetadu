import fs from 'fs';

let profile = fs.readFileSync('src/components/Profile.tsx', 'utf8');

profile = profile.replace(
  `onClick={() => { setView('subjects'); }}`,
  `onClick={() => { localStorage.setItem('educore_target_subject_id', item.subjectId || item.subject || ''); setView('subjects'); }}`
);

fs.writeFileSync('src/components/Profile.tsx', profile);
