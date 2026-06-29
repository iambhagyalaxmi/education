import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description: string;
  category: string;
  order: number;
}

const FALLBACK_IMAGES = {
  hero: [
    { id: 'h1', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070', title: 'Modern classroom with students learning', description: '', category: 'Hero', order: 1 },
    { id: 'h2', url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070', title: 'Professional teacher conducting a class', description: '', category: 'Hero', order: 2 },
    { id: 'h3', url: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2086', title: 'Bright and clean learning environment', description: '', category: 'Hero', order: 3 },
  ],
  campus: [
    { id: 'c1', url: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?q=80&w=2070', title: 'Institute Front Gate', description: 'Our grand entrance welcoming future leaders.', category: 'Campus', order: 1 },
    { id: 'c2', url: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2086', title: 'Main Academic Building', description: 'State-of-the-art infrastructure for advanced learning.', category: 'Campus', order: 2 },
    { id: 'c3', url: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070', title: 'Smart Classroom', description: 'Interactive boards and modern tech for every student.', category: 'Campus', order: 3 },
    { id: 'c4', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070', title: 'Computer Laboratory', description: 'High-end workstations with the latest software.', category: 'Campus', order: 4 },
    { id: 'c5', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070', title: 'Science Laboratory', description: 'Well-equipped labs for practical experiments.', category: 'Campus', order: 5 },
    { id: 'c6', url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2190', title: 'Library', description: 'Thousands of books and digital resources.', category: 'Campus', order: 6 },
    { id: 'c7', url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069', title: 'Hostel', description: 'Comfortable and safe accommodation on campus.', category: 'Campus', order: 7 },
    { id: 'c8', url: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?q=80&w=2070', title: 'Cafeteria', description: 'Hygienic and healthy food for all students.', category: 'Campus', order: 8 },
    { id: 'c9', url: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=2070', title: 'Sports Ground', description: 'Expansive facilities for outdoor and indoor sports.', category: 'Campus', order: 9 },
    { id: 'c10', url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=2162', title: 'Auditorium', description: 'Large capacity auditorium for events and seminars.', category: 'Campus', order: 10 },
    { id: 'c11', url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069', title: 'Transport Facilities', description: 'Safe and wide-reaching bus network.', category: 'Campus', order: 11 },
    { id: 'c12', url: 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?q=80&w=2070', title: 'Green Campus', description: 'Eco-friendly and lush green environment.', category: 'Campus', order: 12 },
  ],
  featured: [
    { id: 'f1', url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070', title: 'Classroom Experience', description: 'Learn in smart classrooms equipped with the latest technology.', category: 'Featured', order: 1 },
    { id: 'f2', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071', title: 'Campus Life', description: 'Experience a vibrant student life with clubs, events, and extracurricular activities.', category: 'Featured', order: 2 },
    { id: 'f3', url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084', title: 'Placement Success', description: 'Build your career with excellent placement opportunities.', category: 'Featured', order: 3 },
    { id: 'f4', url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069', title: 'Hostel Facilities', description: 'Safe, comfortable, and well-maintained accommodation for students.', category: 'Featured', order: 4 },
    { id: 'f5', url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2190', title: 'Library', description: 'Access thousands of books, journals, and digital resources.', category: 'Featured', order: 5 },
    { id: 'f6', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070', title: 'Laboratories', description: 'Hands-on learning through advanced laboratories.', category: 'Featured', order: 6 },
  ],
  slider: [
    { id: 's1', url: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?q=80&w=2070', title: 'Institute Front Gate', description: '', category: 'Slider', order: 1 },
    { id: 's2', url: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2086', title: 'Campus View', description: '', category: 'Slider', order: 2 },
    { id: 's3', url: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070', title: 'Classroom', description: '', category: 'Slider', order: 3 },
    { id: 's4', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070', title: 'Laboratory', description: '', category: 'Slider', order: 4 },
    { id: 's5', url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2190', title: 'Library', description: '', category: 'Slider', order: 5 },
    { id: 's6', url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069', title: 'Hostel', description: '', category: 'Slider', order: 6 },
    { id: 's7', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071', title: 'Cultural Events', description: '', category: 'Slider', order: 7 },
    { id: 's8', url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084', title: 'Placement Activities', description: '', category: 'Slider', order: 8 },
  ]
};

export default function LandingPage({ onLoginClick }: LandingPageProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [isSliderHovered, setIsSliderHovered] = useState(false);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setImages(data);
        }
      })
      .catch(err => console.error("Could not fetch gallery images:", err));
  }, []);

  const getImagesByCategory = (category: string, fallback: GalleryImage[]) => {
    const filtered = images.filter(img => img.category === category);
    return filtered.length > 0 ? filtered : fallback;
  };

  const heroImages = getImagesByCategory('Hero', FALLBACK_IMAGES.hero);
  const sliderImages = getImagesByCategory('Slider', FALLBACK_IMAGES.slider);
  const campusImages = getImagesByCategory('Campus', FALLBACK_IMAGES.campus);
  const featuredImages = getImagesByCategory('Featured', FALLBACK_IMAGES.featured);

  // Hero Auto-crossfade
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Slider Auto-slide
  useEffect(() => {
    if (sliderImages.length <= 1 || isSliderHovered) return;
    const interval = setInterval(() => {
      setSliderIndex(prev => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [sliderImages.length, isSliderHovered]);

  const handleInquirySubmit = (e: FormEvent) => {
    e.preventDefault();
    alert("Thank you for your interest! Our admissions team will contact you shortly.");
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 selection:bg-emerald-200 scroll-smooth">
      
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-extrabold text-white tracking-tight drop-shadow-md">
            Edu<span className="text-emerald-400">Bot</span> Institute
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-white/90 font-medium drop-shadow-sm">
          <a href="#courses" className="hover:text-emerald-300 transition-colors">Programs</a>
          <a href="#campus" className="hover:text-emerald-300 transition-colors">Campus</a>
          <a href="#featured" className="hover:text-emerald-300 transition-colors">Life @ EduBot</a>
        </div>
        <button 
          onClick={onLoginClick}
          className="px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg"
        >
          Portal Login
        </button>
      </nav>

      {/* 1. Hero Header */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-slate-900">
        {heroImages.map((img, idx) => (
          <div 
            key={img.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === heroIndex ? 'opacity-100 z-0' : 'opacity-0 z-[-1]'}`}
          >
            <img 
              src={img.url} 
              alt={img.title}
              loading="lazy"
              className="w-full h-full object-cover animate-[scale-up_10s_ease-out_infinite_alternate]"
            />
            {/* Deep overlay for contrast */}
            <div className="absolute inset-0 bg-[#0f172a]/70 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-90" />
          </div>
        ))}

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-12 animate-fade-in-up">
          <span className="inline-block py-1 px-4 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold text-sm uppercase tracking-widest mb-6 backdrop-blur-sm">
            Admissions Open 2026
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-xl">
            Shaping Future <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Innovators
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Master highly demanded skills through our intensive degree programs. Build your portfolio, land top-tier jobs, and connect with a global alumni network in a world-class environment.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#inquiry" className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 hover:-translate-y-1 flex items-center gap-2">
              Apply Now <ArrowRight size={20} />
            </a>
            <a href="#courses" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold rounded-xl transition-all duration-300 hover:-translate-y-1">
              Explore Courses
            </a>
          </div>
        </div>
      </section>

      {/* 2. Trust Bar */}
      <section className="bg-[#0f172a] border-b border-slate-800 py-12 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-800">
            <div>
              <p className="text-4xl font-extrabold text-white mb-1">94%</p>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Job Placement</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-white mb-1">50+</p>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Expert Faculty</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-white mb-1">10k+</p>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Global Alumni</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-white mb-1">#1</p>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Tech Institute Ranking</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Image Slider Carousel */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
          <h2 className="text-4xl font-extrabold text-[#0f172a] mb-4 tracking-tight">Discover Our Campus</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">Take a glimpse into our vibrant and world-class educational ecosystem.</p>
        </div>
        
        <div className="max-w-6xl mx-auto relative group rounded-3xl overflow-hidden shadow-2xl"
             onMouseEnter={() => setIsSliderHovered(true)}
             onMouseLeave={() => setIsSliderHovered(false)}>
          
          <div className="relative aspect-[21/9] w-full bg-slate-100">
            {sliderImages.map((img, idx) => (
              <div 
                key={img.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === sliderIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                <img src={img.url} alt={img.title} loading="lazy" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <h3 className="text-3xl font-bold text-white mb-2">{img.title}</h3>
                  {img.description && <p className="text-white/80 text-lg">{img.description}</p>}
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setSliderIndex(prev => (prev - 1 + sliderImages.length) % sliderImages.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={() => setSliderIndex(prev => (prev + 1) % sliderImages.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={24} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-y-1/2 flex gap-2 z-20">
            {sliderImages.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setSliderIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${idx === sliderIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Sections */}
      <section id="featured" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 space-y-24">
          {featuredImages.map((img, idx) => (
            <div key={img.id} className={`flex flex-col md:flex-row items-center gap-12 lg:gap-20 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="w-full md:w-1/2 rounded-3xl overflow-hidden shadow-2xl relative group aspect-[4/3] bg-slate-200">
                <img src={img.url} alt={img.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-3xl" />
              </div>
              <div className="w-full md:w-1/2 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm">
                  <CheckCircle2 size={16} /> Highlight
                </div>
                <h2 className="text-4xl font-extrabold text-[#0f172a] leading-tight tracking-tight">{img.title}</h2>
                <p className="text-lg text-slate-600 leading-relaxed">{img.description}</p>
                <button className="text-emerald-600 font-bold hover:text-emerald-700 flex items-center gap-2 group transition-colors">
                  Learn more about {img.title} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Campus Highlights Grid */}
      <section id="campus" className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-[#0f172a] mb-6 tracking-tight">Campus Highlights</h2>
            <p className="text-slate-600 text-lg">Explore the facilities and infrastructure that make EduBot Institute a premium destination for holistic learning.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {campusImages.map((img) => (
              <div key={img.id} className="group rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
                  <img src={img.url} alt={img.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-slate-800 text-lg mb-2">{img.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-grow">{img.description}</p>
                  <button className="w-full py-2 bg-emerald-50 text-emerald-700 font-semibold rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                    View More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Footer / CTA */}
      <section id="inquiry" className="py-24 bg-[#0f172a] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-slate-300 text-lg mb-10">Join thousands of successful graduates. Apply now for the upcoming academic session.</p>
          
          <form onSubmit={handleInquirySubmit} className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 backdrop-blur-sm max-w-2xl mx-auto text-left shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <input required type="text" className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <input required type="email" className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" placeholder="john@example.com" />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">Program of Interest</label>
              <select required className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all">
                <option value="">Select a program...</option>
                <option value="btech">B.Tech Computer Science</option>
                <option value="bca">Bachelor of Computer Applications</option>
                <option value="mca">Master of Computer Applications</option>
                <option value="data">B.Sc Data Science</option>
              </select>
            </div>
            <button type="submit" className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 flex items-center justify-center gap-2">
              Submit Application Request <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </section>
      
      {/* CSS for custom animations */}
      <style>{`
        @keyframes scale-up {
          from { transform: scale(1); }
          to { transform: scale(1.05); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
