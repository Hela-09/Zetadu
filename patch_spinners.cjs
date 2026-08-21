const fs = require('fs');

const cssAdd = `
/* Remove spinners from specific inputs */
.no-spinners::-webkit-inner-spin-button,
.no-spinners::-webkit-outer-spin-button,
.no-spinners::-webkit-search-cancel-button,
.no-spinners::-webkit-search-decoration,
.no-spinners::-webkit-search-results-button,
.no-spinners::-webkit-search-results-decoration {
  -webkit-appearance: none;
  margin: 0;
}
.no-spinners {
  -moz-appearance: textfield;
  appearance: textfield;
}
`;
fs.appendFileSync('src/index.css', cssAdd);

const files = [
  'src/components/Home.tsx',
  'src/components/Subjects.tsx',
  'src/components/Tutor.tsx',
  'src/components/Practice.tsx',
  'src/components/Profile.tsx',
  'src/components/Admin.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/className="(.*?)"/g, (match, p1) => {
    if (p1.includes('pl-9') || p1.includes('pl-11') || p1.includes('pl-12')) {
      if (!p1.includes('no-spinners')) {
        return `className="${p1} no-spinners"`;
      }
    }
    return match;
  });
  fs.writeFileSync(file, content);
}
console.log('patched spinners');
