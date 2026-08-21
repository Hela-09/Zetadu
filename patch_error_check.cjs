const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/if \(err\?\.status === 503\) \{/g, 'if (err?.status === 503 || err?.message?.includes("503") || err?.status === "UNAVAILABLE" || err?.error?.code === 503) {');
code = code.replace(/if \(error\?\.status === 503\) \{/g, 'if (error?.status === 503 || error?.message?.includes("503") || error?.status === "UNAVAILABLE" || error?.error?.code === 503) {');

fs.writeFileSync('server.ts', code);
