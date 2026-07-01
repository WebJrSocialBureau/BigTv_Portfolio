import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { 
  Award, 
  Mail, 
  Play, 
  Pause,
  ChevronRight, 
  BookOpen, 
  FileText, 
  Radio, 
  Maximize2,
  Calendar,
  MapPin,
  Lock,
  ArrowUpRight,
  ShieldAlert,
  Mic,
  Compass
} from 'lucide-react'
import Lenis from 'lenis'
import ganeshImg from '../assets/GaneshYarakala/Ganesh.jpg'

// WebGL Background Shader Component
const WebGLShader = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let animationFrameId
    let resizeObserver

    const syncSize = () => {
      const w = canvas.clientWidth || window.innerWidth
      const h = canvas.clientHeight || window.innerHeight
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
    }

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(syncSize)
      resizeObserver.observe(canvas)
    } else {
      window.addEventListener('resize', syncSize)
    }
    syncSize()

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) return

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `

    const fs = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;

      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 a0 = x - floor(x + 0.5);
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() { 
        vec2 uv = v_texCoord; 
        float noise1 = snoise(uv * 1.2 + u_time * 0.03); 
        float noise2 = snoise(uv * 2.5 - u_time * 0.012); 
        vec3 bg = vec3(1.0, 1.0, 1.0); 
        vec3 electricBlue = vec3(0.0, 0.333, 1.0); 
        vec3 cyanTint = vec3(0.92, 0.96, 1.0); 
        float f = noise1 * 0.6 + noise2 * 0.4; 
        f = smoothstep(0.0, 1.0, f);
        vec3 mixColor = mix(cyanTint, electricBlue, f * 0.25);
        vec3 finalColor = mix(bg, mixColor, 0.12); 
        gl_FragColor = vec4(finalColor, 1.0); 
      }
    `

    const cs = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }

    const prog = gl.createProgram()
    gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs))
    gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)

    const pos = gl.getAttribLocation(prog, 'a_position')
    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(prog, 'u_time')

    const render = (t) => {
      gl.viewport(0, 0, canvas.width, canvas.height)
      if (uTime) gl.uniform1f(uTime, t * 0.001)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      animationFrameId = requestAnimationFrame(render)
    }

    render(0)

    return () => {
      cancelAnimationFrame(animationFrameId)
      if (resizeObserver) {
        resizeObserver.disconnect()
      } else {
        window.removeEventListener('resize', syncSize)
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block opacity-40" />
    </div>
  )
}

// Magnetic Button Wrapper Component
const MagneticButton = ({ children, className = '', ...props }) => {
  const buttonRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const rect = buttonRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setPosition({ x: x * 0.25, y: y * 0.25 })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      className={`relative inline-block ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

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

// Default portfolio fallback for Ganesh Yarakala
const defaultGaneshPortfolio = {
  heroTitle: "A Legacy of Truth: Journalism Reimagined",
  heroSubtitle: "Associate Editor at BIG TV. Veteran investigative journalist. Mentoring the next generation of truth-seekers after a storied 14-year tenure at TV9.",
  pillars: [
    {
      title: "Investigative Excellence",
      desc: "Uncovering what is hidden through rigorous verification, data validation, and an unwavering eye for detail that defined decades of prime-time reporting."
    },
    {
      title: "Fearless Reporting",
      desc: "A career built on the front lines of conflict, challenging administrative frameworks, and giving voice to marginalized populations in critical socio-political climates."
    },
    {
      title: "Broadcast Mentorship",
      desc: "Cultivating professional journalistic talent at both BIG TV and TV9 networks, ensuring critical core values thrive in the age of rapid content loops."
    }
  ],
  timeline: [
    {
      period: "PRESENT — ASSOCIATE EDITOR",
      title: "BIG TV Broadcast & Digital",
      desc: "Leading regional newsroom synergy across digital and satellite television operations. Directing investigative bureaus, overseeing governance, and designing long-form broadcast dossiers.",
      tags: ["Media Architecture", "Sat Broadcast"]
    },
    {
      period: "2008 — 2022 (14 YEARS)",
      title: "Senior Editorial Leader, TV9",
      desc: "A defining era of ground-breaking field reporting. Headed core political investigative units and anchored prime-time segments. Pioneered regional news gathering frameworks and trained 80+ junior media professionals.",
      tags: ["Live Anchor", "Field Investigation"]
    },
    {
      period: "1998 — 2008",
      title: "Print Media & Regional Foundations",
      desc: "Began the journalistic pursuit as an intern with the Vishalandhra publication bureau. Mastered traditional investigative copy editing, field correspondence, and community journalism.",
      tags: ["Print Room", "Copy Editing"]
    }
  ],
  broadcastHighlights: [
    {
      period: "Present",
      station: "BIG TV NETWORK",
      title: "Regional Digital & Broadcast Synergy",
      desc: "Leading regional digital and broadcast synergy, overseeing prime-time investigative features and newsroom governance."
    },
    {
      period: "2008 — 2022",
      station: "TV9 TENURE",
      title: "Senior Editorial Leadership",
      desc: "A foundational era of ground-breaking reporting, rising through the ranks to senior editorial leadership while shaping the channel's most impactful stories."
    },
    {
      period: "1998 — 2008",
      station: "VISHALANDHRA",
      title: "Print & Regional Foundations",
      desc: "Starting as an intern at Vishalandhra, mastering the craft of long-form reporting and print integrity across regional bureaus."
    }
  ],
  awards: [
    {
      title: "Ramnath Goenka Excellence in Journalism",
      category: "RECOGNITION",
      desc: "Finalist status for uncompromising investigative work that pushed the boundaries of public interest reporting in India."
    },
    {
      title: "State Excellence Award",
      category: "RECOGNITION",
      desc: "Awarded for the \"Deep Impact\" investigative series covering rural economic transitions."
    },
    {
      title: "Journalist of the Decade",
      category: "RECOGNITION",
      desc: "Nominated by the Regional Press Association for a career defined by consistent ethical bravery."
    }
  ],
  blogs: [
    {
      title: "The Future of Regional Broadcasting in a Digital-First World",
      date: "June 15, 2026",
      excerpt: "An analysis of the shifting broadcast dynamics and how regional channels can survive digital content loops.",
      content: "Regional broadcasting faces an existential transition as digital streaming platforms capture traditional cable audiences. To survive, newsrooms must integrate digital-first content workflows, enabling reporters to publish multi-format reports directly to mobile devices, social channels, and web apps while retaining the high editorial integrity of traditional television journalism."
    },
    {
      title: "Ethical Truth in the Era of Rapid Social Media Feeds",
      date: "May 20, 2026",
      excerpt: "Navigating verification protocols when sensationalism travels faster than the facts.",
      content: "When social media feeds prioritize speed and engagement over absolute accuracy, journalists face massive pressure to publish unverified details. Maintaining rigorous secondary source checks, verification protocols, and field checks is not a slow relic of print journalism—it is the ultimate defense against disinformation and the cornerstone of public trust."
    }
  ],
  events: [
    {
      title: "National Broadcast Synergy Summit",
      date: "2026-07-12",
      location: "Hyderabad Convention Center",
      desc: "Keynote address on regional media architecture and digital satellite integration."
    },
    {
      title: "Ethics in Investigative Reporting Workshop",
      date: "2026-08-05",
      location: "BIG TV Newsroom Hub",
      desc: "A masterclass for senior correspondents covering ground verification and source protection."
    }
  ],
  youtubeLink: "https://www.youtube.com/embed/dQw4w9WgXcQ"
};

export default function ProfilePortal({ identifier }) {
  const [profileUser, setProfileUser] = useState({
    name: 'Ganesh Yarakala',
    email: 'ganesh@bigtv.com',
    division: 'Associate Editor',
    bio: 'Associate Editor at BIG TV with 26 years of editorial integrity. Leading regional digital & broadcast synergy. Formative senior tenure at TV9.',
    status: 'LIVE RECORD'
  })

  const [portfolio, setPortfolio] = useState({
    heroTitle: "A Legacy of Truth: Journalism Reimagined",
    heroSubtitle: "Associate Editor at BIG TV. Veteran investigative journalist. Mentoring the next generation of truth-seekers after a storied 14-year tenure at TV9.",
    pillars: [],
    timeline: [],
    broadcastHighlights: [],
    awards: [],
    blogs: [],
    events: [],
    youtubeLink: ""
  })

  const [selectedBlog, setSelectedBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  // Header scroll behavior state
  const [showHeader, setShowHeader] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Motion setup for scroll indicators
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Scroll Listener for header visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowHeader(false)
      } else {
        setShowHeader(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Initialize Lenis for Smooth Scrolling
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

    return () => {
      lenis.destroy()
    }
  }, [])

  // Dynamic Portfolio Loading
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/users')
        if (res.ok) {
          const users = await res.json()
          const matched = users.find(u => 
            u.email?.toLowerCase() === identifier?.toLowerCase() || 
            u.id === identifier || 
            u._id === identifier
          )

          if (matched) {
            setProfileUser({
              name: matched.name || 'Correspondent',
              email: matched.email || '',
              division: matched.division || 'General Division',
              bio: matched.bio || 'Accredited newsroom correspondent.',
              status: matched.status || 'PENDING VERIFICATION'
            })

            const port = matched.portfolio || {}
            setPortfolio({
              heroTitle: port.heroTitle || `Portfolio of ${matched.name}`,
              heroSubtitle: port.heroSubtitle || matched.bio || '',
              pillars: port.pillars || [],
              timeline: port.timeline || [],
              broadcastHighlights: port.broadcastHighlights || [],
              awards: port.awards || [],
              blogs: port.blogs || [],
              events: port.events || [],
              youtubeLink: port.youtubeLink || ''
            })
          } else if (identifier?.toLowerCase() === 'ganesh@bigtv.com') {
            // Seeding / fallback for Ganesh Yarakala if not fetched
            setPortfolio(defaultGaneshPortfolio)
          }
        }
      } catch (err) {
        console.error('Failed to fetch dynamic profile:', err)
        if (identifier?.toLowerCase() === 'ganesh@bigtv.com') {
          setPortfolio(defaultGaneshPortfolio)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [identifier])

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

  // Custom motion variants for section entries
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  if (loading && identifier?.toLowerCase() !== 'ganesh@bigtv.com') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-mono text-xs text-[#e30613]">
        <div className="flex flex-col items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e30613] animate-ping" />
          <span>CONNECTING TO NEWSROOM SECURE REGISTRY...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-[#10141a] relative font-body selection:bg-primary selection:text-white antialiased">
      {/* WebGL background canvas */}
      <WebGLShader />

      {/* Interactive top scroll progress indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[4px] bg-primary z-[200] origin-left"
        style={{ scaleX }}
      />

      {/* Header */}
      <header className={`fixed top-0 left-0 w-full z-[100] transition-transform duration-300 bg-white/70 backdrop-blur-xl border-b border-black/5 py-4 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
        <nav className="flex justify-between items-center max-w-container-max mx-auto px-margin-desktop h-12 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs uppercase font-bold flex items-center gap-3"
          >
            <a 
              href="#/" 
              className="text-[#e30613] hover:text-[#b0050d] transition-colors flex items-center gap-1.5 border border-[#e30613]/20 px-2.5 py-1 rounded bg-[#e30613]/5"
            >
              ← HUB
            </a>
            <span className="text-black/25">|</span>
            <span className="text-text-primary tracking-[0.2em]">{profileUser.name}</span>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-10">
            {['pillars', 'journey', 'showreel', 'awards', 'blogs', 'events', 'connect'].map((section, idx) => {
              // Conditionally hide navigation links if sections are empty
              if (section === 'awards' && (!portfolio.awards || portfolio.awards.length === 0)) return null;
              if (section === 'blogs' && (!portfolio.blogs || portfolio.blogs.length === 0)) return null;
              if (section === 'events' && (!portfolio.events || portfolio.events.length === 0)) return null;
              if (section === 'showreel' && (!portfolio.youtubeLink && (!portfolio.broadcastHighlights || portfolio.broadcastHighlights.length === 0))) return null;

              return (
                <motion.a 
                  key={section}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="font-mono text-[11px] uppercase tracking-wider text-text-muted hover:text-primary transition-all duration-300 relative group" 
                  href={`#${section}`}
                >
                  {section}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary transition-all group-hover:w-full"></span>
                </motion.a>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden md:block"
          >
            {profileUser.email && (
              <MagneticButton>
                <a className="px-6 py-2.5 bg-primary text-white font-mono text-xs tracking-wider rounded hover:brightness-110 transition-all shadow-sm" href={`mailto:${profileUser.email}`}>
                  CONNECT
                </a>
              </MagneticButton>
            )}
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <section className="min-h-screen flex flex-col lg:flex-row items-center max-w-container-max mx-auto px-margin-desktop pt-32 pb-20 gap-16 relative overflow-hidden" id="hero-sec">
          {/* Animated decorative grid lines */}
          <div className="absolute inset-0 grid grid-cols-12 gap-gutter pointer-events-none opacity-20">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-full border-r border-dashed border-black/5" />
            ))}
          </div>

          {/* Left Column - Main Details */}
          <div className="w-full lg:w-7/12 z-10 text-left flex flex-col justify-center">
            
            {/* compliance verification seal */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/50 px-3.5 py-1.5 rounded-full mb-8 w-fit"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono text-[9px] tracking-wider text-emerald-800 font-bold uppercase">
                {profileUser.status}
              </span>
            </motion.div>

            {/* Correspondent Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight mb-8 leading-[1.08] text-text-primary"
            >
              {portfolio.heroTitle}
            </motion.h1>

            {/* Professional Summary */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="font-body text-base text-text-muted mb-12 font-light leading-relaxed max-w-xl animate-fade-in"
            >
              {portfolio.heroSubtitle}
            </motion.p>

            {/* Micro details links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {(portfolio.youtubeLink || (portfolio.broadcastHighlights && portfolio.broadcastHighlights.length > 0)) && (
                <MagneticButton>
                  <a className="px-10 py-4 bg-primary text-white font-mono text-xs tracking-widest rounded hover:brightness-110 transition-all text-center block shadow-md" href="#showreel">
                    WATCH THE SHOWREEL
                  </a>
                </MagneticButton>
              )}
              <MagneticButton>
                <a className="px-10 py-4 border border-text-primary/10 text-text-primary font-mono text-xs tracking-widest rounded hover:bg-black/5 transition-all text-center block" href="#pillars">
                  CORE PILLARS
                </a>
              </MagneticButton>
            </motion.div>
          </div>

          {/* Right Column - Image Showcase */}
          <div className="w-full lg:w-5/12 z-10 flex justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-[400px] aspect-[2/3.1] rounded-2xl overflow-hidden shadow-2xl border border-black/5 group bg-slate-900"
            >
              {/* Overlay shading for light/dark blending */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 z-10 transition-opacity group-hover:opacity-40 duration-500 pointer-events-none" />
              
              {/* Parallax / Zoom Image */}
              {profileUser.email.toLowerCase() === 'ganesh@bigtv.com' ? (
                <motion.img 
                  src={ganeshImg}
                  alt={profileUser.name}
                  className="w-full h-full object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-700 filter grayscale hover:grayscale-0"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#0055ff] to-[#002288] flex flex-col items-center justify-center text-white p-8">
                  <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center font-display text-4xl font-black mb-4">
                    {profileUser.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="font-mono text-[10px] tracking-widest uppercase opacity-75">{profileUser.division}</span>
                </div>
              )}

              {/* Floating micro-label over image */}
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-white/85 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-lg">
                <p className="font-mono text-[9px] text-[#0055ff] tracking-wider uppercase font-bold">CURRENT STATION</p>
                <h3 className="font-display text-xs font-extrabold text-[#10141a]">{profileUser.division}, BIG TV</h3>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pillars Section */}
        {portfolio.pillars && portfolio.pillars.length > 0 && (
          <section className="py-24 max-w-container-max mx-auto px-margin-desktop border-t border-black/5" id="pillars">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4">
              <div>
                <p className="font-mono text-xs text-primary tracking-widest uppercase mb-3">MANIFESTO</p>
                <h2 className="font-display text-3xl md:text-5xl font-extrabold text-text-primary">Core Ethical Pillars</h2>
              </div>
              <div className="flex-grow h-[1px] bg-black/5 mx-12 hidden md:block" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {portfolio.pillars.map((pillar, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -6 }}
                  className="bg-white border border-black/5 rounded-xl p-8 hover:shadow-xl transition-all duration-300 relative group flex flex-col justify-between min-h-[220px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div>
                    <span className="font-mono text-[10px] text-primary/40 font-bold block mb-4">0{idx + 1}</span>
                    <h3 className="font-display text-lg font-extrabold mb-3 text-text-primary group-hover:text-primary transition-colors">{pillar.title}</h3>
                    <p className="font-body text-xs text-text-muted leading-relaxed font-light">{pillar.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Timeline Journey Section */}
        {portfolio.timeline && portfolio.timeline.length > 0 && (
          <section className="py-24 bg-surface-dim relative overflow-hidden" id="journey">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="max-w-container-max mx-auto px-margin-desktop relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 gap-4">
                <div>
                  <p className="font-mono text-xs text-primary tracking-widest uppercase mb-3">ARCHIVES</p>
                  <h2 className="font-display text-3xl md:text-5xl font-extrabold text-text-primary">Chronological Journey</h2>
                </div>
                <div className="flex-grow h-[1px] bg-black/5 mx-12 hidden md:block" />
              </div>

              {/* Central vertical track */}
              <div className="relative border-l-2 border-black/5 pl-8 md:pl-16 space-y-16 max-w-4xl mx-auto text-left">
                
                {portfolio.timeline.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUp}
                    className="relative"
                  >
                    {/* Floating node dot on line */}
                    <span className="absolute -left-[38px] md:-left-[70px] top-1.5 w-[14px] h-[14px] rounded-full border-2 border-primary bg-white z-10 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    </span>

                    <span className="font-mono text-[10px] text-primary tracking-widest font-extrabold uppercase block mb-2">{item.period}</span>
                    <h3 className="font-display text-xl md:text-2xl font-black mb-3 text-text-primary">{item.title}</h3>
                    <p className="font-body text-xs text-text-muted leading-relaxed font-light mb-6 max-w-2xl">{item.desc}</p>
                    
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span key={tag} className="font-mono text-[9px] text-[#475569] bg-white border border-black/5 px-2.5 py-1 rounded">
                            {tag.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Showreel & Broadcast Highlights Section */}
        {(portfolio.youtubeLink || (portfolio.broadcastHighlights && portfolio.broadcastHighlights.length > 0)) && (
          <section className="py-24 max-w-container-max mx-auto px-margin-desktop border-t border-black/5" id="showreel">
            <div className="flex flex-col lg:flex-row gap-16">
              
              {/* Left Column: Title & Info */}
              <div className="lg:w-4/12 flex flex-col justify-between gap-12 text-left">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                >
                  <p className="font-mono text-xs text-primary tracking-widest uppercase mb-3">ON-AIR MILESTONES</p>
                  <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-6">Broadcast highlights</h2>
                  <p className="font-body text-text-muted leading-relaxed">
                    Anchoring regional panels, directing newsroom strategy, and leading prime-time investigative features that defined their television career.
                  </p>
                </motion.div>

                <div className="hidden lg:block border-l-2 border-primary/20 pl-4 py-2 font-mono text-[10px] text-text-muted">
                  <span className="font-bold text-primary uppercase block mb-1">FACT CHECK COMPLIANCE</span>
                  All broadcast activities are verified and recorded within network registries.
                </div>
              </div>

              {/* Right Column: Broadcast Video & Cards */}
              <div className="lg:w-8/12 flex flex-col gap-6">
                {/* YouTube Video Player Embed */}
                {portfolio.youtubeLink && (
                  <div className="mb-6 aspect-video w-full rounded-2xl overflow-hidden border border-black/10 shadow-lg bg-black">
                    <iframe
                      src={getEmbedUrl(portfolio.youtubeLink)}
                      title="Broadcast Showreel / Video"
                      className="w-full h-full border-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}

                {portfolio.broadcastHighlights.map((card, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -4 }}
                    className="bg-white border border-black/5 rounded-xl p-8 hover:shadow-xl transition-all duration-300 relative overflow-hidden group flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="max-w-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-2 py-0.5 bg-[#0055ff]/10 text-primary font-mono text-[9px] font-bold rounded uppercase">
                          {card.period}
                        </span>
                        <span className="font-mono text-[10px] text-text-muted">{card.station}</span>
                      </div>
                      <h3 className="font-display text-xl font-extrabold mb-2 group-hover:text-primary transition-colors">{card.title}</h3>
                      <p className="font-body text-sm text-text-muted leading-relaxed">
                        {card.desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 h-8 w-16 justify-end">
                      {[...Array(6)].map((_, i) => (
                        <motion.span
                          key={i}
                          animate={{ 
                            height: ['20%', `${Math.floor(Math.random() * 60) + 15}%`, '20%']
                          }}
                          transition={{ 
                            duration: 0.7 + idx * 0.1, 
                            repeat: Infinity, 
                            delay: i * 0.08,
                            ease: 'easeInOut'
                          }}
                          className="w-1 bg-[#0055ff] rounded-t-full"
                        />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          </section>
        )}

        {/* Awards Gallery Section */}
        {portfolio.awards && portfolio.awards.length > 0 && (
          <section className="py-24 bg-surface-deep/40 relative overflow-hidden" id="awards">
            <div className="max-w-container-max mx-auto px-margin-desktop relative z-10">
              
              <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4 text-left">
                <div>
                  <p className="font-mono text-xs text-primary tracking-widest uppercase mb-3">HONORS</p>
                  <h2 className="font-display text-3xl md:text-5xl font-extrabold text-text-primary">Recognition of Merit</h2>
                </div>
                <div className="flex-grow h-[1px] bg-black/5 mx-12 hidden md:block" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {portfolio.awards.map((award, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -6 }}
                    className="bg-white border border-black/5 rounded-xl p-8 flex flex-col justify-between hover:shadow-xl transition-all duration-300 relative group text-left"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <span className="font-mono text-[9px] font-bold tracking-widest text-primary bg-primary/5 px-2.5 py-1 rounded border border-primary/10">
                          {award.category}
                        </span>
                        <Award className="w-5 h-5 text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
                      </div>
                      
                      <h3 className="font-display text-xl font-extrabold mb-4 group-hover:text-primary transition-colors">
                        {award.title}
                      </h3>
                      <p className="font-body text-xs text-text-muted leading-relaxed">
                        {award.desc}
                      </p>
                    </div>

                    <div className="border-t border-black/5 pt-6 mt-8 flex justify-between items-center text-[10px] font-mono text-text-muted">
                      <span>VETTED PROFILE RECORD</span>
                      <span>VERIFIABLE</span>
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          </section>
        )}

        {/* YouTube Showreel Section (Horizontal Scroll just above Blogs) */}
        {portfolio.youtubeLink && portfolio.youtubeLink.split(',').some(link => link.trim().includes('/embed/')) && (
          <section id="showreel" className="py-24 max-w-container-max mx-auto px-margin-desktop border-t border-black/5">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4 text-left">
              <div>
                <p className="font-mono text-xs text-primary tracking-widest uppercase mb-3">BROADCASTS</p>
                <h2 className="font-display text-3xl md:text-5xl font-extrabold text-text-primary">Featured Showreels</h2>
              </div>
              <div className="flex-grow h-[1px] bg-black/5 mx-12 hidden md:block" />
            </div>

            {/* Horizontal Scroll wrapper */}
            <div className="relative w-full overflow-hidden">
              <div 
                className="flex flex-row overflow-x-auto gap-8 pb-10 pt-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent -mx-4 px-4 md:mx-0 md:px-0"
                style={{ scrollbarWidth: 'thin', msOverflowStyle: 'none' }}
              >
                {portfolio.youtubeLink.split(',').map((link, idx) => {
                  const embedUrl = link.trim();
                  if (!embedUrl || !embedUrl.includes('/embed/')) return null;

                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -6 }}
                      className="snap-center shrink-0 w-[80vw] sm:w-[420px] md:w-[540px] bg-white border border-black/5 rounded-3xl p-4 md:p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative group overflow-hidden flex flex-col justify-between text-left"
                    >
                      <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-inner" style={{ paddingTop: '56.25%' }}>
                        <iframe
                          src={embedUrl}
                          className="absolute inset-0 w-full h-full border-none"
                          title={`YouTube Showreel ${idx + 1}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      <div className="mt-4 flex justify-between items-center font-mono text-[9px] text-primary font-bold uppercase tracking-wider">
                        <span>BIG TV BROADCAST NETWORK</span>
                        <span>SHOWREEL 0{idx + 1}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Blogs & Insights Section */}
        {portfolio.blogs && portfolio.blogs.length > 0 && (
          <section className="py-24 max-w-container-max mx-auto px-margin-desktop border-t border-black/5" id="blogs">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4 text-left">
              <div>
                <p className="font-mono text-xs text-primary tracking-widest uppercase mb-3">WRITINGS</p>
                <h2 className="font-display text-3xl md:text-5xl font-extrabold text-text-primary">Blogs &amp; Insights</h2>
              </div>
              <div className="flex-grow h-[1px] bg-black/5 mx-12 hidden md:block" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {portfolio.blogs.map((blog, idx) => (
                <motion.article 
                  key={blog._id || idx}
                  whileHover={{ y: -4 }}
                  className="glass-panel rounded-xl bg-white border border-black/5 hover:border-primary/20 transition-all duration-300 flex flex-col justify-between text-left overflow-hidden"
                >
                  {blog.image && (
                    <div className="w-full aspect-[2/1] overflow-hidden bg-slate-100 border-b border-black/5">
                      <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transition-all duration-500" />
                    </div>
                  )}
                  <div className="p-8 md:p-12 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 font-mono text-[10px] text-text-muted mb-4">
                        <span>{blog.date}</span>
                        <span>•</span>
                        <span className="text-primary font-bold">EDITORIAL</span>
                      </div>
                      <h3 className="font-display text-xl md:text-2xl font-extrabold mb-4 hover:text-primary transition-colors leading-tight">
                        {blog.title}
                      </h3>
                      <p className="font-body text-sm text-text-muted leading-relaxed mb-6 font-light">
                        {blog.excerpt}
                      </p>
                    </div>
                    <button 
                      onClick={() => setSelectedBlog(blog)}
                      className="font-mono text-xs text-primary hover:text-[#b0050d] transition-colors font-bold flex items-center gap-1.5 cursor-pointer bg-transparent border-none outline-none mt-4"
                    >
                      READ ARTICLE <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Events Section */}
        {portfolio.events && portfolio.events.length > 0 && (
          <section className="py-24 max-w-container-max mx-auto px-margin-desktop border-t border-black/5" id="events">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4 text-left">
              <div>
                <p className="font-mono text-xs text-primary tracking-widest uppercase mb-3">SCHEDULE</p>
                <h2 className="font-display text-3xl md:text-5xl font-extrabold text-text-primary">Upcoming Events</h2>
              </div>
              <div className="flex-grow h-[1px] bg-black/5 mx-12 hidden md:block" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {portfolio.events.map((event, idx) => (
                <motion.div 
                  key={event._id || idx}
                  whileHover={{ y: -4 }}
                  className="bg-white border border-black/5 rounded-xl p-8 hover:shadow-lg transition-all duration-300 flex flex-col gap-6"
                >
                  <div className="flex items-start gap-4">
                    {/* Date Block */}
                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 flex flex-col items-center justify-center min-w-[100px] text-primary flex-shrink-0">
                      <Calendar className="w-4 h-4 mb-1" />
                      <span className="font-mono text-[10px] font-bold text-center">{event.date}</span>
                    </div>

                    <div className="text-left flex-grow">
                      <h3 className="font-display text-lg font-extrabold mb-2 hover:text-primary transition-colors leading-snug">{event.title}</h3>
                      <p className="font-body text-xs text-text-muted leading-relaxed font-light mb-3">{event.desc}</p>
                      <div className="flex items-center gap-1.5 font-mono text-[9px] text-primary tracking-wider font-bold">
                        <MapPin className="w-3.5 h-3.5" /> {event.location ? event.location.toUpperCase() : ""}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
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
              className="fixed inset-0 bg-black/50 backdrop-blur-md z-[300] flex items-center justify-center p-4"
              onClick={() => setSelectedBlog(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-black/5 shadow-2xl relative text-left"
                onClick={e => e.stopPropagation()}
                data-lenis-prevent
              >
                {selectedBlog.image && (
                  <div className="w-full aspect-[21/9] overflow-hidden bg-slate-100 border-b border-black/5">
                    <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-8 md:p-12 relative">
                  <button 
                    onClick={() => setSelectedBlog(null)}
                    className="absolute top-6 right-6 font-mono text-xs tracking-wider text-text-muted hover:text-primary focus:outline-none cursor-pointer bg-transparent border-none"
                  >
                    [ CLOSE ]
                  </button>
                  <div className="flex items-center gap-3 font-mono text-[10px] text-text-muted mb-6">
                    <span>{selectedBlog.date}</span>
                    <span>•</span>
                    <span className="text-primary font-bold">EDITORIAL ARTICLE</span>
                  </div>
                  <h2 className="font-display text-2xl md:text-4xl font-extrabold mb-6 leading-tight">
                    {selectedBlog.title}
                  </h2>
                  <div className="w-12 h-[2px] bg-primary/30 mb-8" />
                  <div className="font-body text-sm md:text-base text-text-muted leading-relaxed font-light whitespace-pre-wrap">
                    {selectedBlog.content}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Manifesto Quote Section */}
        <section className="py-32 relative overflow-hidden bg-[#ebf0f5]/20">
          <div className="max-w-container-max mx-auto px-margin-desktop text-center relative z-10">
            <span className="font-mono text-primary text-5xl mb-8 block select-none">“</span>
            
            <motion.h2 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-100px" }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
              className="font-display text-3xl md:text-5xl italic font-light text-text-primary leading-[1.35] max-w-4xl mx-auto mb-8 flex flex-wrap justify-center gap-x-2.5 gap-y-1.5"
            >
              {"Journalism is not just a profession; it is a profound commitment to the public's right to".split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } }
                  }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}
              <motion.span
                variants={{
                  hidden: { opacity: 0, scale: 0.9, y: 12 },
                  visible: { 
                    opacity: 1, 
                    scale: 1, 
                    y: 0, 
                    transition: { duration: 0.5, type: 'spring', stiffness: 120 } 
                  }
                }}
                className="text-primary not-italic font-extrabold relative inline-block pl-1"
              >
                know.
              </motion.span>
            </motion.h2>

            <p className="font-mono text-xs tracking-widest text-text-muted uppercase font-bold">
              — EDITORIAL MANIFESTO, {profileUser.name.toUpperCase()}
            </p>
          </div>
        </section>

        {/* Contact CTA */}
        {profileUser.email && (
          <section className="py-24 max-w-container-max mx-auto px-margin-desktop" id="connect">
            <div className="glass-panel rounded-xl p-12 md:p-20 flex flex-col lg:flex-row justify-between items-center gap-12 border border-black/5 bg-white shadow-xl">
              <div className="text-center lg:text-left">
                <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-4">Initiate a Dialogue</h2>
                <p className="font-body text-text-muted text-sm max-w-md leading-relaxed font-light">
                  Available for editorial collaborations, speaking engagements, and professional broadcast newsroom consultations.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
                <a 
                  href={`mailto:${profileUser.email}`} 
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white font-mono text-xs tracking-widest rounded hover:brightness-110 transition-all shadow-md text-center"
                >
                  <Mail className="w-4 h-4" /> SEND EMAIL
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center justify-center gap-3 px-8 py-4 border border-black/10 text-text-primary hover:bg-black/5 font-mono text-xs tracking-widest rounded transition-all text-center"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> LINKEDIN
                </a>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-16 border-t border-slate-900">
        <div className="max-w-container-max mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-12 text-left">
          
          <div>
            <div className="font-display text-xl font-black tracking-widest text-[#0055ff] mb-2">{profileUser.name.toUpperCase()}</div>
            <p className="font-mono text-[9px] text-slate-500 tracking-wider">BIG TV // REGIONAL EDITORIAL DIVISION</p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 font-mono text-[10px] uppercase tracking-wider text-slate-400">
            <a href="#pillars" className="hover:text-white transition-colors">Pillars</a>
            <a href="#journey" className="hover:text-white transition-colors">Journey</a>
            {(portfolio.youtubeLink || (portfolio.broadcastHighlights && portfolio.broadcastHighlights.length > 0)) && (
              <a href="#showreel" className="hover:text-white transition-colors">Showreel</a>
            )}
            {profileUser.email && (
              <a href={`mailto:${profileUser.email}`} className="hover:text-white transition-colors">Connect</a>
            )}
          </div>

          <div className="text-center md:text-right">
            <p className="font-mono text-[10px] text-slate-500 leading-relaxed">
              © {new Date().getFullYear()} {profileUser.name.toUpperCase()}.<br/>
              BUILT FOR THE PURSUIT OF TRUTH.
            </p>
          </div>

        </div>
      </footer>
    </div>
  )
}
