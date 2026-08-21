import { preview } from 'vite';
import fetch from 'node-fetch';

async function test() {
  const server = await preview({
    preview: { port: 3008 }
  });
  
  const res = await fetch('http://localhost:3008/api/upload', {
    method: 'POST',
    headers: { 'Accept': 'application/json' }
  });
  console.log(res.status, res.headers.get('content-type'));
  const text = await res.text();
  console.log(text.substring(0, 50));
  server.httpServer.close();
  process.exit(0);
}
test();
