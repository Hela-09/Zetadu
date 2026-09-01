const fs = require('fs');
let code = fs.readFileSync('src/components/Practice.tsx', 'utf8');

const explanationOld = `{(() => {
                          if (answers[currentQIndex] === undefined) {
                            const correctIdx = getNormalizedCorrectIndex(question);
                            const label = correctIdx >= 0 ? String.fromCharCode(65 + correctIdx) : '?';
                            return \`The correct answer is Option \${label}.\\n\\n\${question.explanation}\`;
                          }
                          return question.explanation;
                        })()}`;

const explanationNew = `{(() => {
                          const correctIdx = getNormalizedCorrectIndex(question);
                          const label = correctIdx >= 0 ? String.fromCharCode(65 + correctIdx) : '?';
                          
                          if (answers[currentQIndex] === undefined) {
                            return \`Unanswered. The correct answer is Option \${label}.\\n\\n\${question.explanation}\`;
                          } else if (!isOptionCorrect(question, answers[currentQIndex])) {
                            return \`Incorrect. The correct answer is Option \${label}.\\n\\n\${question.explanation}\`;
                          }
                          return \`Correct!\\n\\n\${question.explanation}\`;
                        })()}`;

if (code.includes(explanationOld)) {
  code = code.replace(explanationOld, explanationNew);
  fs.writeFileSync('src/components/Practice.tsx', code);
  console.log('Answer explanation patched');
} else {
  console.log('Answer explanation block not found! Did not patch.');
}
