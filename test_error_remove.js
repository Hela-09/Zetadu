import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(
  /app\.use\(\(err: any, req: express\.Request, res: express\.Response, next: express\.NextFunction\) => \{[\s\S]*?\}\);/g,
  ''
);
fs.writeFileSync('server.ts', content);
