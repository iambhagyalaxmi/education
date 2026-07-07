/**
 * Step 1 - Verify Cloudinary credentials before uploading
 */
require('dotenv').config({ path: './backend/.env' });
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('\n🔍 Testing Cloudinary credentials...');
console.log(`   Cloud Name : ${process.env.CLOUDINARY_CLOUD_NAME}`);
console.log(`   API Key    : ${process.env.CLOUDINARY_API_KEY}`);
console.log(`   API Secret : ${process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.slice(0, 6) + '...' : 'NOT SET'}\n`);

cloudinary.api.ping()
  .then(result => {
    console.log('✅ Credentials are VALID!');
    console.log('   Response:', JSON.stringify(result));
  })
  .catch(err => {
    console.error('❌ Credentials INVALID:', err.message || err.error?.message);
    console.error('   Full error:', JSON.stringify(err.error || err));
  });
