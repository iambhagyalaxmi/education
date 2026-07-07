/**
 * Cloudinary Image Seeder (Buffer Upload)
 * ----------------------------------------
 * Downloads each image locally then uploads the buffer to Cloudinary
 * to avoid 403 blocks from Unsplash when Cloudinary fetches by URL.
 * 
 * Run from project root: node seed-cloudinary.js
 */

require('dotenv').config({ path: './backend/.env' });
const cloudinary = require('cloudinary').v2;
const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const https = require('https');
const http = require('http');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

// ─── All website images categorised ──────────────────────────────────────────
const IMAGES = [
  // HERO
  { category: 'Hero',     order: 1,  title: 'Modern Classroom',         description: 'Modern classroom with students learning',                                        url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200' },
  { category: 'Hero',     order: 2,  title: 'Professional Teacher',      description: 'Professional teacher conducting a class',                                        url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200' },
  { category: 'Hero',     order: 3,  title: 'Learning Environment',      description: 'Bright and clean learning environment',                                          url: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200' },
  // CAMPUS
  { category: 'Campus',   order: 1,  title: 'Institute Front Gate',      description: 'Our grand entrance welcoming future leaders.',                                   url: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?q=80&w=1200' },
  { category: 'Campus',   order: 2,  title: 'Main Academic Building',    description: 'State-of-the-art infrastructure for advanced learning.',                        url: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200' },
  { category: 'Campus',   order: 3,  title: 'Smart Classroom',           description: 'Interactive boards and modern tech for every student.',                         url: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200' },
  { category: 'Campus',   order: 4,  title: 'Computer Laboratory',       description: 'High-end workstations with the latest software.',                               url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200' },
  { category: 'Campus',   order: 5,  title: 'Science Laboratory',        description: 'Well-equipped labs for practical experiments.',                                 url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200' },
  { category: 'Campus',   order: 6,  title: 'Library',                   description: 'Thousands of books and digital resources.',                                     url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200' },
  { category: 'Campus',   order: 7,  title: 'Hostel',                    description: 'Comfortable and safe accommodation on campus.',                                 url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1200' },
  { category: 'Campus',   order: 8,  title: 'Cafeteria',                 description: 'Hygienic and healthy food for all students.',                                   url: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?q=80&w=1200' },
  { category: 'Campus',   order: 9,  title: 'Sports Ground',             description: 'Expansive facilities for outdoor and indoor sports.',                           url: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=1200' },
  { category: 'Campus',   order: 10, title: 'Auditorium',                description: 'Large capacity auditorium for events and seminars.',                            url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=1200' },
  { category: 'Campus',   order: 11, title: 'Transport Facilities',      description: 'Safe and wide-reaching bus network.',                                           url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200' },
  { category: 'Campus',   order: 12, title: 'Green Campus',              description: 'Eco-friendly and lush green environment.',                                      url: 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?q=80&w=1200' },
  // FEATURED
  { category: 'Featured', order: 1,  title: 'Classroom Experience',      description: 'Learn in smart classrooms equipped with the latest technology.',                url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200' },
  { category: 'Featured', order: 2,  title: 'Campus Life',               description: 'Experience a vibrant student life with clubs, events, and extracurricular activities.', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200' },
  { category: 'Featured', order: 3,  title: 'Placement Success',         description: 'Build your career with excellent placement opportunities.',                      url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200' },
  { category: 'Featured', order: 4,  title: 'Hostel Facilities',         description: 'Safe, comfortable, and well-maintained accommodation for students.',             url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1200' },
  { category: 'Featured', order: 5,  title: 'Library Resources',         description: 'Access thousands of books, journals, and digital resources.',                   url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200' },
  { category: 'Featured', order: 6,  title: 'Laboratories',              description: 'Hands-on learning through advanced laboratories.',                               url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200' },
  // SLIDER
  { category: 'Slider',   order: 1,  title: 'Institute Front Gate',      description: '', url: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?q=80&w=1200' },
  { category: 'Slider',   order: 2,  title: 'Campus View',               description: '', url: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200' },
  { category: 'Slider',   order: 3,  title: 'Classroom',                 description: '', url: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200' },
  { category: 'Slider',   order: 4,  title: 'Laboratory',                description: '', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200' },
  { category: 'Slider',   order: 5,  title: 'Library',                   description: '', url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200' },
  { category: 'Slider',   order: 6,  title: 'Hostel',                    description: '', url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1200' },
  { category: 'Slider',   order: 7,  title: 'Cultural Events',           description: '', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200' },
  { category: 'Slider',   order: 8,  title: 'Placement Activities',      description: '', url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200' },
  // FACULTY AVATAR
  { category: 'Avatars',  order: 1,  title: 'Default Faculty Avatar',    description: 'Default faculty profile picture.',                                              url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
];

/** Download a URL as a Buffer with redirect following */
function downloadBuffer(url, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) return reject(new Error('Too many redirects'));
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CloudinarySeeder/1.0)',
        'Accept': 'image/*',
      }
    }, (res) => {
      // Follow redirects
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        return resolve(downloadBuffer(res.headers.location, redirectCount + 1));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

/** Upload a buffer to Cloudinary */
function uploadBuffer(buffer, publicId, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: publicId, overwrite: false, resource_type: 'image' },
      (error, result) => { if (error) reject(error); else resolve(result); }
    );
    stream.end(buffer);
  });
}

async function processImage(img) {
  const folder = `education_app/${img.category.toLowerCase()}`;
  const publicId = `${img.category.toLowerCase()}_${String(img.order).padStart(2,'0')}_${img.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase().slice(0, 40)}`;

  console.log(`  ⬇  Downloading [${img.category}/${img.order}]: ${img.title}...`);
  const buffer = await downloadBuffer(img.url);
  console.log(`  ⬆  Uploading to Cloudinary (${(buffer.length / 1024).toFixed(0)} KB)...`);

  try {
    const result = await uploadBuffer(buffer, publicId, folder);
    console.log(`  ✅ ${result.secure_url}`);
    return result.secure_url;
  } catch (err) {
    // Already exists — fetch URL
    if (err.http_code === 409 || (err.message && err.message.includes('already exists'))) {
      const resource = await cloudinary.api.resource(`${folder}/${publicId}`);
      console.log(`  ♻  Already exists → ${resource.secure_url}`);
      return resource.secure_url;
    }
    throw err;
  }
}

async function main() {
  console.log('\n🌟 Cloudinary Image Seeder (Buffer Mode)\n');
  console.log(`☁  Cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log(`📸 Total images: ${IMAGES.length}\n`);

  // Verify credentials first
  await cloudinary.api.ping();
  console.log('✅ Credentials verified!\n');

  // Clear existing DB gallery records
  console.log('🗑  Clearing existing gallery records from DB...');
  await prisma.galleryImage.deleteMany({});
  console.log('   Done.\n');

  let avatarUrl = null;

  for (const img of IMAGES) {
    try {
      const cloudUrl = await processImage(img);

      if (img.category === 'Avatars') {
        avatarUrl = cloudUrl;
        console.log(`  📌 Avatar saved: ${cloudUrl}\n`);
      } else {
        await prisma.galleryImage.create({
          data: {
            url: cloudUrl,
            title: img.title,
            description: img.description,
            category: img.category,
            order: img.order,
            isActive: true,
          },
        });
        console.log(`  💾 Saved to DB.\n`);
      }
    } catch (err) {
      console.error(`  ❌ FAILED [${img.title}]: ${err.message}\n`);
    }
  }

  const total = await prisma.galleryImage.count();
  console.log(`\n✅ Done! ${total} gallery images saved to DB with Cloudinary URLs.`);

  if (avatarUrl) {
    console.log(`\n👤 Faculty Avatar Cloudinary URL:\n   ${avatarUrl}`);
    const fs = require('fs');
    fs.writeFileSync('cloudinary-avatar-url.txt', avatarUrl);
    console.log('   (Saved to cloudinary-avatar-url.txt)\n');
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error('\n❌ Fatal error:', e.message || e);
  await prisma.$disconnect();
  process.exit(1);
});
