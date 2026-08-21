import express from 'express';
import multer from 'multer';
import fetch from 'node-fetch';

const app = express();
const upload = multer({ limits: { fileSize: 1 } });
app.post('/upload', upload.single('file'), (req, res) => res.json({ success: true }));
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
app.listen(3006, async () => {
  const FormData = (await import('formdata-node')).FormData;
  const { fileFromSync } = await import('fetch-blob/from.js');
  const fd = new FormData();
  fd.append('file', fileFromSync('package.json'));
  const res = await fetch('http://localhost:3006/upload', { method: 'POST', body: fd });
  console.log(res.status, res.headers.get('content-type'));
  const text = await res.text();
  console.log(text);
  process.exit(0);
});
