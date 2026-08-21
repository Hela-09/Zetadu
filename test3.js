fetch('http://localhost:3000/api/nonexistent', { method: 'POST', body: new FormData() })
  .then(r => { console.log(r.status, r.ok); return r.text() })
  .then(t => console.log(t.substring(0, 100)))
