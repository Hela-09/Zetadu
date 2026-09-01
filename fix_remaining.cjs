const fs = require('fs');

function replaceBrand(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/educore/g, 'zetadu');
  code = code.replace(/EduCore/g, 'Zetadu');
  fs.writeFileSync(file, code);
}

['src/components/Home.tsx', 'src/components/Subjects.tsx', 'src/firebase/config.ts', 'src/contexts/AuthContext.tsx', 'src/components/Sidebar.tsx', 'src/components/Logo.tsx', 'index.html', 'public/manifest.json'].forEach(file => {
  if (fs.existsSync(file)) {
    replaceBrand(file);
  }
});
console.log("Remaining branding updated");
