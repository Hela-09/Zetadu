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
  
  app.listen(3001, async () => {
    const res = await fetch('http://localhost:3001/api/something', {
      method: 'POST',
      headers: { 'Accept': 'text/html' }
    });
    console.log(res.status, res.headers.get('content-type'));
    const text = await res.text();
    console.log(text.substring(0, 50));
    process.exit(0);
  });
}
test();
