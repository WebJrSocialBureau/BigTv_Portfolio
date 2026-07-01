import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { 
  Lock, 
  ArrowUpRight, 
  FileText, 
  Radio, 
  ShieldAlert, 
  ChevronRight, 
  Globe, 
  Cpu,
  Volume2,
  VolumeX,
  Film,
  Quote,
  Sparkles,
  MapPin,
  Compass
} from 'lucide-react'
import Lenis from 'lenis'
import DiagonalCarousel from '../Components/DiagonalCarousel.jsx'
import ganeshImg from '../assets/GaneshYarakala/Ganesh.jpg'
import aparnaImg from '../assets/AparnaKurup.png'
import aryaImg from '../assets/AryaSurendran.png'
import binilImg from '../assets/BinilPothan.webp'

// Web Audio API tactile feedback synthesizer
const playSwell = (frequency = 100, enabled = false) => {
  if (!enabled) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(60, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency, ctx.currentTime + 0.6);
    
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.62);
  } catch (e) {
    console.warn("Audio context not allowed or failed", e);
  }
};

function KineticText({ text, color = "#e30613" }) {
  const letters = text.split("");

  return (
    <div className="relative w-full overflow-hidden flex justify-center items-center h-[20vw] min-h-[140px] md:min-h-[220px]">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={text}
          className="flex justify-center select-none"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.02,
                delayChildren: 0.02
              }
            },
            exit: {
              transition: {
                staggerChildren: 0.015,
                staggerDirection: -1
              }
            }
          }}
        >
          {letters.map((char, index) => (
            <div
              key={`${char}-${index}`}
              className="relative overflow-hidden flex items-center justify-center font-display text-[11vw] md:text-[10vw] font-black uppercase leading-none"
              style={{ height: "1.2em" }}
            >
              <motion.span
                className="inline-block origin-bottom"
                style={{ color }}
                variants={{
                  hidden: {
                    y: "120%",
                    rotateX: -30,
                    scaleY: 1.6,
                    skewY: 6,
                    opacity: 0
                  },
                  visible: {
                    y: "0%",
                    rotateX: 0,
                    scaleY: 1,
                    skewY: 0,
                    opacity: 1,
                    transition: {
                      type: "spring",
                      stiffness: 140,
                      damping: 11,
                      mass: 0.7
                    }
                  },
                  exit: {
                    y: "-120%",
                    rotateX: 30,
                    scaleY: 1.4,
                    skewY: -6,
                    opacity: 0,
                    transition: {
                      ease: "easeInOut",
                      duration: 0.25
                    }
                  }
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function CorrespondentAvatars({ items, activeIndex, onHoverDirector, onLeaveDirector }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-6 my-6 px-4 z-20">
      {items.map((item, index) => {
        const isActive = activeIndex === index;
        const isLocked = item.status !== 'LIVE RECORD';
        
        return (
          <div
            key={item.id}
            onMouseEnter={() => onHoverDirector(index)}
            onMouseLeave={() => onLeaveDirector(index)}
            onClick={() => {
              if (!isLocked && item.link) {
                window.location.hash = item.link;
              }
            }}
            className="flex flex-col items-center cursor-pointer relative"
          >
            <div
              className={`w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden transition-all duration-300 relative border-2 ${
                isActive
                  ? `scale-105 shadow-lg`
                  : `border-transparent opacity-50 hover:opacity-100 hover:scale-102`
              }`}
              style={{
                borderColor: isActive ? item.primaryColor : 'transparent',
                boxShadow: isActive ? `0 0 15px ${item.primaryColor}40` : 'none',
              }}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className={`w-full h-full object-cover object-top transition-all duration-500 ${
                    isLocked ? 'grayscale opacity-30' : isActive ? 'grayscale-0' : 'grayscale'
                  }`}
                />
              ) : (
                <div
                  className={`w-full h-full flex flex-col justify-center items-center font-display font-black text-2xl transition-all duration-500 bg-neutral-900 ${
                    isLocked ? 'text-neutral-700' : 'text-white'
                  }`}
                >
                  {isLocked ? (
                    <Lock className="w-5 h-5 text-neutral-700" />
                  ) : (
                    item.name.split(' ').map(n => n[0]).join('')
                  )}
                </div>
              )}
              
              {/* Status Indicator Dot */}
              <div className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full border border-neutral-950 ${
                isLocked ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
            </div>

            {/* Glowing active indicator dot below */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="activeAvatarDot"
                  className="w-1.5 h-1.5 rounded-full mt-2 animate-pulse"
                  style={{ backgroundColor: item.primaryColor }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                />
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// WebGL Background Shader (BIG TV Crimson Red Variant)
const WebGLRedShader = () => {
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

    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => syncSize())
      resizeObserver.observe(canvas)
    } else {
      window.addEventListener('resize', syncSize)
    }

    syncSize()

    const gl = canvas.getContext('webgl')
    if (!gl) return

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        v_texCoord.y = 1.0 - v_texCoord.y;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `

    const fs = `
      precision mediump float;
      varying vec2 v_texCoord;
      uniform float u_time;

      vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx) ;
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0) )
          + i.x + vec3(0.0, i1.x, 1.0) );
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
          dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 a0 = x - floor(x + 0.5);
        vec3 g = a0 * vec3(x0.x, x12.x, x12.z) + h * vec3(x0.y, x12.y, x12.w);
        return 130.0 * dot(m, g);
      }

      void main() { 
        vec2 uv = v_texCoord; 
        float noise1 = snoise(uv * 1.0 + u_time * 0.02); 
        float noise2 = snoise(uv * 2.0 - u_time * 0.01); 
        vec3 bg = vec3(1.0, 1.0, 1.0); 
        vec3 cherryRed = vec3(0.89, 0.024, 0.075); 
        vec3 roseTint = vec3(1.0, 0.94, 0.94); 
        float f = noise1 * 0.6 + noise2 * 0.4; 
        f = smoothstep(0.0, 1.0, f);
        vec3 mixColor = mix(roseTint, cherryRed, f * 0.2);
        vec3 finalColor = mix(bg, mixColor, 0.09); 
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
      <canvas ref={canvasRef} className="w-full h-full block opacity-50" />
    </div>
  )
}

export default function BIGTVHub() {
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [showHeader, setShowHeader] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  
  const [currentUser, setCurrentUser] = useState(null)
  const [registeredCorres, setRegisteredCorres] = useState([])

  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHoveredOverSection, setIsHoveredOverSection] = useState(false)
  const sectionRef = useRef(null)

  // Custom spring cursor coordinates
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 25, stiffness: 280, mass: 0.6 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  const customCorres = registeredCorres.filter(u => u.email.toLowerCase() !== 'ganesh@bigtv.com' && u.email.toLowerCase() !== 'aparna@bigtv.com' && u.email.toLowerCase() !== 'arya@bigtv.com' && u.email.toLowerCase() !== 'admin@bigtv.com')

  // Reset selected correspondent on filter switch
  useEffect(() => {
    setActiveIndex(0)
  }, [activeFilter])

  // Play transition swell on selection change
  useEffect(() => {
    if (activeIndex !== null) {
      playSwell(85 + activeIndex * 10, audioEnabled)
    }
  }, [activeIndex, audioEnabled])

  // Track mouse coordinates for spotlight projections
  const handleMouseMove = (e) => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setMousePos({ x, y })

    // Update custom spring cursor
    cursorX.set(e.clientX)
    cursorY.set(e.clientY)
  }
  const ganeshDbData = registeredCorres.find(u => u.email.toLowerCase() === 'ganesh@bigtv.com')
  const ganeshName = ganeshDbData ? ganeshDbData.name : 'Ganesh Yarakala'
  const ganeshDivision = ganeshDbData ? ganeshDbData.division : 'Associate Editor'
  const ganeshBio = ganeshDbData ? ganeshDbData.bio : 'Associate Editor at BIG TV with 26 years of editorial integrity. Leading regional digital & broadcast synergy. Formative senior tenure at TV9.'
  const ganeshStatus = ganeshDbData ? ganeshDbData.status : 'LIVE RECORD'

  const aparnaDbData = registeredCorres.find(u => u.email.toLowerCase() === 'aparna@bigtv.com')
  const aparnaName = aparnaDbData ? aparnaDbData.name : 'Aparna Kurup'
  const aparnaDivision = aparnaDbData ? aparnaDbData.division : 'National Bureau'
  const aparnaBio = aparnaDbData ? aparnaDbData.bio : 'Senior Coordinating Editor, BIG TV 24/7. Over two decades of experience in broadcast news, specializing in live anchoring and editorial leadership.'
  const aparnaStatus = aparnaDbData ? aparnaDbData.status : 'LIVE RECORD'

  const aryaDbData = registeredCorres.find(u => u.email.toLowerCase() === 'arya@bigtv.com')
  const aryaName = aryaDbData ? aryaDbData.name : 'Arya Surendran'
  const aryaDivision = aryaDbData ? aryaDbData.division : 'Malayalam Bureau'
  const aryaBio = aryaDbData ? aryaDbData.bio : 'Associate News Editor & Anchor, BIG TV News Malayalam. Active since 2016 with experience in Kerala Kaumudi, 24 News, and Reporter TV.'
  const aryaStatus = aryaDbData ? aryaDbData.status : 'LIVE RECORD'

  useEffect(() => {
    const userSession = localStorage.getItem('currentUser')
    if (userSession) {
      setCurrentUser(JSON.parse(userSession))
    }

    const fetchCorrespondents = async () => {
      try {
        const response = await fetch('/api/users')
        if (response.ok) {
          const data = await response.json()
          setRegisteredCorres(data)
        }
      } catch (err) {
        console.error('Error fetching correspondents:', err)
      }
    }

    fetchCorrespondents()
  }, [])

  const spotlightItems = [
    {
      id: 'ganesh',
      name: ganeshName,
      shortName: 'GANESH',
      role: ganeshDivision,
      nationality: 'INDIA',
      primaryColor: '#2563eb',
      image: ganeshImg,
      status: ganeshStatus,
      aesthetic: 'Broadcast Synergy & Bureau Leadership',
      bio: ganeshBio,
      quote: 'True journalism anchors society to its values, ensuring public records remain untarnished.',
      keyWorks: [
        { title: 'Regional Digital & Broadcast Synergy', genre: 'Broadcast News', year: 'Present' },
        { title: 'TV9 Senior Editorial Leadership', genre: 'Field Investigation', year: '2008 — 2022' },
        { title: 'Vishalandhra Print Foundations', genre: 'Copy Editing', year: '1998 — 2008' }
      ],
      link: '#/ganesh-yarakala'
    },
    {
      id: 'aparna',
      name: aparnaName,
      shortName: 'APARNA',
      role: aparnaDivision,
      nationality: 'INDIA',
      primaryColor: '#10b981',
      image: aparnaImg,
      status: aparnaStatus,
      aesthetic: 'Prime-Time Bulletins & Live Moderation',
      bio: aparnaBio,
      quote: 'Rehearse your knowledge, not just your script. The script will fail you. Your knowledge never will.',
      keyWorks: [
        { title: 'Senior Coordinating Editor & Anchor', genre: 'BIG TV 24/7 Output', year: '2024 — Present' },
        { title: 'Special Correspondent Anchor', genre: 'Mathrubhumi News', year: '2020 — 2024' },
        { title: 'Prime-Time Anchoring & Debates', genre: 'Asianet News', year: '2004 — 2020' }
      ],
      link: '#/aparna-kurup'
    },
    {
      id: 'arya',
      name: aryaName,
      shortName: 'ARYA',
      role: aryaDivision,
      nationality: 'INDIA',
      primaryColor: '#f59e0b',
      image: aryaImg,
      status: aryaStatus,
      aesthetic: 'Malayalam Desk & Investigative Reports',
      bio: aryaBio,
      quote: 'As regional Malayalam broadcasting shifts, verification protocols remain our ultimate defense.',
      keyWorks: [
        { title: 'Associate News Editor & Anchor', genre: 'Malayalam Desk Output', year: '2024 — Present' },
        { title: 'Senior Anchor & Reporter', genre: '24 News & Reporter TV', year: '2021 — 2024' },
        { title: 'Broadcast Correspondent', genre: 'Kerala Kaumudi', year: '2016 — 2021' }
      ],
      link: '#/arya-surendran'
    },
    {
      id: 'binil',
      name: 'Binil Pothen Babu',
      shortName: 'BINIL',
      role: 'Senior News Editor & Anchor',
      nationality: 'INDIA',
      primaryColor: '#2563eb',
      image: binilImg,
      status: 'LIVE RECORD',
      aesthetic: 'Visual Media Strategy & Desk Chief',
      bio: 'Senior News Editor and Anchor at BIG TV Malayalam, serving as Desk Chief. Bridges newsroom strategy, on-screen presentation, and ground-zero bureaus.',
      quote: 'True journalism bridges the gap between the ground reality and the screen presentation.',
      keyWorks: [
        { title: 'Senior News Editor & Anchor', genre: 'BIG TV Malayalam', year: '2024 — Present' },
        { title: 'Bureau Operations & Correspondent', genre: 'Manorama, Reporter, MediaOne', year: '2014 — 2024' },
        { title: 'Delhi & Mumbai Bureau Chief', genre: 'National Politics', year: '2012 — 2014' }
      ],
      link: '#/binil-pothen'
    },
    ...customCorres.map((corres, idx) => ({
      id: `custom-${idx}`,
      name: corres.name,
      shortName: corres.name.split(' ')[0].toUpperCase(),
      role: corres.division,
      nationality: 'INDIA',
      primaryColor: corres.status === 'LIVE RECORD' ? '#8b5cf6' : '#64748b',
      image: null,
      status: corres.status,
      aesthetic: 'Accredited Newsroom Coverage',
      bio: corres.bio,
      quote: 'Committed to public service reporting, ethical verification, and broadcast transparency.',
      keyWorks: [
        { title: 'Correspondent Reports', genre: corres.division, year: '2026' }
      ],
      link: corres.status === 'LIVE RECORD' ? `#/profile/${encodeURIComponent(corres.email)}` : null
    }))
  ];

  const filteredSpotlight = spotlightItems.filter(item => {
    const filterUpper = activeFilter.toUpperCase();
    if (filterUpper === 'ALL') return true;
    if (filterUpper.includes('ACTIVE')) {
      return item.status === 'LIVE RECORD';
    }
    if (filterUpper.includes('PENDING')) {
      return item.status !== 'LIVE RECORD';
    }
    return true;
  });

  const activeCorres = activeIndex !== null && activeIndex < filteredSpotlight.length ? filteredSpotlight[activeIndex] : null;
  const currentTitle = activeCorres ? activeCorres.shortName : "NEWSROOM";
  const themeColor = activeCorres ? activeCorres.primaryColor : "#e30613";

  // Autoplay loop: cycle activeIndex when not hovering over a specific avatar
  useEffect(() => {
    if (hoveredIndex !== null) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const count = filteredSpotlight.length;
        if (count === 0) return 0;
        return (prevIndex + 1) % count;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [hoveredIndex, filteredSpotlight.length]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY <= 80) {
        setShowHeader(true)
      } else if (currentScrollY > lastScrollY) {
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
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
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
        staggerChildren: 0.12
      }
    }
  }

  const tickerItems = [
    "BIG TV EDITORIAL DEPLOYMENT V4.0.1",
    "FACT-CHECK PROTOCOL: ALL PROFILES VETTED AND SEALED",
    "LIVE BROADCAST BLUEPRINTS DIGITIZED",
    "JOURNALISTIC INTEGRITY SECURED FOR ALL CORRESPONDENTS"
  ]

  return (
    <div className="min-h-screen bg-white text-[#10141a] relative font-body selection:bg-[#e30613] selection:text-white antialiased">
      {/* WebGL Red Gradient Shader */}
      <WebGLRedShader />

      {/* Top Banner Ticker */}
      <div className="w-full bg-[#e30613] text-white py-2 overflow-hidden border-b border-[#b0050d] relative z-[100]">
        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] gap-12 font-mono text-[9px] tracking-[0.2em] font-bold">
          {[...Array(3)].map((_, i) => (
            <React.Fragment key={i}>
              {tickerItems.map((text, idx) => (
                <span key={idx} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  {text}
                </span>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Header */}
      <header 
        className={`fixed left-0 w-full z-50 transition-transform duration-300 bg-white/70 backdrop-blur-xl border-b border-black/5 py-4 ${
          showHeader ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{ top: lastScrollY < 28 ? `${28 - lastScrollY}px` : '0px' }}
      >
        <nav className="flex justify-between items-center max-w-container-max mx-auto px-margin-desktop h-12 w-full">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 bg-[#e30613] rounded flex items-center justify-center text-white font-display font-black text-xs">B</span>
            <div className="font-mono text-xs tracking-[0.2em] text-[#e30613] uppercase font-bold">
              BIG TV NEWSROOMS
            </div>
          </div>
        
        </nav>
      </header>

      {/* Interactive Journalist Spotlight Showcase */}
      <div
        ref={sectionRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHoveredOverSection(true)}
        onMouseLeave={() => {
          setIsHoveredOverSection(false);
        }}
        className="relative w-full bg-[#070707] text-white pt-24 pb-16 md:pt-36 md:pb-24 overflow-hidden border-y border-neutral-900 shadow-2xl select-none font-sans min-h-[450px] flex flex-col justify-center"
      >
        {/* 1. Projective Spotlight Ambient Glow */}
        <div 
          className="absolute inset-0 pointer-events-none transition-all duration-1000 ease-out z-0"
          style={{
            background: activeCorres
              ? `radial-gradient(circle 500px at ${mousePos.x}px ${mousePos.y}px, ${activeCorres.primaryColor}15, transparent 100%)`
              : `radial-gradient(circle 400px at ${mousePos.x}px ${mousePos.y}px, rgba(227, 6, 19, 0.03), transparent 100%)`
          }}
        />

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" 
          style={{ maskImage: "radial-gradient(ellipse at center, black, transparent)" }}
        />

        {/* 2. Custom Spring Pointer feedback */}
        <motion.div
          className="fixed top-0 left-0 w-8 h-8 rounded-full bg-red-500 pointer-events-none z-50 flex items-center justify-center mix-blend-screen hidden lg:flex"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            translateX: "-50%",
            translateY: "-50%",
            boxShadow: activeCorres 
              ? `0 0 25px ${activeCorres.primaryColor}`
              : "0 0 15px #e30613"
          }}
          animate={{
            scale: activeIndex !== null ? 1.6 : 0.8,
            opacity: isHoveredOverSection ? 1 : 0,
            backgroundColor: activeCorres ? activeCorres.primaryColor : "#e30613"
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-black" />
        </motion.div>

        {/* Content Wrapper aligned to grid */}
        <div className="w-full max-w-container-max mx-auto px-margin-desktop relative z-10 flex flex-col justify-center items-center flex-grow">
          {/* Central Stage */}
          <div className="flex flex-col justify-center items-center w-full py-4">
            <div className="text-center mb-2">
              <motion.div
                key={currentTitle}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] md:text-xs font-mono tracking-[0.3em] text-neutral-500 uppercase flex items-center justify-center gap-2"
              >
                <Compass className="w-3.5 h-3.5 text-red-500 animate-spin" style={{ animationDuration: "12s" }} />
                {activeCorres ? `${activeCorres.role} • ${activeCorres.nationality}` : "SELECT PORTRAITS OR TAP TO NAVIGATE THEIR VISIONARY NEWSROOMS"}
              </motion.div>
            </div>

            {/* Avatar Selection Row */}
            <CorrespondentAvatars
              items={filteredSpotlight}
              activeIndex={activeIndex}
              onHoverDirector={(idx) => {
                setHoveredIndex(idx);
                setActiveIndex(idx);
              }}
              onLeaveDirector={(idx) => {
                setHoveredIndex(null);
              }}
            />

            {/* Large Kinetic Text Morph */}
            <KineticText text={currentTitle} color={themeColor} />
          </div>
        </div>
      </div>

      <main className="max-w-container-max mx-auto px-margin-desktop pb-24 relative z-10">
        {/* Brand Manifesto Section */}
        <section className="mt-32 border-t border-black/10 pt-24 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-100px" }}
            className="max-w-4xl mx-auto"
          >
            <span className="font-mono text-[#e30613] text-5xl mb-6 block select-none">“</span>
            
            <motion.h2 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-100px" }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.03
                  }
                }
              }}
              className="font-display text-2xl md:text-4xl italic font-light text-text-primary leading-[1.4] mb-8 flex flex-wrap justify-center gap-x-2 gap-y-1.5"
            >
              {"True journalism anchors society to its values. At".split(" ").map((word, index) => (
                <motion.span
                  key={`w1-${index}`}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } }
                  }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}

              <motion.span
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
                }}
                className="text-[#e30613] not-italic font-extrabold relative inline-block pl-1 pr-1"
              >
                BIG TV
              </motion.span>

              {", we archive verified truth, ensuring the record of public service remains untarnished and fully transparent.".split(" ").map((word, index) => (
                <motion.span
                  key={`w2-${index}`}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } }
                  }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="font-mono text-[10px] tracking-widest text-[#e30613] uppercase font-bold flex items-center justify-center gap-2"
            >
              <Cpu className="w-4 h-4 text-[#e30613]" /> BIG TV NEWSNET INTEGRITY MANIFESTO
            </motion.p>
          </motion.div>
        </section>
      </main>

      {/* Showcase Carousel Section */}
      <section className="relative w-full bg-[#fafafa] py-24 overflow-hidden border-y border-neutral-100 flex flex-col items-center shadow-sm">
        <div className="w-full max-w-container-max mx-auto px-margin-desktop text-center mb-12 relative z-10">
          <h3 className="font-display text-2xl md:text-3xl font-extrabold text-neutral-800 uppercase tracking-tight">Meet Our Network Leaders</h3>
        </div>
        
        <div className="w-full h-[580px] relative z-10">
          <DiagonalCarousel
            items={[
              { src: ganeshImg, title: "Ganesh Yarakala", link: "#/ganesh-yarakala" },
              { src: aparnaImg, title: "Aparna Kurup", link: "#/aparna-kurup" },
              { src: aryaImg, title: "Arya Surendran", link: "#/arya-surendran" },
              { src: binilImg, title: "Binil Pothen Babu", link: "#/binil-pothen" }
            ]}
            defaultActiveIndex={0}
            slideSize={300}
            className="bg-transparent text-neutral-800"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-16 border-t border-slate-900 mt-12 relative z-10">
        <div className="max-w-container-max mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-12">
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 bg-[#e30613] rounded flex items-center justify-center text-white font-display font-black text-[10px]">B</span>
              <div className="font-display text-lg font-black tracking-widest text-[#e30613]">BIG TV NETWORK</div>
            </div>
            <p className="font-mono text-[9px] text-slate-500 tracking-wider">EDITORIAL PORTALS // NEWSROOM DIVISION CENTRAL</p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 font-mono text-[10px] uppercase tracking-wider text-slate-400">
            <span className="hover:text-white transition-colors cursor-pointer">Live Directory</span>
            <span className="hover:text-white transition-colors cursor-pointer">Vetting Codes</span>
            <span className="hover:text-white transition-colors cursor-pointer">Central Archive</span>
          </div>

          <div className="text-center md:text-right">
            <p className="font-mono text-[10px] text-slate-500 leading-relaxed">
              © {new Date().getFullYear()} BIG TV NEWSROOMS.<br/>
              ALL CORRESPONDENT Blueprints VETTED.
            </p>
          </div>

        </div>
      </footer>
    </div>
  )
}
