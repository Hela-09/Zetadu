const fs = require('fs');
let code = fs.readFileSync('src/components/PaymentGate.tsx', 'utf8');

code = code.replace("08200272572", "8100272572");

fs.writeFileSync('src/components/PaymentGate.tsx', code);
console.log("Updated account number");
