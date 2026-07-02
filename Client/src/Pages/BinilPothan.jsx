import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MapPin, Award, BookOpen, Compass, Tv, Calendar, ArrowUpRight } from 'lucide-react'
import Lenis from 'lenis'
import binilImg from '../assets/BinilPothan.webp'
import ProfileLockOverlay from '../Components/ProfileLockOverlay.jsx'
import { LightLines } from '../Components/LightLines.jsx'
import { TypingKeyboard } from '../Components/TypingKeyboard.jsx'
import { ScrollDissolveReveal } from '../Components/ScrollDissolveReveal.jsx'
import { CylinderCarousel } from '../Components/CylinderCarousel.jsx'

// Helper to convert standard YouTube links to embed links
const getEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('youtube.com/embed/')) return url;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return url;
};

// 3D Interactive Tilt Card Component
function TiltCard({ children, className, index = 0 }) {
  const cardRef = React.useRef(null);

  // Alternating default tilt angles:
  // Card 1 tilts one way, Card 2 tilts the other
  const defaultX = index % 2 === 0 ? 4 : -4;
  const defaultY = index % 2 === 0 ? -6 : 6;

  React.useEffect(() => {
    const card = cardRef.current;
    if (card) {
      card.style.transform = `perspective(1000px) rotateX(${defaultX}deg) rotateY(${defaultY}deg) scale3d(1, 1, 1)`;
    }
  }, [defaultX, defaultY]);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((centerY - y) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `perspective(1000px) rotateX(${defaultX}deg) rotateY(${defaultY}deg) scale3d(1, 1, 1)`;
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-all duration-300 ease-out ${className || ""}`}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}

export default function BinilPothan() {
  const [profileUser, setProfileUser] = useState({
    name: 'Binil Pothen Babu',
    email: 'binil@bigtv.com',
    division: 'Senior News Editor',
    bio: 'Senior News Editor and Anchor at BIG TV Malayalam.',
    status: 'LIVE RECORD'
  })

  const [portfolio, setPortfolio] = useState({
    heroTitle: "Journalism of Impact: Truth in Presentation",
    heroSubtitle: "Senior News Editor & Anchor at BIG TV Malayalam. Managing desk strategy and anchoring flagship broadcasts after national correspondent tenures.",
    pillars: [
      { title: "Broadcast Anchoring", desc: "Commanding prime-time news bulletins, debate moderatorships, and live breaking coverages." },
      { title: "Desk Leadership", desc: "Supervising output desk operations, coordinating desk strategy, and editing regional copy feeds." },
      { title: "National Correspondence", desc: "Years of ground-level political reporting across Delhi and Mumbai bureaus for Kerala's leading news networks." }
    ],
    timeline: [
      { period: "2024 - PRESENT", title: "Desk Chief & Senior News Editor", desc: "BIG TV Malayalam. Prime-time news anchoring, managing output desk operations, and general news gathering strategy." },
      { period: "2020 - 2024", title: "Political Bureau Correspondent", desc: "National Bureaus (Delhi & Mumbai). On-site coverage of national events, major elections, and parliamentary briefings." },
      { period: "2016 - 2020", title: "Senior News Anchor & Reporter", desc: "Manorama News & Reporter TV. Anchor operations, prime-time bullet coordination, and high-profile political panels." },
      { period: "2012 - 2016", title: "Broadcast Journalist", desc: "MediaOne & News Malayalam 24/7. News gathering, copy desk operations, and anchor-side presentations." }
    ],
    broadcastHighlights: [],
    awards: [
      { title: "Outstanding Political Coverage", category: "Broadcast Journalism Awards", desc: "Awarded for exceptional ground reports and election bulletin coverage from the Delhi Bureau." }
    ],
    blogs: [
      {
        title: "The Dynamic Intersection of Newsroom Strategy and Live Presentation",
        date: "June 28, 2026",
        excerpt: "Reflections on bridging the gap between desk coordination and live primetime anchor delivery under breaking news pressure.",
        content: "A prime-time anchor must be more than a presenter reading copy; they must be a desk journalist who understands the deep structural flows of the story. Coordinating live satellite feeds, updating editorial bulletins in real time, and maintaining composure under the studio lights are all testaments to newsroom preparation."
      }
    ],
    events: [],
    youtubeLink: ""
  })

  const [loading, setLoading] = useState(true)
  const [selectedBlog, setSelectedBlog] = useState(null)
  const [isPaid, setIsPaid] = useState(true)
  const modalRef = useRef(null)
  const youtubeContainerRef = useRef(null)

  // Lock body scroll when blog modal is open
  useEffect(() => {
    if (selectedBlog) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedBlog])

  // Auto-scroll loop for the YouTube section, pausing on hover
  useEffect(() => {
    const container = youtubeContainerRef.current;
    if (!container || !portfolio.youtubeLink) return;

    let intervalId;
    let isHovered = false;

    const startAutoScroll = () => {
      intervalId = setInterval(() => {
        if (isHovered) return;
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScroll - 1) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll by roughly one video card size (e.g. 480px) + gap (32px)
          const cardWidth = container.clientWidth > 768 ? 512 : 332;
          container.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
      }, 4000);
    };

    const handleMouseEnter = () => { isHovered = true; };
    const handleMouseLeave = () => { isHovered = false; };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    startAutoScroll();

    return () => {
      clearInterval(intervalId);
      if (container) {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [portfolio.youtubeLink])

  // Initialize Lenis for Smooth Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return () => {
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    const fetchBinilData = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/users')
        if (res.ok) {
          const users = await res.json()
          const matched = users.find(u => u.email?.toLowerCase() === 'binil@bigtv.com')
          if (matched) {
            setIsPaid(matched.isPaid ?? false)
            setProfileUser({
              name: matched.name || 'Binil Pothen Babu',
              email: matched.email || 'binil@bigtv.com',
              division: matched.division || 'Senior News Editor',
              bio: matched.bio || 'Senior News Editor and Anchor at BIG TV Malayalam.',
              status: matched.status || 'LIVE RECORD'
            })
            const port = matched.portfolio || {}
            setPortfolio({
              heroTitle: port.heroTitle || "Journalism of Impact: Truth in Presentation",
              heroSubtitle: port.heroSubtitle || "Senior News Editor & Anchor at BIG TV Malayalam. Managing desk strategy and anchoring flagship broadcasts after national correspondent tenures.",
              pillars: port.pillars && port.pillars.length > 0 ? port.pillars : [
                { title: "Broadcast Anchoring", desc: "Commanding prime-time news bulletins, debate moderatorships, and live breaking coverages." },
                { title: "Desk Leadership", desc: "Supervising output desk operations, coordinating desk strategy, and editing regional copy feeds." },
                { title: "National Correspondence", desc: "Years of ground-level political reporting across Delhi and Mumbai bureaus for Kerala's leading news networks." }
              ],
              timeline: port.timeline && port.timeline.length > 0 ? port.timeline : [
                { period: "2024 - PRESENT", title: "Desk Chief & Senior News Editor", desc: "BIG TV Malayalam. Prime-time news anchoring, managing output desk operations, and general news gathering strategy." },
                { period: "2020 - 2024", title: "Political Bureau Correspondent", desc: "National Bureaus (Delhi & Mumbai). On-site coverage of national events, major elections, and parliamentary briefings." },
                { period: "2016 - 2020", title: "Senior News Anchor & Reporter", desc: "Manorama News & Reporter TV. Anchor operations, prime-time bullet coordination, and high-profile political panels." },
                { period: "2012 - 2016", title: "Broadcast Journalist", desc: "MediaOne & News Malayalam 24/7. News gathering, copy desk operations, and anchor-side presentations." }
              ],
              broadcastHighlights: port.broadcastHighlights || [],
              awards: port.awards && port.awards.length > 0 ? port.awards : [
                { title: "Outstanding Political Coverage", category: "Broadcast Journalism Awards", desc: "Awarded for exceptional ground reports and election bulletin coverage from the Delhi Bureau." }
              ],
              blogs: port.blogs || [],
              events: port.events || [],
              youtubeLink: port.youtubeLink || ''
            })
          }
        }
      } catch (err) {
        console.error('Failed to fetch Binil portfolio:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBinilData()
  }, [])

  useEffect(() => {
    if (!isPaid) {
      window.location.hash = `#/pending-payment?name=${encodeURIComponent("Binil Pothen Babu")}&role=${encodeURIComponent("Senior News Editor & Anchor")}`
    }
  }, [isPaid])

  const handleBack = () => {
    window.location.hash = '#/'
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070707] font-mono text-xs text-[#2563eb]">
        <div className="flex flex-col items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] animate-ping" />
          <span>CONNECTING TO NEWSROOM SECURE REGISTRY...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070707] text-white selection:bg-[#2563eb] selection:text-white font-sans relative overflow-x-hidden">
      {!isPaid && (
        <ProfileLockOverlay 
          name="Binil Pothen Babu" 
          division="Senior News Editor & Anchor" 
          handleBack={() => window.location.hash = '#/'} 
        />
      )}
      
      {/* Floating Header & Back Portal Button */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-transparent pointer-events-none"
      >
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-xs font-mono tracking-widest text-neutral-400 hover:text-white hover:border-white/30 transition-all duration-300 group cursor-pointer pointer-events-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          BACK TO DIRECTORY
        </button>

       
      </motion.header>

      {/* Hero Section with LightLines and TypingKeyboard */}
      <section className="relative w-full min-h-screen lg:h-screen overflow-hidden flex items-center justify-center py-20 lg:py-0">
        {/* Background Animation */}
        <LightLines 
          gradientFrom="#020617" 
          gradientTo="#070707" 
          lightColor="#2563eb"
          lineColor="rgba(255, 255, 255, 0.05)"
          linesOpacity={0.1}
          lightsOpacity={0.5}
        />

        {/* Content Overlay */}
        <div className="relative z-10 w-full max-w-container-max mx-auto px-6 md:px-margin-desktop h-auto lg:h-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 pt-20 lg:pt-16">
          
          {/* Left Side: Isometric Mechanical Typing Keyboard */}
          <div className="w-full lg:w-1/2 h-[280px] sm:h-[350px] lg:h-full flex items-center justify-center relative">
            <motion.div
              initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="w-full max-w-[550px] md:max-w-[750px] h-full flex items-center justify-center scale-[0.65] xs:scale-[0.8] sm:scale-90 lg:scale-100 origin-center"
            >
              <TypingKeyboard 
                autoTypeText={`I am ${profileUser.name}. ${profileUser.division} at BIG TV Malayalam.   `}
                scale={0.9}
                accentColor="#2563eb"
                secondaryAccent="#3b82f6"
              />
            </motion.div>
          </div>

          {/* Right Side: Portrait Image Card */}
          <div className="w-full lg:w-1/2 flex justify-center items-center mt-6 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="relative w-[280px] md:w-[350px] aspect-[3/4.2] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-neutral-900 group"
            >
              {/* Outer Glow Halo */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2563eb]/20 via-transparent to-transparent opacity-60 pointer-events-none z-10" />
              
              <img
                src={binilImg}
                alt={profileUser.name}
                className="w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-102"
              />

              {/* Tag Details */}
              <div className="absolute bottom-6 left-6 right-6 z-20 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col gap-1">
                <div className="font-display font-black text-lg tracking-tight uppercase">{profileUser.name}</div>
                <div className="font-mono text-[9px] tracking-wider font-bold uppercase">{profileUser.division}</div>
              
              </div>
            </motion.div>
          </div>

        </div>

      </section>

      {/* Career Sections utilizing ScrollDissolveReveal */}
      <section className="relative w-full bg-[#070707]">
        <ScrollDissolveReveal
          childrenFront={
            <div className="w-full max-w-5xl mx-auto px-6 py-12 flex flex-col justify-center h-full min-h-[450px]">
              <TiltCard index={0} className="bg-neutral-950/80 border border-neutral-900 rounded-3xl p-10 md:p-16 shadow-2xl relative overflow-hidden cursor-pointer">
                <div style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}>
                  {/* Accent Corner Light */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563eb]/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#2563eb]/10 flex items-center justify-center text-[#2563eb]">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] tracking-widest text-[#2563eb] uppercase font-bold">DESK CHIEF // EXECUTIVE SUMMARY</span>
                  </div>

                  <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                    {portfolio.heroTitle}
                  </h2>

                  <p className="font-body text-neutral-400 text-sm md:text-base leading-relaxed mb-8">
                    {portfolio.heroSubtitle}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 font-mono text-[10px] uppercase tracking-wider text-neutral-400 pt-6 border-t border-white/5">
                    <div>
                      <span className="text-[#2563eb] block mb-1">Tenure</span>
                      <span className="text-white font-bold">10+ Years</span>
                    </div>
                    <div>
                      <span className="text-[#2563eb] block mb-1">Division</span>
                      <span className="text-white font-bold">{profileUser.division}</span>
                    </div>
                    <div>
                      <span className="text-[#2563eb] block mb-1">Status</span>
                      <span className="text-white font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {profileUser.status}
                      </span>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>
          }
          childrenBack={
            <div className="w-full max-w-5xl mx-auto px-6 py-12 flex flex-col justify-center h-full min-h-[450px]">
              <TiltCard index={1} className="bg-neutral-950/80 border border-neutral-900 rounded-3xl p-10 md:p-16 shadow-2xl relative overflow-hidden cursor-pointer">
                <div style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}>
                  {/* Accent Corner Light */}
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#2563eb]/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#2563eb]/10 flex items-center justify-center text-[#2563eb]">
                      <Tv className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] tracking-widest text-[#2563eb] uppercase font-bold">REPORTING HISTORY // NETWORKS</span>
                  </div>

                  <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                    Delhi & Mumbai Bureau Operations
                  </h2>

                  <p className="font-body text-neutral-400 text-sm md:text-base leading-relaxed mb-6">
                    As a seasoned national correspondent and political reporter, he spent years on the ground in pivotal bureaus like Delhi and Mumbai, traveling extensively across the country to provide on-site coverage for major national news events, breaking stories, and elections.
                  </p>

                  <div className="mb-8">
                    <span className="font-mono text-[9px] tracking-widest text-neutral-500 uppercase block mb-3">Previous Networks</span>
                    <div className="flex flex-wrap gap-2">
                      {['Manorama News', 'Reporter TV', 'MediaOne', 'News Malayalam 24/7'].map((network, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 rounded-lg border border-white/5 bg-neutral-900/50 text-xs font-mono text-neutral-300"
                        >
                          {network}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[9px] text-[#2563eb] uppercase tracking-wider">
                    <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: "10s" }} />
                    Accredited by BIG TV Network Editorial Board
                  </div>
                </div>
              </TiltCard>
            </div>
          }
        />
      </section>

      <motion.section
        initial={{ opacity: 0, y: 50, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="py-24 relative z-10 bg-neutral-950/40 border-t border-white/5 overflow-hidden"
      >
        <div className="w-full max-w-container-max mx-auto px-6 md:px-margin-desktop text-center">
          <div className="flex flex-col items-center mb-12">
            <span className="font-mono text-[9px] tracking-[0.3em] text-[#2563eb] uppercase font-bold block mb-3">VETTING ARCHIVE // BROADCAST DECK</span>
            <h3 className="font-display text-2xl md:text-3xl font-extrabold uppercase tracking-tight">Upcoming Events & Briefings</h3>
          </div>

          <div className="w-full overflow-hidden flex items-center justify-center">
            <div className="relative w-full flex items-center justify-center scale-[0.72] xs:scale-[0.82] sm:scale-90 md:scale-100 origin-center py-4">
              <CylinderCarousel
                items={
                  portfolio.events && portfolio.events.length > 0
                    ? portfolio.events.map((event, idx) => ({
                        title: event.title,
                        desc: event.desc || '',
                        date: event.date || '2026',
                        tag: event.location || 'NEWSROOM',
                        code: `EV-${100 + idx}-CONF`,
                      }))
                    : [
                        {
                          title: "National Broadcast Synergy Summit",
                          desc: "Keynote address on regional media architecture and digital satellite integration.",
                          date: "2026-07-12",
                          tag: "Hyderabad",
                          code: "EV-HYD-2026",
                        },
                        {
                          title: "Ethics in Investigative Reporting",
                          desc: "A masterclass for senior correspondents covering ground verification and source protection.",
                          date: "2026-08-05",
                          tag: "BIG TV Newsroom",
                          code: "EV-ETH-2026",
                        },
                        {
                          title: "Visual Desk Strategy Symposium",
                          desc: "Discussing modern editing flows, real-time graphics rendering, and newsroom management.",
                          date: "2026-09-18",
                          tag: "Kochi Hub",
                          code: "EV-KOC-2026",
                        }
                      ]
                }
                animationDuration={28}
                cardWidth={300}
                cardHeight={200}
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Career Timeline Section */}
      <motion.section
        initial={{ opacity: 0, y: 50, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="py-24 relative z-10 border-t border-white/5"
      >
        <div className="w-full max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-mono text-[9px] tracking-[0.3em] text-[#2563eb] uppercase font-bold block mb-3">CHRONOLOGY // CAREER PATHWAY</span>
            <h3 className="font-display text-2xl md:text-3xl font-extrabold uppercase tracking-tight">Milestones of Leadership</h3>
          </div>

          <div className="relative border-l border-white/10 pl-6 md:pl-12 ml-4 flex flex-col gap-12">
            {portfolio.timeline.map((milestone, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: idx * 0.12, ease: "easeOut" }}
                className="relative pl-4 md:pl-6"
              >
                {/* Bullet Dot */}
                <div className="absolute -left-[31px] md:-left-[55px] top-7 w-4 h-4 rounded-full bg-[#070707] border-2 border-[#2563eb] flex items-center justify-center z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2563eb] animate-ping" />
                </div>

                <TiltCard index={idx} className="bg-neutral-900/40 border border-white/5 p-6 rounded-2xl hover:border-[#2563eb]/30 hover:bg-neutral-900/80 transition-colors duration-300 cursor-pointer">
                  <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
                    <span className="font-mono text-[9px] tracking-wider text-[#2563eb] font-bold block mb-1">
                      {milestone.period}
                    </span>
                    <h4 className="font-display font-black text-sm tracking-tight text-white mb-1 uppercase">
                      {milestone.title}
                    </h4>
                    {milestone.org && (
                      <h5 className="font-mono text-[9px] tracking-widest text-neutral-400 uppercase font-semibold mb-3">
                        {milestone.org}
                      </h5>
                    )}
                    <p className="font-body text-xs text-neutral-400 leading-relaxed max-w-2xl">
                      {milestone.desc}
                    </p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Blogs & Insights Section */}
      {portfolio.blogs && portfolio.blogs.length > 0 && (
        <section className="py-24 max-w-container-max mx-auto px-6 md:px-margin-desktop border-t border-white/5 bg-[#070707]" id="blogs">
          <div className="text-center mb-16">
            <span className="font-mono text-[9px] tracking-[0.3em] text-[#2563eb] uppercase font-bold block mb-3">WRITINGS // INSIGHT LOGS</span>
            <h3 className="font-display text-2xl md:text-3xl font-extrabold uppercase tracking-tight">Blogs & Insights</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {portfolio.blogs.map((blog, idx) => (
              <motion.article 
                key={idx}
                whileHover={{ y: -4 }}
                className="bg-neutral-950/80 border border-neutral-900 rounded-3xl hover:border-[#2563eb]/30 transition-all duration-300 flex flex-col justify-between text-left relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#2563eb]/5 rounded-full blur-2xl pointer-events-none" />
                
                {blog.image && (
                  <div className="w-full aspect-[16/10] overflow-hidden bg-neutral-900 border-b border-neutral-900">
                    <img 
                      src={blog.image} 
                      alt={blog.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                )}
                
                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                       <span className="font-mono text-[9px] text-[#2563eb] font-bold uppercase tracking-wider">EDITORIAL ARTICLE</span>
                       <span className="font-mono text-[9px] text-neutral-500">{blog.date}</span>
                    </div>
                    <h4 className="font-display text-lg font-extrabold text-white mb-3 leading-snug">{blog.title}</h4>
                    <p className="font-body text-xs text-neutral-400 leading-relaxed font-light mb-6">{blog.excerpt || (blog.content ? blog.content.substring(0, 120) + '...' : '')}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedBlog(blog)}
                    className="font-mono text-[10px] text-[#2563eb] hover:text-white transition-colors font-bold flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none text-left p-0 w-fit"
                  >
                    READ FULL ARTICLE →
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      )}

      {/* Prime-Time Showreel Section */}
      {portfolio.youtubeLink && (
        <section className="py-24 max-w-container-max mx-auto px-6 md:px-margin-desktop border-t border-white/5 bg-[#070707]" id="youtube">
          <div className="text-center mb-16">
            <span className="font-mono text-[9px] tracking-[0.3em] text-[#2563eb] uppercase font-bold block mb-3">ON-AIR // BROADCAST SHOWREEL</span>
            <h3 className="font-display text-2xl md:text-3xl font-extrabold uppercase tracking-tight">Prime-Time Showreel</h3>
          </div>

          <div 
            ref={youtubeContainerRef}
            className="flex gap-8 overflow-x-auto py-6 px-4 scrollbar-none snap-x snap-mandatory max-w-5xl mx-auto"
            style={{
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            <style>{`
              .scrollbar-none::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {portfolio.youtubeLink.split(',').map(s => s.trim()).filter(Boolean).map((link, idx) => {
              const embedUrl = getEmbedUrl(link);
              if (!embedUrl) return null;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative w-[280px] sm:w-[480px] aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl shrink-0 snap-center"
                >
                  <iframe
                    src={embedUrl}
                    className="w-full h-full border-none"
                    title={`YouTube Video ${idx + 1}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Blog Detail Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-[300] flex items-center justify-center p-4"
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div 
              ref={modalRef}
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-neutral-950 border border-neutral-800 rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto relative text-left shadow-2xl"
              onClick={e => e.stopPropagation()}
              data-lenis-prevent
            >
              {selectedBlog.image && (
                <div className="w-full aspect-[21/9] overflow-hidden bg-slate-900 border-b border-neutral-900">
                  <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-8 md:p-12 relative">
                <button 
                  onClick={() => setSelectedBlog(null)}
                  className="absolute top-6 right-6 font-mono text-xs tracking-wider text-neutral-400 hover:text-white cursor-pointer bg-transparent border-none"
                >
                  [ CLOSE ]
                </button>
                <div className="flex items-center gap-3 font-mono text-[10px] text-neutral-400 mb-6">
                  <span>{selectedBlog.date}</span>
                  <span>•</span>
                  <span className="text-[#2563eb] font-bold">EDITORIAL ARTICLE</span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-extrabold mb-6 leading-tight text-white">
                  {selectedBlog.title}
                </h2>
                <div className="w-12 h-[2px] bg-[#2563eb]/50 mb-8" />
                <div className="font-body text-xs md:text-sm text-neutral-300 leading-relaxed font-light whitespace-pre-wrap">
                  {selectedBlog.content}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION: CONNECT & SOCIAL GATEWAY */}
      <section className="py-24 max-w-container-max mx-auto px-6 md:px-margin-desktop border-t border-white/5 bg-[#070707]" id="connect">
        <div className="text-center mb-16">
          <span className="font-mono text-[9px] tracking-[0.3em] text-[#2563eb] uppercase font-bold block mb-3">VERIFIED CONTACT // MEDIA SYNERGY</span>
          <h3 className="font-display text-2xl md:text-3xl font-extrabold uppercase tracking-tight">Social Gateway</h3>
        </div>

        <div className="relative max-w-lg mx-auto">
          <div className={`flex flex-wrap justify-center gap-6 transition-all duration-300 ${!isPaid ? 'blur-md pointer-events-none select-none' : ''}`}>
            <a 
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-5 bg-neutral-950 hover:bg-[#2563eb] text-white hover:text-white border border-white/5 transition-all font-mono text-[10px] uppercase font-bold tracking-widest rounded-2xl shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
              Facebook Profile
            </a>
            <a 
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-5 bg-[#2563eb] text-white hover:bg-blue-600 transition-all font-mono text-[10px] uppercase font-bold tracking-widest rounded-2xl shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              Instagram Channel
            </a>
          </div>
          
          {!isPaid && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/65 backdrop-blur-sm rounded-2xl p-6 text-center border border-red-500/20">
              <span className="bg-red-500/10 border border-red-500/20 px-3.5 py-1 rounded-full text-[9px] font-mono tracking-widest text-red-500 uppercase font-bold mb-3">
                PENDING AMOUNT SIGNAL
              </span>
              <p className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest max-w-[280px] leading-relaxed">
                Access to verified gateways is currently gated. Please activate this registry profile from your dashboard.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-12 border-t border-slate-900 relative z-50 px-6 md:px-[60px]">
        <div className="max-w-container-max mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 bg-[#2563eb] rounded flex items-center justify-center text-white font-display font-black text-[10px]">B</span>
              <div className="font-display text-sm font-black tracking-widest text-[#2563eb] uppercase">{profileUser.name}</div>
            </div>
            <p className="font-mono text-[8px] text-slate-500 tracking-wider">CORRESPONDENT DOSSIER // DEPT CHIEF DIVISION</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <p className="font-mono text-[9px] text-slate-500">
              © {new Date().getFullYear()} BIG TV NETWORK. ALL RIGHTS RESERVED.
            </p>
            <div className="flex items-center gap-3 font-bold text-slate-500 uppercase tracking-[0.2em] text-xs">
              <span>POWERED BY</span>
              <a href="https://www.socialbureau.in/enquiry-form" target="_blank" rel="noopener noreferrer" className="flex items-center">
                <img
                  src="https://www.socialbureau.in/assets/logo.webp"
                  alt="SocialBureau"
                  className="h-5 md:h-6 w-auto"
                />
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
