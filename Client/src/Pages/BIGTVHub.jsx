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
import GravityText from '../Components/GravityText.jsx'
import sujayaImg from '../assets/SujayaParvathy.png'
import aparnaImg from '../assets/AparnaKurup.png'
import aryaImg from '../assets/AryaSurendran.png'
import binilImg from '../assets/BinilPothan.webp'
import logoImg from '../assets/BIGTV-MALAYALAM.jpg'

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
    <div className="relative w-full overflow-hidden flex justify-center items-center h-[10vw] min-h-[70px] md:min-h-[100px]">
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
              className="relative overflow-hidden flex items-center justify-center font-serif-display italic text-[5vw] sm:text-[4.5vw] md:text-[4vw] font-extrabold leading-none px-[0.12em]"
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
    <>
      {/* Mobile Design: Small Rounded Image Cards (< md) */}
      <div className="flex flex-wrap justify-center gap-4 my-4 px-4 z-20 md:hidden w-full max-w-lg mx-auto">
        {items.map((item, index) => {
          const isActive = activeIndex === index;
          const isLocked = item.status !== 'LIVE RECORD';
          const isUnpaid = item.isPaid === false;
          
          return (
            <div
              key={item.id}
              onMouseEnter={() => onHoverDirector(index)}
              onMouseLeave={() => onLeaveDirector(index)}
              onClick={() => {
                if (isUnpaid) {
                  window.location.hash = `#/pending-payment?name=${encodeURIComponent(item.name)}&role=${encodeURIComponent(item.role)}`;
                  return;
                }
                if (!isLocked && item.link) {
                  if (item.link.startsWith('http')) {
                    window.location.href = item.link;
                  } else {
                    window.location.hash = item.link;
                  }
                }
              }}
              className="flex flex-col items-center cursor-pointer relative"
            >
              <div
                className={`w-[105px] h-[140px] sm:w-[130px] h-[173px] rounded-2xl overflow-hidden transition-all duration-300 relative border-2 ${
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
                    className={`w-full h-full object-cover object-center scale-[1.08] transition-all duration-500 ${
                      isUnpaid ? 'blur-md opacity-40 grayscale' : (isLocked ? 'grayscale opacity-30' : isActive ? 'grayscale-0' : 'grayscale')
                    }`}
                  />
                ) : (
                  <div
                    className={`w-full h-full flex flex-col justify-center items-center font-display font-black text-xl transition-all duration-500 bg-neutral-900 ${
                      isLocked ? 'text-neutral-700' : 'text-white'
                    }`}
                  >
                    {isLocked ? (
                      <Lock className="w-4 h-4 text-neutral-700" />
                    ) : (
                      item.name.split(' ').map(n => n[0]).join('')
                    )}
                  </div>
                )}
                
                {isUnpaid && (
                  <div className="absolute inset-0 flex flex-col items-center justify-between p-3 bg-black/50 backdrop-blur-[1px] z-10 text-center">
                    <span className="font-mono text-[7px] font-black text-red-500 bg-red-950/90 px-1 py-0.5 rounded border border-red-500/20 uppercase tracking-widest leading-none mt-1">
                      Amount Pending
                    </span>
                    <img 
                      src="https://www.socialbureau.in/assets/logo.webp" 
                      alt="Social Bureau" 
                      className="h-4.5 w-auto opacity-35 -rotate-12 select-none pointer-events-none"
                    />
                    <div className="w-1 h-1" />
                  </div>
                )}

                {/* Status Dot */}
                <div className={`absolute top-1 right-1 w-2 h-2 rounded-full border border-neutral-950 ${
                  isLocked ? 'bg-amber-500' : isUnpaid ? 'bg-red-500' : 'bg-emerald-500'
                }`} />
              </div>

              {/* Glowing active indicator dot below */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeAvatarDotMobile"
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

      {/* Desktop Design: Tall Full Portrait Cards (>= md) */}
      <div className="hidden md:flex justify-center items-end gap-3 md:gap-4 px-4 z-20 w-full max-w-5xl mx-auto h-full">
        {items.map((item, index) => {
          const isActive = activeIndex === index;
          const isLocked = item.status !== 'LIVE RECORD';
          const isUnpaid = item.isPaid === false;

          return (
            <div
              key={item.id}
              onMouseEnter={() => onHoverDirector(index)}
              onMouseLeave={() => onLeaveDirector(index)}
              onClick={() => {
                if (isUnpaid) {
                  window.location.hash = `#/pending-payment?name=${encodeURIComponent(item.name)}&role=${encodeURIComponent(item.role)}`;
                  return;
                }
                if (!isLocked && item.link) {
                  if (item.link.startsWith('http')) {
                    window.location.href = item.link;
                  } else {
                    window.location.hash = item.link;
                  }
                }
              }}
              className="relative flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl transition-all duration-500"
              style={{
                width: isActive ? '320px' : '80px',
                height: isActive ? '100%' : '75%',
                border: `2px solid ${isActive ? item.primaryColor : 'rgba(255,255,255,0.08)'}`,
                boxShadow: isActive ? `0 0 40px ${item.primaryColor}55, 0 20px 60px rgba(0,0,0,0.5)` : '0 4px 20px rgba(0,0,0,0.3)',
                alignSelf: 'flex-end',
              }}
            >
              {/* Full portrait image */}
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className={`w-full h-full object-cover object-top transition-all duration-700 ${
                    isUnpaid ? 'blur-md opacity-35 grayscale' : (isLocked ? 'grayscale opacity-30' : isActive ? 'grayscale-0 scale-100' : 'grayscale opacity-50 scale-105')
                  }`}
                />
              ) : (
                <div
                  className="w-full h-full flex flex-col justify-center items-center font-display font-black text-3xl bg-neutral-900 text-white"
                  style={{ background: `linear-gradient(135deg, ${item.primaryColor}22, #111)` }}
                >
                  {isLocked ? (
                    <Lock className="w-6 h-6 text-neutral-600" />
                  ) : (
                    item.name.split(' ').map(n => n[0]).join('')
                  )}
                </div>
              )}

              {isUnpaid && (
                <div className="absolute inset-0 flex flex-col items-center justify-between p-6 bg-black/60 backdrop-blur-[1px] z-10 text-center">
                  <span className="font-mono text-[8px] sm:text-[9px] font-black text-red-500 bg-red-950/90 px-2 py-1 rounded border border-red-500/30 uppercase tracking-widest leading-none mt-2">
                    Amount Pending
                  </span>
                  <img 
                    src="https://www.socialbureau.in/assets/logo.webp" 
                    alt="Social Bureau" 
                    className="h-7 w-auto opacity-30 -rotate-12 select-none pointer-events-none border border-white/5 px-2.5 py-1.5 rounded bg-white/[0.01]"
                  />
                  <div className="w-2 h-2" />
                </div>
              )}

              {/* Gradient overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: isActive
                    ? `linear-gradient(to top, ${item.primaryColor}cc 0%, transparent 55%)`
                    : 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                }}
              />

              {/* Status dot */}
              <div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full border border-black/40 ${
                isLocked ? 'bg-amber-500' : isUnpaid ? 'bg-red-500' : 'bg-emerald-400'
              }`} />

              {/* Active: name + role label at bottom */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] mb-1" style={{ color: `${item.primaryColor}cc` }}>
                    {item.role}
                  </p>
                  <p className="font-display font-black text-white text-lg leading-tight">
                    {item.name}
                  </p>
                </div>
              )}

              {/* Inactive: vertical name label */}
              {!isActive && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <span
                    className="font-mono text-[7px] sm:text-[8px] uppercase tracking-widest text-white/60 writing-mode-vertical"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '0.2em' }}
                  >
                    {item.shortName || item.name.split(' ')[0]}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
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

const malayalamLetters = [
  { char: "അ", top: "15%", left: "8%", size: "1.2rem", rotate: 12, floatY: -8, duration: 6, delay: 0.2, opacity: 0.22 },
  { char: "ആ", top: "22%", left: "18%", size: "0.9rem", rotate: -8, floatY: -6, duration: 5, delay: 0.5, opacity: 0.25 },
  { char: "ഇ", top: "45%", left: "5%", size: "1.4rem", rotate: 15, floatY: -10, duration: 7, delay: 0.1, opacity: 0.18 },
  { char: "ഉ", top: "72%", left: "10%", size: "1.1rem", rotate: -12, floatY: -8, duration: 8, delay: 0.7, opacity: 0.22 },
  { char: "ക", top: "25%", left: "85%", size: "1.6rem", rotate: -15, floatY: -12, duration: 9, delay: 0.4, opacity: 0.20 },
  { char: "ഖ", top: "12%", left: "76%", size: "0.8rem", rotate: 20, floatY: -5, duration: 5.5, delay: 0.9, opacity: 0.28 },
  { char: "ഗ", top: "40%", left: "82%", size: "1.3rem", rotate: -10, floatY: -9, duration: 7.2, delay: 0.3, opacity: 0.22 },
  { char: "ഘ", top: "60%", left: "88%", size: "1.5rem", rotate: 8, floatY: -11, duration: 8.5, delay: 0.6, opacity: 0.18 },
  { char: "ങ", top: "82%", left: "80%", size: "1.1rem", rotate: -18, floatY: -7, duration: 6.8, delay: 0.2, opacity: 0.25 },
  { char: "ച", top: "70%", left: "28%", size: "1.4rem", rotate: 25, floatY: -12, duration: 7.8, delay: 0.8, opacity: 0.20 },
  { char: "ഛ", top: "85%", left: "20%", size: "0.9rem", rotate: -5, floatY: -5, duration: 5.2, delay: 0.15, opacity: 0.26 },
  { char: "ജ", top: "18%", left: "32%", size: "1.2rem", rotate: 14, floatY: -7, duration: 6.4, delay: 0.45, opacity: 0.21 },
  { char: "ഝ", top: "8%", left: "42%", size: "1.5rem", rotate: -16, floatY: -10, duration: 8.2, delay: 0.75, opacity: 0.18 },
  { char: "ഞ", top: "78%", left: "45%", size: "1.3rem", rotate: 15, floatY: -9, duration: 7.4, delay: 0.35, opacity: 0.23 },
  { char: "ത", top: "52%", left: "55%", size: "1.0rem", rotate: -8, floatY: -6, duration: 6.2, delay: 0.95, opacity: 0.25 },
  { char: "ധ", top: "30%", left: "64%", size: "1.7rem", rotate: 10, floatY: -12, duration: 8.8, delay: 0.55, opacity: 0.19 },
  { char: "ന", top: "10%", left: "92%", size: "0.9rem", rotate: 22, floatY: -5, duration: 5.8, delay: 0.85, opacity: 0.28 },
  { char: "പ", top: "62%", left: "70%", size: "1.4rem", rotate: -12, floatY: -9, duration: 7.6, delay: 0.65, opacity: 0.22 },
  { char: "ഭ", top: "35%", left: "48%", size: "1.1rem", rotate: 5, floatY: -7, duration: 6.0, delay: 0.12, opacity: 0.24 },
  { char: "മ", top: "5%", left: "22%", size: "1.5rem", rotate: -18, floatY: -11, duration: 8.0, delay: 0.38, opacity: 0.19 },
  { char: "യ", top: "58%", left: "15%", size: "1.0rem", rotate: 10, floatY: -6, duration: 6.6, delay: 0.48, opacity: 0.23 },
  { char: "ര", top: "48%", left: "25%", size: "1.3rem", rotate: -15, floatY: -8, duration: 7.0, delay: 0.58, opacity: 0.21 },
  { char: "ല", top: "90%", left: "35%", size: "1.2rem", rotate: 8, floatY: -9, duration: 7.5, delay: 0.28, opacity: 0.22 },
  { char: "വ", top: "5%", left: "58%", size: "0.9rem", rotate: -10, floatY: -5, duration: 5.4, delay: 0.68, opacity: 0.27 },
  { char: "ശ", top: "25%", left: "70%", size: "1.4rem", rotate: 12, floatY: -10, duration: 8.4, delay: 0.78, opacity: 0.20 },
  { char: "ഷ", top: "92%", left: "58%", size: "1.1rem", rotate: -20, floatY: -8, duration: 6.9, delay: 0.88, opacity: 0.24 },
  { char: "സ", top: "75%", left: "68%", size: "1.3rem", rotate: 15, floatY: -9, duration: 7.1, delay: 0.08, opacity: 0.22 },
  { char: "ഹ", top: "48%", left: "95%", size: "1.0rem", rotate: -12, floatY: -7, duration: 6.3, delay: 0.18, opacity: 0.25 },
  { char: "ള", top: "35%", left: "98%", size: "1.5rem", rotate: 18, floatY: -11, duration: 8.1, delay: 0.22, opacity: 0.19 },
  { char: "ഴ", top: "68%", left: "96%", size: "1.2rem", rotate: -8, floatY: -9, duration: 7.7, delay: 0.32, opacity: 0.21 }
];

export default function BIGTVHub() {
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [showHeader, setShowHeader] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
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

  const customCorres = registeredCorres.filter(u => u.email.toLowerCase() !== 'sujaya@bigtv.com' && u.email.toLowerCase() !== 'ganesh@bigtv.com' && u.email.toLowerCase() !== 'aparna@bigtv.com' && u.email.toLowerCase() !== 'arya@bigtv.com' && u.email.toLowerCase() !== 'binil@bigtv.com' && u.email.toLowerCase() !== 'admin@bigtv.com')

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
  const sujayaDbData = registeredCorres.find(u => u.email.toLowerCase() === 'sujaya@bigtv.com')
  const sujayaName = sujayaDbData ? sujayaDbData.name : 'Sujaya Parvathy'
  const sujayaDivision = sujayaDbData ? sujayaDbData.division : 'Chief Editor'
  const sujayaBio = sujayaDbData ? sujayaDbData.bio : 'Chief Editor at BIG TV Malayalam. Renowned Malayalam prime-time news anchor with over 18 years of editorial excellence.'
  const sujayaStatus = sujayaDbData ? sujayaDbData.status : 'LIVE RECORD'

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

  const binilDbData = registeredCorres.find(u => u.email.toLowerCase() === 'binil@bigtv.com')
  const binilName = binilDbData ? binilDbData.name : 'Binil Pothen Babu'
  const binilDivision = binilDbData ? binilDbData.division : 'Senior News Editor & Anchor'
  const binilBio = binilDbData ? binilDbData.bio : 'Senior News Editor and Anchor at BIG TV Malayalam, serving as Desk Chief. Bridges newsroom strategy, on-screen presentation, and ground-zero bureaus.'
  const binilStatus = binilDbData ? binilDbData.status : 'LIVE RECORD'

  const sujayaIsPaid = sujayaDbData ? (sujayaDbData.isPaid ?? false) : false
  const aparnaIsPaid = aparnaDbData ? (aparnaDbData.isPaid ?? false) : false
  const aryaIsPaid = aryaDbData ? (aryaDbData.isPaid ?? false) : false
  const binilIsPaid = binilDbData ? (binilDbData.isPaid ?? false) : false

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
      id: 'sujaya',
      name: sujayaName,
      shortName: 'Sujaya',
      role: sujayaDivision,
      nationality: 'INDIA',
      primaryColor: '#a21b6d',
      image: sujayaImg,
      status: sujayaStatus,
      isPaid: sujayaIsPaid,
      aesthetic: 'Prime-Time Broadcast News & Digital Outreach',
      bio: sujayaBio,
      quote: 'Connecting viewers to real-time events with accuracy, speed, and media integrity.',
      keyWorks: [
        { title: 'Editor & Prime-Time Anchor', genre: 'Broadcast News', year: 'Present' },
        { title: 'National & Regional Coverage Chief', genre: 'Field Reporting', year: '2018 — 2024' },
        { title: 'Visual Desk Re-architect', genre: 'Synergy Strategy', year: '2012 — 2018' }
      ],
      link: 'https://www.sujayaparvathy.com/'
    },
    {
      id: 'aparna',
      name: aparnaName,
      shortName: 'Aparna',
      role: aparnaDivision,
      nationality: 'INDIA',
      primaryColor: '#10b981',
      image: aparnaImg,
      status: aparnaStatus,
      isPaid: aparnaIsPaid,
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
      shortName: 'Arya',
      role: aryaDivision,
      nationality: 'INDIA',
      primaryColor: '#f59e0b',
      image: aryaImg,
      status: aryaStatus,
      isPaid: aryaIsPaid,
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
      name: binilName,
      shortName: 'Binil',
      role: binilDivision,
      nationality: 'INDIA',
      primaryColor: '#2563eb',
      image: binilImg,
      status: binilStatus,
      isPaid: binilIsPaid,
      aesthetic: 'Visual Media Strategy & Desk Chief',
      bio: binilBio,
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
      isPaid: corres.isPaid ?? false,
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
  const currentTitle = activeCorres ? activeCorres.name : "Newsroom";
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

  

  return (
    <div className="min-h-screen bg-white text-[#10141a] relative font-body selection:bg-[#e30613] selection:text-white antialiased">
      {/* WebGL Red Gradient Shader */}
      <WebGLRedShader />

      

      {/* Header */}
      <header 
        className={`fixed left-0 w-full z-50 transition-transform duration-300 bg-white/70 backdrop-blur-xl border-b border-black/5 py-4 ${
          showHeader ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{ top: 0 }}
      >
        <nav className="flex justify-between items-center max-w-container-max mx-auto px-6 md:px-margin-desktop h-12 w-full relative">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <a href="#/">
              <img src={logoImg} alt="BIG TV Malayalam" className="h-10 w-auto object-contain rounded cursor-pointer" />
            </a>
          </div>

          {/* Section Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8 font-mono text-[11px] uppercase tracking-wider text-neutral-600">
            <a href="#spotlight" className="hover:text-[#e30613] transition-colors">Spotlight</a>
            <a href="#gravity-reveal-banner" className="hover:text-[#e30613] transition-colors">Ethos</a>
            <a href="#manifesto" className="hover:text-[#e30613] transition-colors">Manifesto</a>
            <a href="#network-leaders" className="hover:text-[#e30613] transition-colors">Leaders</a>
          </div>

          {/* Right Controls Panel */}
          <div className="flex items-center gap-4 text-neutral-500">
            {/* Social Icons (Desktop only) */}
            <div className="hidden md:flex items-center gap-3">
              {/* Facebook */}
              <motion.a 
                href="https://www.facebook.com/Bigtv24x7live?rdid=i9voqS5fC29VNdxy&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1G91Vg9RGi%2F#" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 flex items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 hover:bg-[#1877f2]/10 hover:border-[#1877f2]/40 hover:text-[#1877f2] hover:shadow-[0_0_15px_rgba(24,119,242,0.3)] transition-all duration-300 cursor-pointer" 
                title="Facebook"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                whileHover={{ scale: 1.1 }}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </motion.a>

              {/* Twitter */}
              <motion.a 
                href="https://x.com/bigtv24x7live?s=11" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 flex items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 hover:bg-neutral-900/10 hover:border-neutral-900/40 hover:text-black hover:shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-all duration-300 cursor-pointer" 
                title="Twitter/X"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, delay: 0.15, ease: "easeInOut" }}
                whileHover={{ scale: 1.1 }}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </motion.a>

              {/* Instagram */}
              <motion.a 
                href="https://www.instagram.com/bigtv24x7live?igsh=MWkydms5MWdraHlzNw%3D%3D" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 flex items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 hover:bg-[#c13584]/10 hover:border-[#c13584]/40 hover:text-[#c13584] hover:shadow-[0_0_15px_rgba(193,53,132,0.3)] transition-all duration-300 cursor-pointer" 
                title="Instagram"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2.4, delay: 0.3, ease: "easeInOut" }}
                whileHover={{ scale: 1.1 }}
              >
                <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </motion.a>

              {/* YouTube */}
              <motion.a 
                href="https://www.youtube.com/@bigtv24x7live" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 flex items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 hover:bg-[#ff0000]/10 hover:border-[#ff0000]/40 hover:text-[#ff0000] hover:shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all duration-300 cursor-pointer" 
                title="YouTube"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2.1, delay: 0.05, ease: "easeInOut" }}
                whileHover={{ scale: 1.1 }}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555A3.003 3.003 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </motion.a>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-600 hover:text-black focus:outline-none transition-all duration-300 rounded-full hover:bg-neutral-100/50"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu Dropdown overlay */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl border-b border-black/5 shadow-xl overflow-hidden z-55"
              >
                <div className="flex flex-col py-6 px-8 gap-5 font-mono text-[11px] uppercase tracking-wider text-neutral-600">
                  <a
                    href="#spotlight"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#e30613] pb-2 border-b border-neutral-100 transition-colors"
                  >
                    Spotlight
                  </a>
                  <a
                    href="#gravity-reveal-banner"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#e30613] pb-2 border-b border-neutral-100 transition-colors"
                  >
                    Ethos
                  </a>
                  <a
                    href="#manifesto"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#e30613] pb-2 border-b border-neutral-100 transition-colors"
                  >
                    Manifesto
                  </a>
                  <a
                    href="#network-leaders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#e30613] transition-colors"
                  >
                    Leaders
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Interactive Journalist Spotlight Showcase */}
      <div
        id="spotlight"
        ref={sectionRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHoveredOverSection(true)}
        onMouseLeave={() => {
          setIsHoveredOverSection(false);
        }}
        className="relative w-full h-screen bg-[#070707] text-white overflow-hidden border-y border-neutral-900 shadow-2xl select-none font-sans flex flex-col"
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

        {/* Scattered Malayalam Alphabets — organic continuous float */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
          {malayalamLetters.map((item, idx) => (
            <motion.div
              key={idx}
              className="absolute select-none font-serif font-light"
              style={{
                top: item.top,
                left: item.left,
                fontSize: item.size,
                filter: "blur(0.4px)",
                color: activeCorres ? activeCorres.primaryColor : '#e30613',
                opacity: activeCorres && activeCorres.id === 'sujaya' ? Math.min(item.opacity * 2.8, 0.75) : item.opacity
              }}
              animate={{
                y: [0, item.floatY * 1.2, item.floatY * 0.4, item.floatY * 1.4, 0],
                x: [0, (idx % 2 === 0 ? 1 : -1) * (3 + (idx % 5)), 0, (idx % 2 === 0 ? -1 : 1) * (2 + (idx % 4)), 0],
                rotate: [item.rotate, item.rotate + 8, item.rotate - 4, item.rotate + 10, item.rotate - 6, item.rotate],
                scale: [1, 1.06, 0.97, 1.04, 1],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: item.duration * 1.3,
                delay: item.delay,
                ease: "easeInOut",
              }}
            >
              {item.char}
            </motion.div>
          ))}
        </div>

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

        {/* Content Wrapper — fills full viewport height after navbar */}
        <div className="w-full max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-desktop relative z-10 flex flex-col items-center justify-center h-full pt-20 pb-4">

          {/* Top label */}
          <div className="text-center pt-2 pb-1 flex-shrink-0">
            <motion.div
              key={currentTitle}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] md:text-xs font-mono tracking-[0.3em] uppercase flex items-center justify-center gap-2 transition-colors duration-1000"
              style={{ color: themeColor }}
            >
              <Compass className="w-3.5 h-3.5 animate-spin" style={{ color: themeColor, animationDuration: "12s" }} />
              {activeCorres ? `${activeCorres.role} • ${activeCorres.nationality}` : "SELECT PORTRAITS OR TAP TO NAVIGATE THEIR VISIONARY NEWSROOMS"}
            </motion.div>
          </div>

          {/* Portrait/Mobile Cards — take custom space */}
          <div className="flex-initial md:flex-grow min-h-0 w-full flex items-center justify-center py-4 md:py-2">
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
          </div>

          {/* Kinetic Text — compact at bottom */}
          <div className="flex-shrink-0 w-full mt-2 md:mt-0">
            <KineticText text={currentTitle} color={themeColor} />
          </div>
        </div>
      </div>

      {/* ── GravityText Reveal Banner ─────────────────────────────────────── */}
      <section
        id="gravity-reveal-banner"
        className="relative w-full bg-[#F7F7F6] border-b border-neutral-200 overflow-hidden"
      >
        {/* Subtle grid texture for design continuity */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none">
          <div className="w-full h-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        {/* Decorative top accent line matching hero */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#e30613]/0 via-[#e30613]/30 to-[#e30613]/0 pointer-events-none" />

        <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-desktop py-16 md:py-24 relative z-10">
          {/* Section Label */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#e30613]/20" />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#e30613] font-bold px-3 py-1 border border-[#e30613]/20 rounded-full bg-[#e30613]/5">
             BigTV Malayalam
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#e30613]/20" />
          </div>

          {/* GravityText Canvas */}
          <div
            className="w-full bg-white rounded-2xl border border-neutral-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.04)] p-4 sm:p-6 md:p-12 relative"
            id="gravity-reveal-card"
          >
            <GravityText
              text="TRUTH IS THE COMPASS THAT ANCHORS EVERY BROADCAST. AT BIG TV, WE CHASE THE STORY, GUARD THE RECORD, AND LET THE TRUTH LEAD."
              blockColor="bg-[#e30613]"
              textColor="text-slate-950 font-black tracking-tighter"
              labelColor="text-red-100/40"
              config={{
                gravity: 3.5,
                wind: 0,
                friction: 0.1,
                restitution: 0.3,
                triggerAllOnScroll: true
              }}
              interactive={true}
            />
          </div>
         
        </div>
      </section>

      <main className="max-w-container-max mx-auto px-6 md:px-margin-desktop pb-24 relative z-10">
        {/* Brand Manifesto Section */}
        <section id="manifesto" className="mt-20 border-t border-black/10 pt-12 text-center">
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
              className="font-display text-lg sm:text-2xl md:text-4xl italic font-light text-text-primary leading-[1.4] mb-8 flex flex-wrap justify-center gap-x-2 gap-y-1.5"
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
              className="font-mono text-xs tracking-[0.25em] text-[#e30613] uppercase font-black flex items-center justify-center gap-2 mb-4"
            >
            
            </motion.p>
          </motion.div>
        </section>
      </main>

      {/* Showcase Carousel Section */}
      <section id="network-leaders" className="relative w-full py-12 md:py-24 overflow-hidden flex flex-col items-center" style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #1a1a2e 40%, #16213e 70%, #0f3460 100%)' }}>

        {/* Colorful ambient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] rounded-full opacity-20 blur-[100px]" style={{ background: 'radial-gradient(circle, #a21b6d, transparent)' }} />
          <div className="absolute top-[20%] right-[5%] w-[400px] h-[400px] rounded-full opacity-20 blur-[90px]" style={{ background: 'radial-gradient(circle, #10b981, transparent)' }} />
          <div className="absolute bottom-[0%] left-[30%] w-[450px] h-[450px] rounded-full opacity-15 blur-[100px]" style={{ background: 'radial-gradient(circle, #2563eb, transparent)' }} />
          <div className="absolute bottom-[10%] right-[25%] w-[350px] h-[350px] rounded-full opacity-15 blur-[80px]" style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
        </div>

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '4rem 4rem' }} />

        <div className="w-full max-w-container-max mx-auto px-margin-desktop text-center mb-6 md:mb-16 relative z-10">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 font-semibold">BIG TV Malayalam</span>
          <h2 className="font-serif-display italic text-5xl md:text-7xl font-medium text-white relative after:content-[''] after:block after:w-20 after:h-[3px] after:bg-[#e30613] after:mx-auto after:mt-6 mb-4 mt-3">
            Meet Our Network Leaders
          </h2>
        </div>
        
        <div className="w-full h-[380px] sm:h-[460px] md:h-[600px] relative z-10">
          <DiagonalCarousel
            items={[
              { src: sujayaImg, title: "Sujaya Parvathy", link: "https://www.sujayaparvathy.com/", accentColor: "#a21b6d", isPaid: sujayaIsPaid, role: "Chief Editor" },
              { src: aparnaImg, title: "Aparna Kurup", link: "#/aparna-kurup", accentColor: "#10b981", isPaid: aparnaIsPaid, role: "Senior Coordinating Editor & Anchor" },
              { src: aryaImg, title: "Arya Surendran", link: "#/arya-surendran", accentColor: "#f59e0b", isPaid: aryaIsPaid, role: "Associate News Editor & Anchor" },
              { src: binilImg, title: "Binil Pothen Babu", link: "#/binil-pothen", accentColor: "#2563eb", isPaid: binilIsPaid, role: "Senior News Editor & Anchor" }
            ]}
            defaultActiveIndex={0}
            slideSize={300}
            className="bg-transparent text-white"
            labelClassName="text-white"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white border-t border-slate-900 mt-12 relative z-10">

        {/* Main 3-column grid */}
        <div className="max-w-container-max mx-auto px-margin-desktop py-14 grid grid-cols-1 md:grid-cols-3 gap-12 items-start">

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-4">
            <img src={logoImg} alt="BIG TV Malayalam" className="h-10 w-auto object-contain rounded bg-white p-0.5 self-start" />
            <p className="font-mono text-[10px] text-slate-500 leading-relaxed uppercase tracking-widest max-w-[200px]">
              Kerala's Trusted<br/>24×7 Malayalam News Network
            </p>
          </div>

          {/* Col 2 — Navigation */}
          <div className="flex flex-col items-center gap-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-slate-600 font-semibold">Navigate</p>
            <nav className="flex flex-col items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-slate-400">
              <a href="#spotlight" className="hover:text-white transition-colors">Spotlight</a>
              <a href="#gravity-reveal-banner" className="hover:text-white transition-colors">Ethos</a>
              <a href="#manifesto" className="hover:text-white transition-colors">Manifesto</a>
              <a href="#network-leaders" className="hover:text-white transition-colors">Leaders</a>
            </nav>
          </div>

          {/* Col 3 — Social + Copyright */}
          <div className="flex flex-col items-start md:items-end gap-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-slate-600 font-semibold">Follow Us</p>
            <div className="flex items-center gap-3 text-slate-400">
              <motion.a href="https://www.facebook.com/Bigtv24x7live?rdid=i9voqS5fC29VNdxy&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1G91Vg9RGi%2F#" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full border border-white/5 bg-white/[0.02] hover:bg-[#1877f2]/10 hover:border-[#1877f2]/40 hover:text-[#1877f2] transition-all duration-300 cursor-pointer" title="Facebook" whileHover={{ scale: 1.1 }}>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </motion.a>
              <motion.a href="https://x.com/bigtv24x7live?s=11" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full border border-white/5 bg-white/[0.02] hover:bg-white/10 hover:border-white/40 hover:text-white transition-all duration-300 cursor-pointer" title="Twitter/X" whileHover={{ scale: 1.1 }}>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </motion.a>
              <motion.a href="https://www.instagram.com/bigtv24x7live?igsh=MWkydms5MWdraHlzNw%3D%3D" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full border border-white/5 bg-white/[0.02] hover:bg-[#c13584]/10 hover:border-[#c13584]/40 hover:text-[#c13584] transition-all duration-300 cursor-pointer" title="Instagram" whileHover={{ scale: 1.1 }}>
                <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </motion.a>
              <motion.a href="https://www.youtube.com/@bigtv24x7live" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full border border-white/5 bg-white/[0.02] hover:bg-[#ff0000]/10 hover:border-[#ff0000]/40 hover:text-[#ff0000] transition-all duration-300 cursor-pointer" title="YouTube" whileHover={{ scale: 1.1 }}>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555A3.003 3.003 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </motion.a>
            </div>
            <p className="font-mono text-[10px] text-slate-500 leading-relaxed text-left md:text-right">
              © {new Date().getFullYear()} BIG TV NEWSROOMS.<br/>
              All Correspondent Blueprints Vetted.
            </p>
          </div>
        </div>

        {/* Bottom strip — Powered by + rights */}
        <div className="border-t border-slate-800">
          <div className="max-w-container-max mx-auto px-margin-desktop py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-slate-600">
              © {new Date().getFullYear()} BIG TV Malayalam. All rights reserved.
            </span>
            <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold">
              <span>Powered by</span>
              <a href="https://www.socialbureau.in/enquiry-form" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity">
                <img src="https://www.socialbureau.in/assets/logo.webp" alt="SocialBureau" className="h-6 w-auto" />
              </a>
            </div>
          </div>
        </div>

      </footer>
    </div>
  )
}
