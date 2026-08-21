const fs = require('fs');
let content = fs.readFileSync('src/components/Practice.tsx', 'utf8');

// Change const QuestionNavigator = () => ( to const renderQuestionNavigator = () => (
content = content.replace(
  'const QuestionNavigator = () => (',
  'const renderQuestionNavigator = () => ('
);

// Replace <QuestionNavigator /> with {renderQuestionNavigator()}
content = content.replaceAll(
  '<QuestionNavigator />',
  '{renderQuestionNavigator()}'
);

fs.writeFileSync('src/components/Practice.tsx', content);
console.log('patched practice inline');
