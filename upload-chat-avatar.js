require('dotenv').config({ path: './backend/.env' });
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function main() {
  try {
    const result = await cloudinary.uploader.upload('./frontend/public/child_book_avatar.png', {
      folder: 'education_app/assets',
      public_id: 'child_book_avatar',
      overwrite: true,
    });
    console.log(`✅ Uploaded child_book_avatar: ${result.secure_url}`);
  } catch (err) {
    console.error(`❌ Failed:`, err.message);
  }
}

main();
