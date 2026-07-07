/**
 * Raw Cloudinary upload test using manual signature
 * to bypass any SDK issues and see the real error
 */
require('dotenv').config({ path: './backend/.env' });
const crypto = require('crypto');
const https = require('https');

const cloud = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log('Cloud:', cloud);
console.log('Key:', apiKey);
console.log('Secret:', apiSecret);

// Generate signature
const timestamp = Math.floor(Date.now() / 1000);
const paramsToSign = `folder=education_app/test&timestamp=${timestamp}`;
const signature = crypto
  .createHash('sha256')
  .update(paramsToSign + apiSecret)
  .digest('hex');

console.log('\nTimestamp:', timestamp);
console.log('Signature:', signature);

// 1x1 pixel PNG in base64
const imageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// Build form data
const boundary = '----FormBoundary' + Date.now();
const body = [
  `--${boundary}`,
  `Content-Disposition: form-data; name="file"`,
  '',
  imageData,
  `--${boundary}`,
  `Content-Disposition: form-data; name="api_key"`,
  '',
  apiKey,
  `--${boundary}`,
  `Content-Disposition: form-data; name="timestamp"`,
  '',
  String(timestamp),
  `--${boundary}`,
  `Content-Disposition: form-data; name="signature"`,
  '',
  signature,
  `--${boundary}`,
  `Content-Disposition: form-data; name="folder"`,
  '',
  'education_app/test',
  `--${boundary}--`,
].join('\r\n');

const options = {
  hostname: 'api.cloudinary.com',
  path: `/v1_1/${cloud}/image/upload`,
  method: 'POST',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': Buffer.byteLength(body),
  }
};

console.log('\nPOSTing to:', `https://api.cloudinary.com/v1_1/${cloud}/image/upload`);

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('\nStatus:', res.statusCode);
    console.log('Response:', data);
    try {
      const parsed = JSON.parse(data);
      if (parsed.secure_url) {
        console.log('\n✅ Upload SUCCESS! URL:', parsed.secure_url);
      } else {
        console.log('\n❌ Cloudinary Error:', parsed.error?.message || JSON.stringify(parsed));
      }
    } catch {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', e => console.error('Request error:', e.message));
req.write(body);
req.end();
