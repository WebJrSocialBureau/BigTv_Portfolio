import React, { useEffect, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { 
  Award, 
  ArrowLeft, 
  ExternalLink,
  MapPin,
  BookOpen,
  X,
  Calendar
} from 'lucide-react'
import Lenis from 'lenis'
import aparnaImg from '../assets/AparnaKurup.png'

export default function AparnaKurup() {
  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0,
      infinite: false,
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

  // Scroll-linked cinematic parallax animations for the Hero Section
  const { scrollY } = useScroll()

  // Image animations: scales up, shifts down, blurs, and fades on scroll
  const imageScale = useTransform(scrollY, [0, 600], [1, 1.18])
  const imageY = useTransform(scrollY, [0, 600], [0, 80])
  const imageOpacity = useTransform(scrollY, [0, 600], [1, 0.15])
  const imageBlur = useTransform(scrollY, [0, 600], ["blur(0px)", "blur(12px)"])

  // Interlocking Text animations: slide out horizontally and fade on scroll
  const textLeftX = useTransform(scrollY, [0, 600], [0, -120])
  const textRightX = useTransform(scrollY, [0, 600], [0, 120])
  const textOpacity = useTransform(scrollY, [0, 500], [1, 0])

  // Award Winning Cubic-Bezier easing
  const easing = [0.16, 1, 0.3, 1]

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: easing } }
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.4, ease: easing } }
  }

  // Stagger Animations for Cards in View
  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  }

  const getCardItemVariants = (rotateY, rotateX) => ({
    hidden: { 
      opacity: 0, 
      y: 60, 
      rotateY: rotateY, 
      rotateX: rotateX 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateY: rotateY,
      rotateX: rotateX,
      transition: { 
        duration: 1.2, 
        ease: easing 
      } 
    }
  })

  const expertisePillars1 = [
    { num: '01', title: 'Live News Anchoring', desc: 'Accustomed to anchor-driven breaking news coverage, coordinating live links, and maintaining on-screen composure under high-pressure scenarios.' },
    { num: '02', title: 'Prime-Time Presentation', desc: 'Over two decades of experience presenting flagship bulletins, debates, and issue-based current affairs talk shows.' },
    { num: '03', title: 'Editorial Management', desc: 'Coordinating news desks, managing output systems, and directing content strategy as Senior Coordinating Editor.' }
  ]

  const expertisePillars2 = [
    { num: '04', title: 'Current Affairs Production', desc: 'Conceptualizing, scriptwriting, and producing award-winning political specials, docuseries, and current affairs programming.' },
    { num: '05', title: 'Political Coverage', desc: 'Specialist in ground reporting, exit polls, and live panel coordination during critical national and state assembly elections.' },
    { num: '06', title: 'Broadcast Strategy', desc: 'Designing program formats, news grids, and editorial frameworks to maximize network reach and integrity.' }
  ]

  const careerTimeline = [
    {
      period: '2024 - PRESENT',
      role: 'Senior Coordinating Editor & Anchor',
      company: 'BIG TV 24/7',
      desc: 'Supervising editorial outputs, leading primetime debates, and presenting dynamic coverage on flagship shows like Q18, Penvote, and Parayanundu.'
    },
    {
      period: 'PREVIOUS TENURE',
      role: 'Coordinating Editor & Anchor',
      company: 'Mathrubhumi News',
      desc: 'Hosted the State Award-winning show Special Correspondent and spearheaded Njangalkkum Parayanundu. Provided leading anchor coverage for major election cycles.'
    },
    {
      period: 'FORMATIVE YEARS',
      role: 'Chief News Presenter',
      company: 'Asianet News',
      desc: 'Presented primetime bulletins, moderated daily panels, and coordinated key investigative reporting packages.'
    }
  ]

  const awards = [
    { title: 'Best Anchor', category: 'TMT South Indian Media Awards (2024, 2025)', desc: 'Recognized for consistent on-screen excellence, clarity of voice, and balanced moderation in political debates.' },
    { title: 'Excellence in Anchoring', category: 'Minnale Media Award (2024)', desc: 'Honored for exceptional broadcast composure, public engagement, and contribution to issue-based journalism.' },
    { title: 'Best Current Affairs Producer', category: 'State Television Award (2021)', desc: 'Awarded by the state government for producing Special Correspondent, documenting crucial socio-political issues.' }
  ]

  // Dynamic blogs, events & youtube fetched from the API
  const [blogs, setBlogs] = useState([])
  const [events, setEvents] = useState([])
  const [youtubeLink, setYoutubeLink] = useState('')
  const [selectedBlog, setSelectedBlog] = useState(null)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedBlog) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [selectedBlog])

  useEffect(() => {
    const fetchAparnaPortfolio = async () => {
      try {
        const res = await fetch('/api/users')
        if (res.ok) {
          const users = await res.json()
          const aparna = users.find(u => u.email?.toLowerCase() === 'aparna@bigtv.com')
          if (aparna?.portfolio) {
            setBlogs(aparna.portfolio.blogs || [])
            setEvents(aparna.portfolio.events || [])
            setYoutubeLink(aparna.portfolio.youtubeLink || '')
          }
        }
      } catch (err) {
        console.error('Failed to fetch Aparna portfolio:', err)
      }
    }
    fetchAparnaPortfolio()
  }, [])

  const academics = [
    { degree: 'Master of International Communication', institute: 'Unitec, Auckland University of New Zealand' },
    { degree: 'Master of Mass Communication', institute: "Women's Christian College, University of Madras" }
  ]

  return (
    <div className="bg-[#070709] text-white selection:bg-[#2e6359] selection:text-white antialiased overflow-visible font-body relative">

      {/* BLOG DETAIL MODAL */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              data-lenis-prevent
              className="relative bg-[#0d1a17] border border-[#32776c]/30 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Cover image */}
              {selectedBlog.image && (
                <div className="relative w-full h-56 overflow-hidden rounded-t-3xl">
                  <img
                    src={selectedBlog.image}
                    alt={selectedBlog.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d1a17]/90" />
                </div>
              )}

              {/* Content */}
              <div className="p-8">
                {selectedBlog.date && (
                  <span className="font-mono text-[9px] text-[#32776c] font-bold uppercase tracking-widest block mb-4">
                    {selectedBlog.date}
                  </span>
                )}
                <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white leading-tight mb-4">
                  {selectedBlog.title}
                </h2>
                {selectedBlog.excerpt && (
                  <p className="font-body text-sm text-[#32776c] leading-relaxed font-medium mb-6 border-l-2 border-[#32776c]/50 pl-4 italic">
                    {selectedBlog.excerpt}
                  </p>
                )}
                <div className="border-t border-white/5 pt-6">
                  <p className="font-body text-sm text-slate-300 leading-[1.9] whitespace-pre-wrap">
                    {selectedBlog.content || 'No content available.'}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* SECTION 1: HERO (DARK THEME - STICKY CARD 1) */}
      <div className="relative lg:sticky lg:top-0 min-h-screen lg:h-screen w-full bg-[#0d0d0f] z-10 overflow-visible lg:overflow-hidden flex flex-col justify-between border-b border-white/5 pt-6 pb-12 lg:py-0">
        {/* Design System Grid Lines */}
        <div className="absolute inset-y-0 left-8 md:left-16 w-[1px] bg-white/5 pointer-events-none -z-10" />
        <div className="absolute inset-y-0 right-8 md:right-16 w-[1px] bg-white/5 pointer-events-none -z-10" />

        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-50 py-6">
          <div className="max-w-container-max mx-auto px-0 flex justify-between items-center w-full">
           
            <div className="flex items-center gap-6">
              <a 
                href="#/" 
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold text-slate-400 hover:text-white transition-all tracking-wider"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Directory
              </a>
            </div>
          </div>
        </header>

        <section className="flex-grow flex flex-col justify-between pt-16 pb-12 relative px-0 max-w-container-max mx-auto w-full">
          
         

          {/* Central Interlocking Typography & Portrait */}
          <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 items-center justify-center relative py-8 w-full gap-8 lg:gap-0">
            
            {/* Left Text Block */}
            <div className="lg:col-span-4 text-center lg:text-left z-20 lg:-mr-16 lg:pr-4">
              <motion.h1 
                style={{ x: textLeftX, opacity: textOpacity }}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, ease: easing }}
                className="font-display text-5xl md:text-7xl lg:text-[6.5rem] font-extrabold tracking-tight leading-none text-[#32776c] uppercase"
              >
                Truth <br className="hidden lg:block" /> Meets
              </motion.h1>
            </div>

            {/* Central Portrait frame */}
            <div className="lg:col-span-4 flex justify-center z-10">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.4, ease: easing }}
                className="w-full max-w-[260px] md:max-w-[300px] aspect-[3/4] overflow-hidden bg-[#0d1a17] border border-[#32776c]/20 relative shadow-2xl"
              >
                <motion.img 
                  src={aparnaImg} 
                  alt="Aparna Kurup Portrait" 
                  style={{ 
                    scale: imageScale,
                    y: imageY,
                    filter: imageBlur,
                    opacity: imageOpacity
                  }}
                  className="w-full h-full object-cover origin-center"
                />
              </motion.div>
            </div>

            {/* Right Text Block */}
            <div className="lg:col-span-4 text-center lg:text-right z-20 lg:-ml-16 lg:pl-4">
              <motion.h1 
                style={{ x: textRightX, opacity: textOpacity }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, ease: easing }}
                className="font-display text-5xl md:text-7xl lg:text-[6.5rem] font-extrabold tracking-tight leading-none text-[#32776c] uppercase"
              >
                Integrity
              </motion.h1>
            </div>

          </div>

          {/* Hero Footer Meta Rows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full border-t border-white/5 pt-6 text-left">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="space-y-2 max-w-sm"
            >
              <h3 className="font-display text-lg font-bold text-white">Aparna Kurup</h3>
              <p className="font-body text-[11px] text-slate-400 leading-relaxed font-light">
                Brand Strategy &amp; Editorial Leadership. Coordinating Editor directing broadcast outputs, primetime presentation, and regional desks.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="flex flex-col justify-between items-start md:items-end gap-4"
            >
              <div className="text-left md:text-right space-y-1">
                <span className="font-mono text-[9px] text-[#32776c] tracking-widest uppercase block">CURRENT BASE</span>
                <span className="font-mono text-[10px] text-white flex items-center gap-1.5 justify-start md:justify-end">
                  <MapPin className="w-3.5 h-3.5 text-[#32776c]" /> HYDERABAD, INDIA
                </span>
              </div>
              
              
            </motion.div>
          </div>
        </section>
      </div>

      {/* SECTION 2a: AREAS OF EXPERTISE - PART I (LIGHT THEME - STICKY CARD 2a) */}
      <div className="relative lg:sticky lg:top-0 min-h-screen lg:h-screen w-full bg-[#fcfbf9] text-[#0d0d0f] z-20 overflow-visible lg:overflow-hidden flex flex-col justify-center shadow-[0_-20px_50px_rgba(0,0,0,0.1)] border-b border-black/5 pt-10 pb-16 lg:py-0">
        <div className="absolute inset-y-0 left-8 md:left-16 w-[1px] bg-black/5 pointer-events-none -z-10" />
        <div className="absolute inset-y-0 right-8 md:right-16 w-[1px] bg-black/5 pointer-events-none -z-10" />

        <section className="px-0 max-w-container-max mx-auto w-full">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={fadeInUp}
            className="mb-12 text-left"
          >
            <span className="font-mono text-xs text-[#32776c] tracking-[0.25em] uppercase mb-4 block">EXPERTISE // PART I</span>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold text-[#0d0d0f] uppercase tracking-tight">
              Core Specializations
            </h2>
          </motion.div>

          <motion.div 
            variants={cardContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full pt-4 [perspective:1500px]"
          >
            {expertisePillars1.map((pillar, idx) => {
              const initialRotateY = idx === 0 ? -12 : idx === 1 ? 0 : 12
              const initialRotateX = 6
              
              return (
                <motion.div
                  key={idx}
                  variants={getCardItemVariants(initialRotateY, initialRotateX)}
                  whileHover={{ 
                    rotateY: 0, 
                    rotateX: 0, 
                    scale: 1.05,
                    z: 40,
                    transition: { duration: 0.4, ease: easing }
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="bg-gradient-to-br from-[#1b3d37] to-[#0e1c19] border border-[#32776c]/30 hover:border-[#32776c]/60 rounded-3xl p-8 shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:shadow-[0_30px_70px_rgba(50,119,108,0.25)] transition-all duration-300 flex flex-col justify-between text-left h-[280px] relative group overflow-hidden"
                >
                  <div className="absolute -right-12 -top-12 w-28 h-28 bg-[#32776c]/10 rounded-full blur-2xl group-hover:bg-[#32776c]/20 transition-all duration-500" />
                  
                  <div style={{ transform: 'translateZ(30px)' }}>
                    <span className="font-mono text-xs text-[#32776c] font-bold block mb-6">
                      {pillar.num}
                    </span>
                    <h3 className="font-display text-lg font-extrabold text-white mb-3 group-hover:text-[#32776c] transition-colors leading-snug">
                      {pillar.title}
                    </h3>
                  </div>

                  <div style={{ transform: 'translateZ(20px)' }}>
                    <p className="font-body text-xs text-slate-300 leading-relaxed font-light">
                      {pillar.desc}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </section>
      </div>

      {/* SECTION 2b: AREAS OF EXPERTISE - PART II (DARK THEME - STICKY CARD 2b) */}
      <div className="relative lg:sticky lg:top-0 min-h-screen lg:h-screen w-full bg-[#0d0d0f] text-white z-25 overflow-visible lg:overflow-hidden flex flex-col justify-center shadow-[0_-20px_50px_rgba(0,0,0,0.2)] border-b border-white/5 pt-10 pb-16 lg:py-0">
        <div className="absolute inset-y-0 left-8 md:left-16 w-[1px] bg-white/5 pointer-events-none -z-10" />
        <div className="absolute inset-y-0 right-8 md:right-16 w-[1px] bg-white/5 pointer-events-none -z-10" />

        <section className="px-0 max-w-container-max mx-auto w-full">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={fadeInUp}
            className="mb-12 text-left"
          >
            <span className="font-mono text-xs text-[#32776c] tracking-[0.25em] uppercase mb-4 block">EXPERTISE // PART II</span>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold text-white uppercase tracking-tight">
              Strategic Capabilities
            </h2>
          </motion.div>

          <motion.div 
            variants={cardContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full pt-4 [perspective:1500px]"
          >
            {expertisePillars2.map((pillar, idx) => {
              const initialRotateY = idx === 0 ? -12 : idx === 1 ? 0 : 12
              const initialRotateX = 6
              
              return (
                <motion.div
                  key={idx}
                  variants={getCardItemVariants(initialRotateY, initialRotateX)}
                  whileHover={{ 
                    rotateY: 0, 
                    rotateX: 0, 
                    scale: 1.05,
                    z: 40,
                    transition: { duration: 0.4, ease: easing }
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="bg-gradient-to-br from-[#1b3d37] to-[#0e1c19] border border-[#32776c]/30 hover:border-[#32776c]/60 rounded-3xl p-8 shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:shadow-[0_30px_70px_rgba(50,119,108,0.25)] transition-all duration-300 flex flex-col justify-between text-left h-[280px] relative group overflow-hidden"
                >
                  <div className="absolute -right-12 -top-12 w-28 h-28 bg-[#32776c]/10 rounded-full blur-2xl group-hover:bg-[#32776c]/20 transition-all duration-500" />
                  
                  <div style={{ transform: 'translateZ(30px)' }}>
                    <span className="font-mono text-xs text-[#32776c] font-bold block mb-6">
                      {pillar.num}
                    </span>
                    <h3 className="font-display text-lg font-extrabold text-white mb-3 group-hover:text-[#32776c] transition-colors leading-snug">
                      {pillar.title}
                    </h3>
                  </div>

                  <div style={{ transform: 'translateZ(20px)' }}>
                    <p className="font-body text-xs text-slate-300 leading-relaxed font-light">
                      {pillar.desc}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </section>
      </div>

      {/* SECTION 3: CAREER TIMELINE (DARK THEME - STICKY CARD 3) */}
      <div className="relative lg:sticky lg:top-0 min-h-screen lg:h-screen w-full bg-[#0d0d0f] text-white z-30 overflow-visible lg:overflow-hidden flex flex-col justify-center shadow-[0_-20px_50px_rgba(0,0,0,0.3)] border-b border-white/5 pt-10 pb-16 lg:py-0">
        <div className="absolute inset-y-0 left-8 md:left-16 w-[1px] bg-white/5 pointer-events-none -z-10" />
        <div className="absolute inset-y-0 right-8 md:right-16 w-[1px] bg-white/5 pointer-events-none -z-10" />

        <section className="px-0 max-w-container-max mx-auto w-full">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={fadeInUp}
            className="mb-12 text-left"
          >
            <span className="font-mono text-xs text-[#32776c] tracking-[0.25em] uppercase mb-4 block">JOURNEY</span>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold text-white uppercase tracking-tight">
              Professional History
            </h2>
          </motion.div>

          {/* 3D Perspective Card Grid */}
          <motion.div 
            variants={cardContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full pt-4 [perspective:1500px]"
          >
            {careerTimeline.map((node, idx) => {
              // Alternate 3D isometric tilt angles
              const initialRotateY = idx % 2 === 0 ? -12 : 12
              const initialRotateX = 6
              
              return (
                <motion.div 
                  key={idx}
                  variants={getCardItemVariants(initialRotateY, initialRotateX)}
                  whileHover={{ 
                    rotateY: 0, 
                    rotateX: 0, 
                    scale: 1.05,
                    z: 40,
                    transition: { duration: 0.4, ease: easing }
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="bg-gradient-to-br from-[#1b3d37] to-[#0e1c19] border border-[#32776c]/30 hover:border-[#32776c]/60 rounded-3xl p-8 shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:shadow-[0_30px_70px_rgba(50,119,108,0.25)] transition-all duration-300 flex flex-col justify-between text-left h-[320px] relative group overflow-hidden"
                >
                  {/* Subtle 3D background glowing orb */}
                  <div className="absolute -right-12 -top-12 w-28 h-28 bg-[#32776c]/10 rounded-full blur-2xl group-hover:bg-[#32776c]/20 transition-all duration-500" />
                  
                  <div style={{ transform: 'translateZ(30px)' }}>
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-mono text-xs tracking-wider text-[#32776c] font-black uppercase">
                        {node.period}
                      </span>
                      <span className="font-mono text-[9px] text-slate-400 font-bold uppercase">
                        {node.company}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-extrabold text-white mb-4 leading-tight group-hover:text-[#32776c] transition-colors">
                      {node.role}
                    </h3>
                  </div>

                  <div style={{ transform: 'translateZ(20px)' }}>
                    <p className="font-body text-xs text-slate-300 leading-relaxed font-light">
                      {node.desc}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </section>
      </div>

      {/* SECTION 4: AWARDS & HONORS (LIGHT THEME - STICKY CARD 4) */}
      <div className="relative lg:sticky lg:top-0 min-h-screen lg:h-screen w-full bg-[#fcfbf9] text-[#0d0d0f] z-35 overflow-visible lg:overflow-hidden flex flex-col justify-center shadow-[0_-20px_50px_rgba(0,0,0,0.15)] border-b border-black/5 pt-10 pb-16 lg:py-0">
        <div className="absolute inset-y-0 left-8 md:left-16 w-[1px] bg-black/5 pointer-events-none -z-10" />
        <div className="absolute inset-y-0 right-8 md:right-16 w-[1px] bg-black/5 pointer-events-none -z-10" />

        <section className="px-0 max-w-container-max mx-auto w-full">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={fadeInUp}
            className="mb-12 text-left"
          >
            <span className="font-mono text-xs text-[#32776c] tracking-[0.25em] uppercase mb-4 block">HONORS</span>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold text-[#0d0d0f] uppercase tracking-tight">
              Awards &amp; Laurels
            </h2>
          </motion.div>

          <motion.div 
            variants={cardContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full pt-4 [perspective:1500px]"
          >
            {awards.map((award, idx) => {
              // Alternate 3D isometric tilt angles
              const initialRotateY = idx === 0 ? -12 : idx === 1 ? 0 : 12
              const initialRotateX = 6
              
              return (
                <motion.div
                  key={idx}
                  variants={getCardItemVariants(initialRotateY, initialRotateX)}
                  whileHover={{ 
                    rotateY: 0, 
                    rotateX: 0, 
                    scale: 1.05,
                    z: 40,
                    transition: { duration: 0.4, ease: easing }
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="bg-gradient-to-br from-[#1b3d37] to-[#0e1c19] border border-[#32776c]/30 hover:border-[#32776c]/60 rounded-3xl p-8 shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:shadow-[0_30px_70px_rgba(50,119,108,0.25)] transition-all duration-300 flex flex-col justify-between text-left h-[320px] relative group overflow-hidden"
                >
                  {/* Subtle 3D background glowing orb */}
                  <div className="absolute -right-12 -top-12 w-28 h-28 bg-[#32776c]/10 rounded-full blur-2xl group-hover:bg-[#32776c]/20 transition-all duration-500" />
                  
                  <div style={{ transform: 'translateZ(30px)' }}>
                    <div className="flex justify-between items-start mb-6">
                      <span className="font-mono text-[9px] font-black tracking-widest text-[#32776c] bg-[#32776c]/10 border border-[#32776c]/20 px-2.5 py-1 rounded">
                        {award.category}
                      </span>
                      <Award className="w-5 h-5 text-[#32776c]" />
                    </div>

                    <h3 className="font-display text-lg font-extrabold text-white mb-3">
                      {award.title}
                    </h3>
                  </div>

                  <div style={{ transform: 'translateZ(20px)' }}>
                    <p className="font-body text-xs text-slate-300 leading-relaxed font-light mb-6">
                      {award.desc}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </section>
      </div>

      {/* SECTION 4a: YOUTUBE VIDEOS (DARK THEME - STICKY CARD between Awards and Blogs) */}
      {youtubeLink && youtubeLink.split(',').some(link => link.trim().includes('/embed/')) && (
        <div className="relative lg:sticky lg:top-0 min-h-screen lg:h-screen w-full bg-[#0d0d0f] text-white z-[37] overflow-visible lg:overflow-hidden flex flex-col justify-center shadow-[0_-20px_50px_rgba(0,0,0,0.3)] border-b border-white/5 pt-10 pb-16 lg:py-0">
          <div className="absolute inset-y-0 left-8 md:left-16 w-[1px] bg-white/5 pointer-events-none -z-10" />
          <div className="absolute inset-y-0 right-8 md:right-16 w-[1px] bg-white/5 pointer-events-none -z-10" />

          <section className="px-0 max-w-container-max mx-auto w-full">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={fadeInUp}
              className="mb-12 text-left"
            >
              <span className="font-mono text-xs text-[#32776c] tracking-[0.25em] uppercase mb-4 block">BROADCASTS</span>
              <h2 className="font-display text-4xl md:text-6xl font-extrabold text-white uppercase tracking-tight">
                Featured Showreels
              </h2>
            </motion.div>

            {/* Horizontal Scroll wrapper */}
            <div className="relative w-full overflow-hidden">
              <div 
                className="flex flex-row overflow-x-auto gap-8 pb-10 pt-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[#32776c]/40 scrollbar-track-transparent -mx-4 px-4 md:mx-0 md:px-0"
                style={{ scrollbarWidth: 'thin', msOverflowStyle: 'none' }}
              >
                {youtubeLink.split(',').map((link, idx) => {
                  const embedUrl = link.trim();
                  if (!embedUrl || !embedUrl.includes('/embed/')) return null;

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: idx * 0.15 }}
                      className="snap-center shrink-0 w-[80vw] sm:w-[420px] md:w-[540px] bg-gradient-to-br from-[#1b3d37] to-[#0e1c19] border border-[#32776c]/30 hover:border-[#32776c]/60 rounded-3xl p-4 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:shadow-[0_30px_70px_rgba(50,119,108,0.3)] transition-all duration-300 relative group overflow-hidden"
                    >
                      <div className="absolute -right-12 -top-12 w-28 h-28 bg-[#32776c]/10 rounded-full blur-2xl group-hover:bg-[#32776c]/20 transition-all duration-500" />
                      
                      <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-inner" style={{ paddingTop: '56.25%' }}>
                        <iframe
                          src={embedUrl}
                          className="absolute inset-0 w-full h-full border-none"
                          title={`YouTube Showreel ${idx + 1}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      <div className="mt-4 flex justify-between items-center font-mono text-[9px] text-[#32776c] font-black uppercase tracking-wider">
                        <span>BIG TV BROADCAST SYSTEM</span>
                        <span>SHOWREEL 0{idx + 1}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* SECTION 4b: BLOGS (LIGHT THEME - STICKY CARD between Awards and Academics) */}
      {blogs.length > 0 && (
        <div className="relative lg:sticky lg:top-0 min-h-screen lg:h-screen w-full bg-[#fcfbf9] text-[#0d0d0f] z-[38] overflow-visible lg:overflow-hidden flex flex-col justify-center shadow-[0_-20px_50px_rgba(0,0,0,0.15)] border-b border-black/5 pt-10 pb-16 lg:py-0">
          <div className="absolute inset-y-0 left-8 md:left-16 w-[1px] bg-black/5 pointer-events-none -z-10" />
          <div className="absolute inset-y-0 right-8 md:right-16 w-[1px] bg-black/5 pointer-events-none -z-10" />

          <section className="px-0 max-w-container-max mx-auto w-full">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={fadeInUp}
              className="mb-12 text-left"
            >
              <span className="font-mono text-xs text-[#32776c] tracking-[0.25em] uppercase mb-4 block">EDITORIAL</span>
              <h2 className="font-display text-4xl md:text-6xl font-extrabold text-[#0d0d0f] uppercase tracking-tight">
                Latest Writings
              </h2>
            </motion.div>

            <motion.div
              variants={cardContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full [perspective:1500px]"
            >
              {blogs.map((blog, idx) => {
                const initialRotateY = idx % 2 === 0 ? -8 : 8
                const initialRotateX = 4
                return (
                  <motion.div
                    key={idx}
                    variants={getCardItemVariants(initialRotateY, initialRotateX)}
                    whileHover={{
                      rotateY: 0,
                      rotateX: 0,
                      scale: 1.04,
                      z: 40,
                      transition: { duration: 0.4, ease: easing }
                    }}
                    onClick={() => setSelectedBlog(blog)}
                    style={{ transformStyle: 'preserve-3d', cursor: 'pointer' }}
                    className="bg-gradient-to-br from-[#1b3d37] to-[#0e1c19] border border-[#32776c]/30 hover:border-[#32776c]/60 rounded-3xl p-8 shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:shadow-[0_30px_70px_rgba(50,119,108,0.25)] transition-all duration-300 flex flex-col justify-between text-left min-h-[300px] relative group overflow-hidden"
                  >
                    <div className="absolute -right-12 -top-12 w-28 h-28 bg-[#32776c]/10 rounded-full blur-2xl group-hover:bg-[#32776c]/20 transition-all duration-500" />

                    {/* Cover image at top */}
                    {blog.image && (
                      <div style={{ transform: 'translateZ(10px)' }} className="mb-5 -mx-2 rounded-xl overflow-hidden">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-32 object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        />
                      </div>
                    )}

                    <div style={{ transform: 'translateZ(30px)' }} className="flex-grow">
                      {blog.date && (
                        <span className="font-mono text-[9px] text-[#32776c] font-bold block mb-3 uppercase tracking-widest">
                          {blog.date}
                        </span>
                      )}
                      <h3 className="font-display text-lg font-extrabold text-white mb-3 group-hover:text-[#32776c] transition-colors leading-snug">
                        {blog.title}
                      </h3>
                      <p className="font-body text-xs text-slate-300 leading-relaxed font-light line-clamp-3">
                        {blog.excerpt || blog.content?.slice(0, 120) + (blog.content?.length > 120 ? '…' : '')}
                      </p>
                    </div>

                    {/* Read CTA */}
                    <div style={{ transform: 'translateZ(20px)' }} className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Editorial</span>
                      <button
                        className="flex items-center gap-1.5 font-mono text-[9px] font-bold text-[#32776c] hover:text-white border border-[#32776c]/30 hover:border-white/30 px-3 py-1.5 rounded-lg transition-all uppercase tracking-wider bg-[#32776c]/5 hover:bg-white/5 cursor-pointer"
                      >
                        <BookOpen className="w-3 h-3" /> Read Article
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </section>
        </div>
      )}

      {/* SECTION 5b: EVENTS (DARK THEME - STICKY CARD between Blogs and Academics) */}
      {events.length > 0 && (
        <div className="relative lg:sticky lg:top-0 min-h-screen lg:h-screen w-full bg-[#0d0d0f] text-white z-[39] overflow-visible lg:overflow-hidden flex flex-col justify-center shadow-[0_-20px_50px_rgba(0,0,0,0.2)] border-b border-white/5 pt-10 pb-16 lg:py-0">
          <div className="absolute inset-y-0 left-8 md:left-16 w-[1px] bg-white/5 pointer-events-none -z-10" />
          <div className="absolute inset-y-0 right-8 md:right-16 w-[1px] bg-white/5 pointer-events-none -z-10" />

          <section className="px-0 max-w-container-max mx-auto w-full">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={fadeInUp}
              className="mb-12 text-left"
            >
              <span className="font-mono text-xs text-[#32776c] tracking-[0.25em] uppercase mb-4 block">SCHEDULE</span>
              <h2 className="font-display text-4xl md:text-6xl font-extrabold text-white uppercase tracking-tight">
                Upcoming Events
              </h2>
            </motion.div>

            <motion.div
              variants={cardContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full [perspective:1500px]"
            >
              {events.map((event, idx) => {
                const initialRotateY = idx % 3 === 0 ? -8 : idx % 3 === 2 ? 8 : 0
                const initialRotateX = 4
                return (
                  <motion.div
                    key={idx}
                    variants={getCardItemVariants(initialRotateY, initialRotateX)}
                    whileHover={{
                      rotateY: 0,
                      rotateX: 0,
                      scale: 1.03,
                      z: 30,
                      transition: { duration: 0.4, ease: easing }
                    }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="bg-gradient-to-br from-[#1b3d37] to-[#0e1c19] border border-[#32776c]/30 hover:border-[#32776c]/60 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_50px_rgba(50,119,108,0.2)] transition-all duration-300 relative group overflow-hidden flex flex-row items-stretch"
                  >
                    <div className="absolute -right-8 -top-8 w-20 h-20 bg-[#32776c]/10 rounded-full blur-xl group-hover:bg-[#32776c]/20 transition-all duration-500" />

                    {/* Left date strip */}
                    <div
                      style={{ transform: 'translateZ(20px)' }}
                      className="flex-shrink-0 w-[72px] bg-[#32776c]/10 border-r border-[#32776c]/20 flex flex-col items-center justify-center gap-1 p-3"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#32776c] mb-1" />
                      {event.date && (() => {
                        const d = new Date(event.date)
                        return (
                          <>
                            <span className="font-mono text-[11px] font-black text-[#32776c] leading-none">
                              {d.getDate().toString().padStart(2, '0')}
                            </span>
                            <span className="font-mono text-[8px] text-slate-400 uppercase tracking-wider leading-none">
                              {d.toLocaleString('en-IN', { month: 'short' })}
                            </span>
                            <span className="font-mono text-[8px] text-slate-500 leading-none">
                              {d.getFullYear()}
                            </span>
                          </>
                        )
                      })()}
                    </div>

                    {/* Right content */}
                    <div
                      style={{ transform: 'translateZ(25px)' }}
                      className="flex flex-col justify-center gap-1.5 p-4 flex-grow min-h-[130px]"
                    >
                      <h3 className="font-display text-sm font-extrabold text-white group-hover:text-[#32776c] transition-colors leading-snug line-clamp-2">
                        {event.title}
                      </h3>
                      {event.location && (
                        <span className="font-mono text-[8px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-[#32776c] flex-shrink-0" />
                          <span className="line-clamp-1">{event.location}</span>
                        </span>
                      )}
                      {event.desc && (
                        <p className="font-body text-[10px] text-slate-400 leading-relaxed font-light line-clamp-2 mt-0.5">
                          {event.desc}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </section>
        </div>
      )}

      {/* SECTION 5: ACADEMICS & SOCIALS + FOOTER (DARK THEME - STICKY CARD 5) */}
      <div className="relative lg:sticky lg:top-0 min-h-screen lg:h-screen w-full bg-[#0d0d0f] text-white z-40 overflow-visible lg:overflow-hidden flex flex-col justify-between shadow-[0_-20px_50px_rgba(0,0,0,0.3)] pt-12 pb-12">
        <div className="absolute inset-y-0 left-8 md:left-16 w-[1px] bg-white/5 pointer-events-none -z-10" />
        <div className="absolute inset-y-0 right-8 md:right-16 w-[1px] bg-white/5 pointer-events-none -z-10" />

        <section className="px-0 max-w-container-max mx-auto w-full my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Academics Left */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={fadeInUp}
              className="text-left space-y-12"
            >
              <div>
                <p className="font-mono text-xs text-[#32776c] tracking-[0.25em] uppercase mb-4 block">EDUCATION</p>
                <h2 className="font-display text-4xl font-extrabold text-white uppercase tracking-tight">Academic Credentials</h2>
              </div>

              <div className="space-y-6">
                {academics.map((acad, idx) => (
                  <div key={idx} className="flex gap-4 border-l border-[#32776c]/40 pl-6 py-2">
                    <div className="text-left">
                      <h4 className="font-display text-lg font-bold text-white leading-tight">{acad.degree}</h4>
                      <p className="font-body text-xs text-slate-400 mt-2 font-light">{acad.institute}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Socials & Connect Right */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={fadeInUp}
              className="text-left space-y-12 flex flex-col justify-between"
            >
              <div>
                <p className="font-mono text-xs text-[#32776c] tracking-[0.25em] uppercase mb-4 block">NETWORK CONNECT</p>
                <h2 className="font-display text-4xl font-extrabold text-white uppercase tracking-tight">Verified Gateways</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a 
                  href="https://x.com/aparnakurup?s=11&t=pmxdUhf4CvjZXn2SC9tqXw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#111216]/50 border border-white/5 rounded-xl p-6 flex items-center justify-between hover:border-[#32776c]/30 hover:bg-[#111216]/70 transition-all font-mono text-xs tracking-wider"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#32776c] fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    TWITTER
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>

                <a 
                  href="https://www.instagram.com/aparnakurup/?utm_source=ig_web_button_share_sheet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#111216]/50 border border-white/5 rounded-xl p-6 flex items-center justify-between hover:border-[#32776c]/30 hover:bg-[#111216]/70 transition-all font-mono text-xs tracking-wider"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#32776c]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                    INSTAGRAM
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>

                <a 
                  href="https://www.linkedin.com/in/aparnakurup?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#111216]/50 border border-white/5 rounded-xl p-6 flex items-center justify-between hover:border-[#32776c]/30 hover:bg-[#111216]/70 transition-all font-mono text-xs tracking-wider"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#32776c] fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    LINKEDIN
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>

                <a 
                  href="https://www.facebook.com/aparnaramakrishnakurup?mibextid=wwXIfr&rdid=0S9ku0RvbZEAI1JE&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18vE1u2kXg%2F%3Fmibextid%3DwwXIfr#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#111216]/50 border border-white/5 rounded-xl p-6 flex items-center justify-between hover:border-[#32776c]/30 hover:bg-[#111216]/70 transition-all font-mono text-xs tracking-wider"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#32776c] fill-current" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                    </svg>
                    FACEBOOK
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </div>
            </motion.div>

          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-12 bg-[#070709] w-full text-center text-xs font-mono text-slate-500 px-0 mt-auto">
          <div className="max-w-container-max mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <span>&copy; 2026 BIG TV NEWSNET. ALL RIGHTS RESERVED.</span>
            <span>SYSTEM ACC SYNC: ACTIVE</span>
          </div>
        </footer>
      </div>

    </div>
  )
}
