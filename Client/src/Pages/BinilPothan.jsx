import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Award, BookOpen, Compass, Tv, Calendar } from 'lucide-react'
import Lenis from 'lenis'
import binilImg from '../assets/BinilPothan.webp'
import { LightLines } from '../Components/LightLines.jsx'
import { TypingKeyboard } from '../Components/TypingKeyboard.jsx'
import { ScrollDissolveReveal } from '../Components/ScrollDissolveReveal.jsx'
import { CylinderCarousel } from '../Components/CylinderCarousel.jsx'

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

  const handleBack = () => {
    window.location.hash = '#/'
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  }

  return (
    <div className="min-h-screen bg-[#070707] text-white selection:bg-[#2563eb] selection:text-white font-sans relative overflow-x-hidden">
      
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
      <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
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
        <div className="relative z-10 w-full max-w-container-max mx-auto px-margin-desktop h-full flex flex-col md:flex-row items-center justify-between gap-12 pt-16">
          
          {/* Left Side: Isometric Mechanical Typing Keyboard */}
          <div className="w-full md:w-1/2 h-[50vh] md:h-full flex items-center justify-center relative">
            <motion.div
              initial={{ opacity: 0, x: -50, filter: "blur(5px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="w-full max-w-[550px] md:max-w-[750px] h-[380px] md:h-[550px] flex items-center justify-center translate-y-16 md:translate-y-24"
            >
              <TypingKeyboard 
                autoTypeText="I am Binil Pothen Babu. Senior News Editor and Anchor at BIG TV Malayalam.   "
                scale={0.9}
                accentColor="#2563eb"
                secondaryAccent="#3b82f6"
              />
            </motion.div>
          </div>

          {/* Right Side: Portrait Image Card */}
          <div className="w-full md:w-1/2 flex justify-center items-center">
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
                alt="Binil Pothen Babu"
                className="w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-102"
              />

              {/* Tag Details */}
              <div className="absolute bottom-6 left-6 right-6 z-20 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col gap-1">
                <div className="font-display font-black text-lg tracking-tight">BINIL POTHEN BABU</div>
                <div className="font-mono text-[9px] tracking-wider ] font-bold uppercase">Senior News Editor & Anchor</div>
              
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
                    Bridging Newsroom Strategy & <span className="text-[#2563eb]">On-Screen Presentation</span>
                  </h2>

                  <p className="font-body text-neutral-400 text-sm md:text-base leading-relaxed mb-8">
                    With over a decade of experience in visual media, Binil currently serves as a Senior News Editor and Anchor at BIG TV Malayalam, where he also acts as the Desk Chief. His career bridges the gap between newsroom strategy and on-screen presentation, along with ground-zero reporting.
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 font-mono text-[10px] uppercase tracking-wider text-neutral-400 pt-6 border-t border-white/5">
                    <div>
                      <span className="text-[#2563eb] block mb-1">Tenure</span>
                      <span className="text-white font-bold">10+ Years</span>
                    </div>
                    <div>
                      <span className="text-[#2563eb] block mb-1">Division</span>
                      <span className="text-white font-bold">Malayalam Desk</span>
                    </div>
                    <div>
                      <span className="text-[#2563eb] block mb-1">Status</span>
                      <span className="text-white font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> LIVE RECORD
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

      {/* Vetting Registry & Logs Section */}
      <motion.section
        initial={{ opacity: 0, y: 50, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="py-24 relative z-10 bg-neutral-950/40 border-t border-white/5 overflow-hidden"
      >
        <div className="w-full max-w-container-max mx-auto px-margin-desktop text-center">
          <div className="flex flex-col items-center mb-12">
            <span className="font-mono text-[9px] tracking-[0.3em] text-[#2563eb] uppercase font-bold block mb-3">VETTING ARCHIVE // BROADCAST DECK</span>
            <h3 className="font-display text-2xl md:text-3xl font-extrabold uppercase tracking-tight">Recent Editorial Logs</h3>
          </div>

          <div className="w-full">
            <CylinderCarousel
              items={[
                {
                  title: "National Election Broadcast 2026",
                  desc: "Live anchors leadership and regional visual desk feed synergy from Delhi Bureau operations.",
                  date: "June 2026",
                  tag: "Delhi Bureau",
                  code: "EL-2026-DEL",
                },
                {
                  title: "Mumbai Financial Bureau Report",
                  desc: "Strategic coordination of financial sector visual reports and municipal bureau analysis.",
                  date: "April 2026",
                  tag: "Mumbai Bureau",
                  code: "FB-2026-MUM",
                },
                {
                  title: "Visual Media Strategy Blueprint",
                  desc: "Re-engineering regional Malayalam news feeds and desk division output protocols.",
                  date: "March 2026",
                  tag: "Output Desk",
                  code: "STRAT-2026-MAL",
                },
                {
                  title: "Malayalam Prime-Time Debates",
                  desc: "Moderation and anchor operations for state-level political debates and live vetting.",
                  date: "Feb 2026",
                  tag: "Live Studio",
                  code: "DEB-2026-MAL",
                }
              ]}
              animationDuration={28}
              cardWidth={380}
              cardHeight={240}
            />
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
            {[
              {
                period: "2024 — Present",
                title: "Desk Chief & Senior News Editor",
                org: "BIG TV Malayalam",
                desc: "Coordinating prime-time anchor schedules, direct visual output feeds, and directing general visual media strategy for regional bureaus."
              },
              {
                period: "2020 — 2024",
                title: "Political Bureau Correspondent",
                org: "National Bureaus (Delhi & Mumbai)",
                desc: "Spent years on the ground in Delhi and Mumbai, traveling extensively to provide on-site coverage for national news events, elections, and breaking updates."
              },
              {
                period: "2016 — 2020",
                title: "Senior News Anchor & Reporter",
                org: "Manorama News & Reporter TV",
                desc: "Anchored prime-time debate bulletins, conducted high-profile political interviews, and directed regional visual media desks."
              },
              {
                period: "2012 — 2016",
                title: "Broadcast Journalist",
                org: "MediaOne & News Malayalam 24/7",
                desc: "Visual media foundations, ground reporting from southern regional outposts, copy editing, and anchoring afternoon news feeds."
              }
            ].map((milestone, idx) => (
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
                    <h5 className="font-mono text-[9px] tracking-widest text-neutral-400 uppercase font-semibold mb-3">
                      {milestone.org}
                    </h5>
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

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-12 border-t border-slate-900 relative z-10">
        <div className="max-w-container-max mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 bg-[#2563eb] rounded flex items-center justify-center text-white font-display font-black text-[10px]">B</span>
              <div className="font-display text-sm font-black tracking-widest text-[#2563eb]">BIG TV MALAYALAM</div>
            </div>
            <p className="font-mono text-[8px] text-slate-500 tracking-wider">CORRESPONDENT DOSSIER // DEPT CHIEF DIVISION</p>
          </div>
          <div className="text-center md:text-right">
            <p className="font-mono text-[9px] text-slate-500">
              © {new Date().getFullYear()} BIG TV NETWORK. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
