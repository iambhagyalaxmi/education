/**
 * Upload local and missing remote assets to Cloudinary
 */
require('dotenv').config({ path: './backend/.env' });
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadLocal(filePath, publicId) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'education_app/assets',
      public_id: publicId,
      overwrite: true,
    });
    console.log(`✅ Uploaded ${publicId}: ${result.secure_url}`);
  } catch (err) {
    console.error(`❌ Failed ${publicId}:`, err.message);
  }
}

async function uploadRemote(url, publicId) {
  try {
    const result = await cloudinary.uploader.upload(url, {
      folder: 'education_app/assets',
      public_id: publicId,
      overwrite: true,
    });
    console.log(`✅ Uploaded ${publicId}: ${result.secure_url}`);
  } catch (err) {
    console.error(`❌ Failed ${publicId}:`, err.message);
  }
}

async function main() {
  console.log('Uploading remaining assets to Cloudinary...\n');
  
  await uploadLocal('./frontend/src/assets/hero.png', 'hero_png');
  await uploadLocal('./frontend/src/assets/react.svg', 'react_svg');
  await uploadLocal('./frontend/src/assets/vite.svg', 'vite_svg');
  
  await uploadRemote('https://www.svgrepo.com/show/475656/google-color.svg', 'google_logo');
}

main();
