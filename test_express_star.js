import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.get('*all', (req, res) => res.send('HTML'));
app.listen(3005, async () => {
  const res = await fetch('http://localhost:3005/api/upload');
  console.log(res.status);
  const text = await res.text();
  console.log(text.substring(0, 50));
  process.exit(0);
});
