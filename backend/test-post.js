const http = require('http');

const data = JSON.stringify({
  code: '002',
  name: 'Test Course',
  durationYears: 4,
  description: 'Testing'
});

const req = http.request({
  hostname: '127.0.0.1',
  port: 5000,
  path: '/api/courses',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, res => {
  console.log(`statusCode: ${res.statusCode}`);
  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
