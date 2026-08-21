const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(/const requireAuth = async \(req: express.Request, res: express.Response, next: express.NextFunction\) => \{ return next\(\);/g, 'const requireAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {');
fs.writeFileSync('server.ts', code);
