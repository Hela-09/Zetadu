import fetch from 'node-fetch';
fetch('http://localhost:3000/api/upload', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer DUMMY' }
}).then(res => {
  console.log("Status:", res.status);
  console.log("Content-Type:", res.headers.get('content-type'));
  return res.text();
}).then(console.log);
