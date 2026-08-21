const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// Update the catch blocks to gracefully handle 429 Quota Exceeded errors
content = content.replace(
  /if \(error\?\.status === 503 \|\| error\?\.message\?\.includes\("503"\) \|\| error\?\.status === "UNAVAILABLE" \|\| error\?\.error\?\.code === 503\) {/g,
  'if (error?.status === 503 || error?.message?.includes("503") || error?.status === "UNAVAILABLE" || error?.error?.code === 503 || error?.status === 429 || error?.message?.toLowerCase().includes("quota") || error?.message?.toLowerCase().includes("resource_exhausted")) {'
);

fs.writeFileSync('server.ts', content);
console.log('patched server.ts to handle quota errors gracefully');
