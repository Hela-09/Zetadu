const http = require('http');
http.get('http://localhost:3000/__vite_ping', (res) => {
  console.log(res.statusCode);
}).on('error', (e) => {
  console.error(e);
});
