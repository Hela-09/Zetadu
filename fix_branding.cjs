const fs = require('fs');

function replaceBrand(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/EduCore/g, 'Zetadu');
  code = code.replace(/educore/g, 'zetadu');
  fs.writeFileSync(file, code);
}

['src/components/PaymentGate.tsx', 'src/components/Tutor.tsx', 'src/components/Login.tsx', 'src/App.tsx', 'src/components/Practice.tsx', 'src/components/Profile.tsx'].forEach(file => {
  if (fs.existsSync(file)) {
    replaceBrand(file);
  }
});
console.log("Branding updated");
