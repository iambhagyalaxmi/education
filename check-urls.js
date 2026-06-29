const https = require('https');

const urls = [
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070',
  'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070',
  'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2086',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070',
  'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070',
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070',
  'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2190',
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069',
  'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?q=80&w=2070',
  'https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=2070',
  'https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=2162',
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069',
  'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?q=80&w=2070',
  'https://images.unsplash.com/photo-1523580494112-071dcb84968c?q=80&w=2070',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084'
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
