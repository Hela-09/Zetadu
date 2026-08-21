import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.get('*all', (req, res) => res.send('HTML'));
app.listen(3004, async () => {
  const res = await fetch('http://localhost:3004/api/upload', { method: 'POST' });
  const text = await res.text();
  console.log(text);
  process.exit(0);
});
