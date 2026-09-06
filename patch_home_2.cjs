const fs = require('fs');
let code = fs.readFileSync('src/components/Home.tsx', 'utf8');

const replacement = `  const startRecommendedPractice = () => {
    let target = topicCategories.weak[0] || topicCategories.developing[0] || topicCategories.strong[0];
    if (target) {
      localStorage.setItem('zetadu_target_topic', target.name);
      localStorage.setItem('zetadu_target_subject', target.subject);
      
      // Try to find the matching subject id
      const formattedSubject = target.subject.toLowerCase();
      let subjectId = formattedSubject.replace(/[^a-z0-9]/g, '-');
      if (formattedSubject.includes('english')) subjectId = 'english';
      else if (formattedSubject.includes('math')) subjectId = 'mathematics';
      
      localStorage.setItem('zetadu_target_subject_id', subjectId);
    }
    setView('practice');
  };`;

code = code.replace(
  /  const startRecommendedPractice = \(\) => {[\s\S]*?setView\('practice'\);\n  };/,
  replacement
);

fs.writeFileSync('src/components/Home.tsx', code);
