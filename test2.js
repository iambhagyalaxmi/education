const https = require('https');

const urls = [
  'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=2070',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071'
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', (e) => {
      resolve({ url, status: e.message });
    });
  });
}

async function run() {
  for (const url of urls) {
    const result = await checkUrl(url);
    console.log(result.status, url);
  }
}

run();
