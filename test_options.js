import express from 'express';
import { createServer } from 'vite';
import fetch from 'node-fetch';

async function test() {
  const app = express();
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "spa"
  });
  app.use(vite.middlewares);
  
  app.listen(3007, async () => {
    const res = await fetch('http://localhost:3007/api/upload', {
      method: 'OPTIONS',
      headers: { 'Accept': 'application/json' }
    });
    console.log(res.status, res.headers.get('content-type'));
    const text = await res.text();
    console.log(text.substring(0, 50));
    process.exit(0);
  });
}
test();
