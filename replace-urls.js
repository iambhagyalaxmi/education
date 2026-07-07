const fs = require('fs');
const path = require('path');

const GOOGLE_LOGO_CLOUDINARY = 'https://res.cloudinary.com/adte9bpr/image/upload/v1783429011/education_app/assets/google_logo.svg';

// Replaces SVG repo URLs with Cloudinary
function replaceSvgRepo(filePath) {
  const fullPath = path.resolve(filePath);
  let content = fs.readFileSync(fullPath, 'utf-8');
  if (content.includes('https://www.svgrepo.com/show/475656/google-color.svg')) {
    content = content.replace(/https:\/\/www\.svgrepo\.com\/show\/475656\/google-color\.svg/g, GOOGLE_LOGO_CLOUDINARY);
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`✅ Updated ${filePath}`);
  }
}

replaceSvgRepo('./frontend/src/components/AuthLogin.tsx');
replaceSvgRepo('./frontend/src/components/faculty/FacultyLogin.tsx');

// For LandingPage.tsx, since we uploaded all the images in the previous step,
// we just need to replace the unsplash URLs with the exact ones generated.
// We'll map them based on the `IMAGES` array we had in seed-cloudinary.js

const IMAGES = [
  // HERO
  { category: 'hero',     order: 1,  url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428461/education_app/hero/hero_01_modern_classroom.jpg' },
  { category: 'hero',     order: 2,  url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428462/education_app/hero/hero_02_professional_teacher.jpg' },
  { category: 'hero',     order: 3,  url: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2086', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428464/education_app/hero/hero_03_learning_environment.jpg' },
  // CAMPUS
  { category: 'campus',   order: 1,  url: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?q=80&w=2070', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428465/education_app/campus/campus_01_institute_front_gate.jpg' },
  { category: 'campus',   order: 2,  url: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2086', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428466/education_app/campus/campus_02_main_academic_building.jpg' },
  { category: 'campus',   order: 3,  url: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428468/education_app/campus/campus_03_smart_classroom.jpg' },
  { category: 'campus',   order: 4,  url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428469/education_app/campus/campus_04_computer_laboratory.jpg' },
  { category: 'campus',   order: 5,  url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428470/education_app/campus/campus_05_science_laboratory.jpg' },
  { category: 'campus',   order: 6,  url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2190', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428472/education_app/campus/campus_06_library.jpg' },
  { category: 'campus',   order: 7,  url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428473/education_app/campus/campus_07_hostel.jpg' },
  { category: 'campus',   order: 8,  url: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?q=80&w=2070', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428475/education_app/campus/campus_08_cafeteria.jpg' },
  { category: 'campus',   order: 9,  url: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=2070', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428476/education_app/campus/campus_09_sports_ground.jpg' },
  { category: 'campus',   order: 10, url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=2162', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428477/education_app/campus/campus_10_auditorium.jpg' },
  { category: 'campus',   order: 11, url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428479/education_app/campus/campus_11_transport_facilities.jpg' },
  { category: 'campus',   order: 12, url: 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?q=80&w=2070', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428480/education_app/campus/campus_12_green_campus.jpg' },
  // FEATURED
  { category: 'featured', order: 1,  url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428481/education_app/featured/featured_01_classroom_experience.jpg' },
  { category: 'featured', order: 2,  url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428483/education_app/featured/featured_02_campus_life.jpg' },
  { category: 'featured', order: 3,  url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428484/education_app/featured/featured_03_placement_success.jpg' },
  { category: 'featured', order: 4,  url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428485/education_app/featured/featured_04_hostel_facilities.jpg' },
  { category: 'featured', order: 5,  url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2190', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428487/education_app/featured/featured_05_library_resources.jpg' },
  { category: 'featured', order: 6,  url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428488/education_app/featured/featured_06_laboratories.jpg' },
  // SLIDER
  { category: 'slider',   order: 1,  url: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?q=80&w=2070', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428489/education_app/slider/slider_01_institute_front_gate.jpg' },
  { category: 'slider',   order: 2,  url: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2086', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428491/education_app/slider/slider_02_campus_view.jpg' },
  { category: 'slider',   order: 3,  url: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428492/education_app/slider/slider_03_classroom.jpg' },
  { category: 'slider',   order: 4,  url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428493/education_app/slider/slider_04_laboratory.jpg' },
  { category: 'slider',   order: 5,  url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2190', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428495/education_app/slider/slider_05_library.jpg' },
  { category: 'slider',   order: 6,  url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428496/education_app/slider/slider_06_hostel.jpg' },
  { category: 'slider',   order: 7,  url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428497/education_app/slider/slider_07_cultural_events.jpg' },
  { category: 'slider',   order: 8,  url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084', newUrl: 'https://res.cloudinary.com/adte9bpr/image/upload/v1783428499/education_app/slider/slider_08_placement_activities.jpg' }
];

const landingPath = path.resolve('./frontend/src/components/LandingPage.tsx');
let landingContent = fs.readFileSync(landingPath, 'utf-8');

IMAGES.forEach(img => {
  const safeUrl = img.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape for regex
  landingContent = landingContent.replace(new RegExp(safeUrl, 'g'), img.newUrl);
});

fs.writeFileSync(landingPath, landingContent, 'utf-8');
console.log('✅ Updated LandingPage.tsx with Cloudinary URLs');
