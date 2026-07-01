import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { 
  ArrowLeft, 
  ExternalLink,
  Play,
  Pause,
  Award,
  Calendar,
  MapPin,
  Mail,
  User,
  Heart,
  Volume2,
  FileText,
  Clock,
  Compass,
  ChevronRight,
  Tv,
  BookOpen,
  Briefcase
} from 'lucide-react'
import Lenis from 'lenis'
import aryaImg from '../assets/AryaSurendran.png'

// Interactive Golden Particle Backdrop
const InteractiveParticles = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let particles = []
    let mouse = { x: null, y: null, radius: 180 }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', resize)
    resize()

    const handleMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const handleMouseLeave = () => {
      mouse.x = null
      mouse.y = null
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - 0.5) * 0.35
        this.vy = (Math.random() - 0.5) * 0.35
        this.radius = Math.random() * 2 + 1
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 211, 42, 0.4)'
        ctx.fill()
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x
          const dy = mouse.y - this.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius
            this.x -= dx * force * 0.02
            this.y -= dy * force * 0.02
          }
        }
      }
    }

    const init = () => {
      particles = []
      const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 18000))
      for (let i = 0; i < count; i++) {
        particles.push(new Particle())
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(255, 211, 42, ${0.1 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    init()
    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none -z-10 opacity-70" />
}

// Numerical Counter Component
const RatingCounter = ({ target }) => {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let start = 0
    const end = parseFloat(target)
    if (start === end) return

    const duration = 1500
    const incrementTime = 30
    const step = (end / (duration / incrementTime))

    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        clearInterval(timer)
        setCount(end.toFixed(1))
      } else {
        setCount(start.toFixed(1))
      }
    }, incrementTime)

    return () => clearInterval(timer)
  }, [target])

  return <span>{count}</span>
}

export default function AryaSurendran() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [onAirTime, setOnAirTime] = useState('00:00')
  
  // Orbit auto-rotation active index state
  const [activeIndex, setActiveIndex] = useState(0)
  
  const [blogs, setBlogs] = useState([])
  const [events, setEvents] = useState([])
  const [youtubeLink, setYoutubeLink] = useState('')
  const [selectedBlog, setSelectedBlog] = useState(null)

  // Scroll tracking for indicator
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Fetch portfolio data from MongoDB
  useEffect(() => {
    const fetchAryaPortfolio = async () => {
      try {
        const res = await fetch('/api/users')
        if (res.ok) {
          const users = await res.json()
          const arya = users.find(u => u.email?.toLowerCase() === 'arya@bigtv.com')
          if (arya?.portfolio) {
            setBlogs(arya.portfolio.blogs || [])
            setEvents(arya.portfolio.events || [])
            setYoutubeLink(arya.portfolio.youtubeLink || '')
          }
        }
      } catch (err) {
        console.error('Failed to fetch Arya portfolio:', err)
      }
    }
    fetchAryaPortfolio()
  }, [])

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])

  // Live broadcast ticking timer
  useEffect(() => {
    let interval
    if (isPlaying) {
      interval = setInterval(() => {
        setOnAirTime(() => {
          const sec = Math.floor(Math.random() * 60)
          const min = Math.floor(Math.random() * 10)
          return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
        })
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  const bubbleTags = [
    { label: "Kaumudi", x: -110, y: -70, desc: "Formative journalism reporting at Kerala Kaumudi starting in 2016." },
    { label: "24 News", x: 110, y: -60, desc: "Flagship news anchoring and segment coordination." },
    { label: "Reporter TV", x: -100, y: 90, desc: "Moderator of prime-time debate panels and public bulletins." },
    { label: "Anchoring", x: 100, y: 80, desc: "Prime-time live presentation and panel steering." },
    { label: "Desk Operations", x: 0, y: -130, desc: "Supervising newsroom desk outputs and copy streams." },
    { label: "10 Years Exp", x: 0, y: 130, desc: "A decade of media industry expertise since 2016." }
  ]

  // Experience Orbit Auto-rotation timer
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % bubbleTags.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [bubbleTags.length])

  const metrics = [
    { name: "News Anchoring", score: 9.8, label: "Live panel moderation & timing" },
    { name: "Desk Management", score: 9.5, label: "Command of complex outputs" },
    { name: "Field Reporting", score: 9.0, label: "Live breaking coverage" },
    { name: "Socio-political Analysis", score: 9.2, label: "In-depth regional knowledge" }
  ]

  const timelineItems = [
    { period: "2024 — PRESENT", title: "Associate News Editor & Anchor", station: "BIG TV News Malayalam", desc: "Supervising output operations, coordinating editorial tables, and anchoring flagship bulletins." },
    { period: "2021 — 2024", title: "Senior Anchor & Correspondent", station: "24 News / Reporter TV", desc: "Anchoring high-stakes political debates and leading on-ground regional reporting teams." },
    { period: "2016 — 2021", title: "Broadcast Reporter", station: "Kerala Kaumudi", desc: "Laid the groundwork of field reporting, bulletin compilation, and segment presentations." }
  ]

  // Transition Animation Variants for Sections
  const sectionVariants = {
    hidden: { 
      opacity: 0, 
      y: 80, 
      rotateX: 8, 
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0, 
      scale: 1,
      transition: { 
        duration: 1.0, 
        ease: [0.16, 1, 0.3, 1] 
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5eb] font-body selection:bg-[#ffd32a] selection:text-[#050505] relative overflow-x-hidden flex flex-col justify-between [perspective:1200px]">
      
      {/* Background Particles */}
      <InteractiveParticles />

      {/* Vertical Scroll Progress Bar (Award Winning Transition Cue) */}
      <div className="fixed right-6 top-1/4 w-[2px] h-1/2 bg-white/10 rounded-full origin-top z-50 overflow-hidden hidden md:block">
        <motion.div 
          className="w-full h-full bg-[#ffd32a] shadow-[0_0_10px_#ffd32a]"
          style={{ scaleY }}
        />
      </div>

      {/* Header */}
      <header className="w-full z-50 bg-[#050505]/85 backdrop-blur-md border-b border-white/5 py-6 sticky top-0">
        <nav className="flex justify-between items-center max-w-7xl mx-auto px-8 w-full">
          <div className="flex items-center gap-2">
            <a href="#/" className="flex items-center gap-2 font-display text-sm font-black uppercase tracking-wider hover:text-[#ffd32a] transition-colors">
              <span className="w-6 h-6 bg-[#ffd32a] rounded-full flex items-center justify-center text-[#050505] text-[11px] font-bold">B</span>
              <span>BIG TV NEWSNET</span>
            </a>
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="#/" 
              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold text-slate-400 hover:text-[#ffd32a] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> HUB
            </a>
          </div>
        </nav>
      </header>

      {/* ── CINEMATIC SPONTANEOUS PORTFOLIO LAYOUT ── */}
      <main className="flex-grow w-full">

        {/* HERO BLOCK: LARGE CINEMATIC SHOWCASE */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={sectionVariants}
          className="min-h-[92vh] flex flex-col justify-center py-20 border-b border-white/5 relative overflow-hidden"
        >
          <div className="absolute top-[20%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-[#ffd32a]/5 filter blur-[150px] pointer-events-none -z-10" />
          
          <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Title / Description */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="inline-flex items-center gap-2.5 bg-[#ffd32a]/10 border border-[#ffd32a]/20 px-4 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#ffd32a] animate-ping" />
                <span className="font-mono text-[9px] tracking-widest text-[#ffd32a] font-bold uppercase">ACC JOURNALIST REGISTRY</span>
              </div>
              
              <div className="space-y-4">
                <h1 className="font-display text-5xl md:text-8xl font-black tracking-tight leading-[0.95] text-white uppercase">
                  Arya <br /> Surendran
                </h1>
                <p className="font-mono text-xs md:text-sm text-[#ffd32a] uppercase tracking-[0.3em] font-bold">
                  Associate News Editor &amp; Anchor • Malayalam Bureau
                </p>
              </div>
              
              <p className="text-base md:text-lg text-slate-400 leading-relaxed font-light max-w-2xl">
                I am a Journalist with 10 years of experience in the media industry, actively working since 2016. Previously associated with Kerala Kaumudi, 24 News, and Reporter TV, with expertise in news reporting and broadcast journalism.
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="inline-flex items-center gap-2 bg-[#ffd32a] hover:bg-yellow-400 text-[#050505] px-8 py-4 rounded-full font-mono text-[10px] uppercase font-bold tracking-widest transition-all duration-300 shadow-lg shadow-[#ffd32a]/10 cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current translate-x-[0.5px]" />}
                  {isPlaying ? `ON AIR: ${onAirTime}` : 'ACTIVATE BROADCAST STREAM'}
                </button>
                <a
                  href="#showreel"
                  className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-[#ffd32a] hover:text-[#050505] border border-white/10 px-8 py-4 rounded-full font-mono text-[10px] uppercase font-bold tracking-widest transition-all duration-300"
                >
                  Watch Showreels
                </a>
              </div>
            </div>

            {/* Giant Portrait Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[380px] rounded-[56px] bg-[#121216] border border-white/5 p-6 shadow-[0_40px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl group overflow-hidden">
                <div className="absolute -right-20 -top-20 w-44 h-44 bg-[#ffd32a]/5 rounded-full blur-3xl group-hover:bg-[#ffd32a]/10 transition-all duration-500" />
                
                <div className="aspect-[4/5] w-full rounded-[40px] overflow-hidden bg-[#0c0c0f] border border-white/5 shadow-inner">
                  <img 
                    src={aryaImg} 
                    alt="Arya Surendran Portrait" 
                    className="w-full h-full object-cover object-top scale-100 group-hover:scale-103 transition-transform duration-700"
                  />
                </div>

                <div className="mt-6 flex justify-between items-center px-2">
                  <div className="text-left">
                    <h3 className="font-display text-sm font-black text-white uppercase tracking-wider">ARYA SURENDRAN</h3>
                    <p className="font-mono text-[8px] text-slate-500 uppercase tracking-widest mt-0.5">Malayalam Anchor Core</p>
                  </div>
                  
                  {/* Active equalizer wave */}
                  <div className="flex items-end gap-0.5 h-6">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={isPlaying ? {
                          height: [4, 20, 6, 16, 8, 20, 4][Math.floor(Math.random() * 7)]
                        } : { height: 4 }}
                        transition={isPlaying ? {
                          duration: 0.5 + i * 0.1,
                          repeat: Infinity,
                          ease: "easeInOut"
                        } : {}}
                        className="w-[3px] bg-[#ffd32a] rounded-t"
                        style={{ height: '4px' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </motion.section>

        {/* SECTION 2: EXPERIENCE ORB MAP (WIDE SHOWCASE SECTION) */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={sectionVariants}
          className="py-32 border-b border-white/5 relative"
        >
          <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-5 text-left space-y-6">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#ffd32a]" />
                <span className="font-mono text-[9px] text-[#ffd32a] font-bold uppercase tracking-widest">NETWORK MIGRATION</span>
              </div>
              <h2 className="font-display text-3xl md:text-5xl font-black text-white uppercase leading-none">
                Experience Map
              </h2>
              <p className="text-sm md:text-base text-slate-400 leading-relaxed font-light">
                Coordination streams verified across prominent Malayalam media houses including Kerala Kaumudi, 24 News, and Reporter TV. Hover over the orbiting nodes or watch them auto-cycle.
              </p>
              
              {/* Description Drawer Box - Automatically shows active bubble tag details */}
              <div className="bg-[#121216]/60 border border-white/5 rounded-3xl p-6 min-h-[120px] flex items-center justify-center text-center backdrop-blur-md">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-2"
                  >
                    <span className="font-display text-sm font-black text-[#ffd32a] uppercase block">
                      {bubbleTags[activeIndex].label}
                    </span>
                    <p className="font-body text-xs text-slate-300 leading-relaxed font-light">
                      {bubbleTags[activeIndex].desc}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Orbiting Ring Chart */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="relative w-full max-w-[480px] h-[400px] bg-[#0c0c0f] border border-white/5 rounded-[48px] shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl flex items-center justify-center overflow-hidden">
                <div className="absolute w-[240px] h-[240px] border border-dashed border-[#ffd32a]/15 rounded-full animate-[spin_60s_linear_infinite]" />
                
                {/* Central Node */}
                <div className="relative w-28 h-28 bg-[#121216] rounded-full shadow-md flex flex-col items-center justify-center text-center p-4 border border-[#ffd32a]/10 z-20">
                  <span className="font-display text-xs font-black text-[#ffd32a] uppercase leading-none">Journalism</span>
                  <span className="font-mono text-[8px] text-slate-500 mt-1.5 uppercase">Since 2016</span>
                </div>

                {/* Satellite Nodes - Automatically updates activeIndex and changes color of active circle */}
                {bubbleTags.map((tag, idx) => {
                  const isActive = idx === activeIndex
                  return (
                    <motion.button
                      key={idx}
                      onMouseEnter={() => setActiveIndex(idx)}
                      whileHover={{ scale: 1.15 }}
                      className={`absolute w-20 h-20 rounded-full shadow-md flex items-center justify-center text-center p-2 cursor-pointer focus:outline-none transition-all duration-300 z-10 ${
                        isActive 
                          ? 'bg-[#ffd32a] border-2 border-white text-[#050505] shadow-[0_0_20px_rgba(255,211,42,0.4)] scale-110' 
                          : 'bg-[#1e1e24] border border-white/5 text-white hover:border-[#ffd32a]/40'
                      }`}
                      style={{
                        left: `calc(50% - 40px + ${tag.x}px)`,
                        top: `calc(50% - 40px + ${tag.y}px)`
                      }}
                    >
                      <span className={`font-display text-[9px] font-extrabold leading-snug transition-colors ${
                        isActive ? 'text-[#050505]' : 'text-white'
                      }`}>
                        {tag.label}
                      </span>
                    </motion.button>
                  )
                })}

              </div>
            </div>

          </div>
        </motion.section>

        {/* SECTION 3: SKILLS AND VETTED RATINGS (SPACIOUS WIDE CARDS) */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={sectionVariants}
          className="py-32 border-b border-white/5 relative"
        >
          <div className="max-w-7xl mx-auto px-8 w-full space-y-16">
            
            <div className="text-left max-w-3xl space-y-4">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#ffd32a]" />
                <span className="font-mono text-[9px] text-[#ffd32a] font-bold uppercase tracking-widest">PERFORMANCE COEFFICIENCY</span>
              </div>
              <h2 className="font-display text-3xl md:text-5xl font-black text-white uppercase">Mindset Scores</h2>
              <p className="text-sm md:text-base text-slate-400 leading-relaxed font-light">
                Professional competencies audited across standard newsroom operation desks and broadcast moderation panels.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="bg-[#121216] border border-white/5 rounded-[40px] p-8 shadow-sm flex flex-col justify-between min-h-[200px] hover:border-[#ffd32a]/30 transition-all duration-300 group"
                >
                  <div className="flex justify-between items-baseline mb-4">
                    <h3 className="font-display text-lg md:text-xl font-extrabold text-white leading-none group-hover:text-[#ffd32a] transition-colors">
                      {metric.name}
                    </h3>
                    <span className="font-display text-2xl font-black text-[#ffd32a]">
                      <RatingCounter target={metric.score} />
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="h-2 w-full bg-[#0c0c0f] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${metric.score * 10}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5 }}
                        className="h-full bg-[#ffd32a] rounded-full" 
                      />
                    </div>
                    <div className="flex justify-between font-mono text-[9px] text-slate-500">
                      <span>{metric.label}</span>
                      <span>VERIFIED SYNERGY</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </motion.section>

        {/* SECTION 4: TIMELINE / JOURNALISTIC PIPELINE */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={sectionVariants}
          className="py-32 border-b border-white/5 relative"
        >
          <div className="max-w-4xl mx-auto px-8 w-full space-y-16">
            
            <div className="text-center space-y-4">
              <span className="font-mono text-xs text-[#ffd32a] tracking-[0.25em] uppercase block font-bold">CHRONOLOGY</span>
              <h2 className="font-display text-3xl md:text-5xl font-black text-white uppercase">Career Milestones</h2>
            </div>

            <div className="space-y-12 relative before:absolute before:inset-y-0 before:left-4 sm:before:left-1/2 before:w-[1px] before:bg-white/10">
              {timelineItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col sm:flex-row items-stretch gap-8 relative ${
                    idx % 2 === 0 ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  <div className="absolute left-4 sm:left-1/2 -translate-x-[4.5px] w-2.5 h-2.5 rounded-full bg-[#ffd32a] border border-[#050505] z-20 top-3 shadow-[0_0_8px_#ffd32a]" />
                  <div className="w-full sm:w-1/2" />
                  <div className="w-full sm:w-1/2 pl-10 sm:pl-0">
                    <motion.div 
                      whileHover={{ y: -4 }}
                      className={`bg-[#121216] border border-white/5 rounded-[36px] p-8 shadow-sm hover:border-[#ffd32a]/30 transition-all duration-300 text-left relative ${
                        idx % 2 === 0 ? 'sm:mr-10' : 'sm:ml-10'
                      }`}
                    >
                      <span className="font-mono text-[9px] text-[#ffd32a] font-bold uppercase tracking-wider block mb-2">{item.period}</span>
                      <h3 className="font-display text-base md:text-lg font-extrabold text-white leading-snug">{item.title}</h3>
                      <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mt-1 mb-4">{item.station}</p>
                      <p className="font-body text-xs text-slate-300 leading-relaxed font-light">{item.desc}</p>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </motion.section>

        {/* SECTION 5: YOUTUBE SHOWREELS (HORIZONTAL PARALLAX ROW) */}
        {youtubeLink && youtubeLink.split(',').some(link => link.trim().includes('/embed/')) && (
          <motion.section 
            id="showreel" 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            variants={sectionVariants}
            className="py-32 border-b border-white/5 relative"
          >
            <div className="max-w-7xl mx-auto px-8 w-full space-y-16">
              
              <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 text-left">
                <div>
                  <span className="font-mono text-xs text-[#ffd32a] tracking-[0.25em] uppercase mb-3 block font-bold">BROADCAST COPIES</span>
                  <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white uppercase">Featured Showreels</h2>
                </div>
                <div className="flex-grow h-[1px] bg-white/10 mx-12 hidden md:block" />
              </div>

              <div className="relative w-full overflow-hidden">
                <div 
                  className="flex flex-row overflow-x-auto gap-8 pb-10 pt-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[#ffd32a]/40 scrollbar-track-transparent -mx-4 px-4 md:mx-0 md:px-0"
                  style={{ scrollbarWidth: 'thin', msOverflowStyle: 'none' }}
                >
                  {youtubeLink.split(',').map((link, idx) => {
                    const embedUrl = link.trim();
                    if (!embedUrl || !embedUrl.includes('/embed/')) return null;

                    return (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -6 }}
                        className="snap-center shrink-0 w-[80vw] sm:w-[460px] md:w-[600px] bg-[#121216] border border-white/5 rounded-[40px] p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative group overflow-hidden flex flex-col justify-between text-left"
                      >
                        <div className="relative w-full rounded-3xl overflow-hidden bg-black shadow-inner" style={{ paddingTop: '56.25%' }}>
                          <iframe
                            src={embedUrl}
                            className="absolute inset-0 w-full h-full border-none"
                            title={`YouTube Showreel ${idx + 1}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        <div className="mt-5 flex justify-between items-center font-mono text-[9px] text-[#ffd32a] font-bold uppercase tracking-wider px-1">
                          <span>BIG TV Malayalam News</span>
                          <span>SHOWREEL 0{idx + 1}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

            </div>
          </motion.section>
        )}

        {/* SECTION 6: BLOGS & EDITORIAL WRITINGS */}
        {blogs.length > 0 && (
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            variants={sectionVariants}
            className="py-32 border-b border-white/5 relative" 
            id="blogs"
          >
            <div className="max-w-7xl mx-auto px-8 w-full space-y-16">
              
              <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 text-left">
                <div>
                  <span className="font-mono text-xs text-[#ffd32a] tracking-[0.25em] uppercase mb-3 block font-bold">COLUMNS</span>
                  <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white uppercase">Latest Editorials</h2>
                </div>
                <div className="flex-grow h-[1px] bg-white/10 mx-12 hidden md:block" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog, idx) => (
                  <motion.article
                    key={blog._id || idx}
                    whileHover={{ y: -6 }}
                    className="bg-[#121216] border border-white/5 rounded-[40px] overflow-hidden shadow-sm hover:border-[#ffd32a]/30 transition-all duration-300 flex flex-col justify-between text-left group"
                  >
                    {blog.image && (
                      <div className="w-full aspect-[2/1] overflow-hidden bg-slate-900 border-b border-white/5">
                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-103" />
                      </div>
                    )}
                    <div className="p-8 flex-grow flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 font-mono text-[9px] text-slate-500">
                          <span>{blog.date}</span>
                          <span>•</span>
                          <span className="text-[#ffd32a] font-bold">EDITORIAL</span>
                        </div>
                        <h3 className="font-display text-lg font-extrabold text-white leading-snug group-hover:text-[#ffd32a] transition-colors">
                          {blog.title}
                        </h3>
                        <p className="font-body text-xs text-slate-400 leading-relaxed font-light line-clamp-3">
                          {blog.excerpt}
                        </p>
                      </div>
                      <button 
                        onClick={() => setSelectedBlog(blog)}
                        className="font-mono text-[10px] text-[#ffd32a] hover:text-yellow-400 transition-colors font-bold flex items-center gap-1.5 cursor-pointer bg-transparent border-none outline-none mt-6 uppercase self-start"
                      >
                        READ COLUMN <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.article>
                ))}
              </div>

            </div>
          </motion.section>
        )}

        {/* SECTION 7: EVENTS SCHEDULE */}
        {events.length > 0 && (
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            variants={sectionVariants}
            className="py-32 border-b border-white/5 relative"
          >
            <div className="max-w-7xl mx-auto px-8 w-full space-y-16">
              
              <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 text-left">
                <div>
                  <span className="font-mono text-xs text-[#ffd32a] tracking-[0.25em] uppercase mb-3 block font-bold">SCHEDULE</span>
                  <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white uppercase">Upcoming Events</h2>
                </div>
                <div className="flex-grow h-[1px] bg-white/10 mx-12 hidden md:block" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -4 }}
                    className="bg-[#121216] border border-white/5 rounded-[36px] p-8 shadow-sm flex flex-col justify-between text-left min-h-[200px] relative group overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#ffd32a]" />
                        <span className="font-mono text-[9px] text-[#ffd32a] font-bold uppercase tracking-wider">{event.date}</span>
                      </div>
                      
                      <h3 className="font-display text-base md:text-lg font-extrabold text-white leading-snug group-hover:text-[#ffd32a] transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                      
                      {event.location && (
                        <span className="font-mono text-[9px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#ffd32a]" /> {event.location}
                        </span>
                      )}
                    </div>

                    {event.desc && (
                      <p className="font-body text-[11px] text-slate-400 leading-relaxed font-light mt-6 border-t border-white/5 pt-4 line-clamp-2">
                        {event.desc}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>

            </div>
          </motion.section>
        )}

        {/* SECTION 8: CONNECT & SOCIAL GATEWAY */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={sectionVariants}
          className="py-32 text-center space-y-12"
        >
          <div className="max-w-4xl mx-auto px-8 space-y-6">
            <span className="font-mono text-xs text-[#ffd32a] tracking-[0.25em] uppercase block font-bold">VERIFIED CONTACT</span>
            <h2 className="font-display text-4xl md:text-7xl font-black text-white uppercase">Social Gateway</h2>
            <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto font-light">
              Connect with Arya Surendran's official pages and newsroom contact channels for media synergy.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <a 
              href="https://www.facebook.com/share/1ASPMe7d3X/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-5 bg-[#121216] hover:bg-[#ffd32a] text-white hover:text-[#050505] border border-white/5 transition-all font-mono text-[10px] uppercase font-bold tracking-widest rounded-2xl shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
              Facebook Profile
            </a>
            <a 
              href="https://www.instagram.com/arya_mani_surendran?igsh=MXZnMGoxYnJjcjNzZw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-5 bg-[#ffd32a] text-[#050505] hover:bg-yellow-400 transition-all font-mono text-[10px] uppercase font-bold tracking-widest rounded-2xl shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              Instagram Channel
            </a>
          </div>
        </motion.section>

      </main>

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
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#121216] rounded-[40px] max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-white/5 shadow-2xl relative text-left"
              onClick={e => e.stopPropagation()}
              data-lenis-prevent
            >
              {selectedBlog.image && (
                <div className="w-full aspect-[21/9] overflow-hidden bg-slate-900 border-b border-white/5">
                  <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover opacity-90" />
                </div>
              )}
              <div className="p-8 md:p-12 relative">
                <button 
                  onClick={() => setSelectedBlog(null)}
                  className="absolute top-6 right-6 font-mono text-xs tracking-wider text-slate-400 hover:text-[#ffd32a] focus:outline-none cursor-pointer bg-transparent border-none"
                >
                  [ CLOSE ]
                </button>
                <div className="flex items-center gap-3 font-mono text-[9px] text-slate-400 mb-6">
                  <span>{selectedBlog.date}</span>
                  <span>•</span>
                  <span className="text-[#ffd32a] font-bold uppercase tracking-wider">EDITORIAL COLUMN</span>
                </div>
                <h2 className="font-display text-2xl md:text-4xl font-extrabold mb-6 leading-tight text-white uppercase">
                  {selectedBlog.title}
                </h2>
                <div className="w-12 h-[2px] bg-[#ffd32a]/30 mb-8" />
                <div className="font-body text-sm md:text-base text-slate-300 leading-relaxed font-light whitespace-pre-wrap">
                  {selectedBlog.content}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-[#050505] w-full text-center text-xs font-mono text-slate-600 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 px-8">
          <span>&copy; 2026 BIG TV NEWSNET. ALL RIGHTS RESERVED.</span>
          <span>AR-ACC REGISTERED SYSTEM</span>
        </div>
      </footer>

    </div>
  )
}
