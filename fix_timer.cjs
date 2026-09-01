const fs = require('fs');

let pracCode = fs.readFileSync('src/components/Practice.tsx', 'utf8');

pracCode = pracCode.replace("{formatTime(timeElapsed)}", "{formatTime(timerRemaining)}");

fs.writeFileSync('src/components/Practice.tsx', pracCode);
