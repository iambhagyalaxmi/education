const https = require('https');

const urls = [
  'https://images.unsplash.com/photo-1592289659091-628d68962649?q=80&w=2070',
  'https://images.unsplash.com/photo-1564981797816-1043664bf78d?q=80&w=2070',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070',
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=2070'
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
