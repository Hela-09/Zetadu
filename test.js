fetch('http://localhost:3000/api/upload', { method: 'POST', body: new FormData() })
  .then(r => { console.log(r.status, r.ok); return r.text() })
  .then(console.log)
