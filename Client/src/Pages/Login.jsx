import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { KeyRound, Mail, ArrowLeft, ShieldAlert, Clock, Terminal, Shield, Cpu, ShieldCheck } from 'lucide-react'

// WebGL Background Shader (Dark glowing Crimson Red Nebulous Shader)
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
        float noise1 = snoise(uv * 1.2 + u_time * 0.03); 
        float noise2 = snoise(uv * 2.5 - u_time * 0.02); 
        vec3 bg = vec3(0.02, 0.01, 0.02); 
        vec3 crimson = vec3(0.89, 0.024, 0.075); 
        vec3 darkRed = vec3(0.08, 0.0, 0.01); 
        float f = noise1 * 0.5 + noise2 * 0.5; 
        f = smoothstep(-0.2, 1.2, f);
        vec3 mixColor = mix(darkRed, crimson, f * 0.4);
        vec3 finalColor = mix(bg, mixColor, 0.3); 
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
      <canvas ref={canvasRef} className="w-full h-full block opacity-70" />
    </div>
  )
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [timeString, setTimeString] = useState('')
  const [inputFocused, setInputFocused] = useState('')

  // Auto-update digital clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTimeString(now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }))
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Auto redirect if already logged in
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      window.location.hash = '#/dashboard'
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials. Access key denied.')
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('currentUser', JSON.stringify(data.user))
      
      window.location.hash = '#/dashboard'
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col lg:flex-row font-body relative overflow-hidden selection:bg-[#e30613] selection:text-white antialiased">
      {/* Background shader */}
      <WebGLRedShader />

      {/* Decorative vertical background outline text */}
      <div className="absolute right-0 bottom-0 select-none pointer-events-none opacity-[0.02] text-[18vw] font-display font-black tracking-tighter leading-none translate-y-1/4 translate-x-10 z-0">
        TRUTH
      </div>

      {/* Left Column - Big Editorial Panel (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-7/12 flex-col justify-between p-16 border-r border-white/5 relative z-10 bg-gradient-to-b from-transparent to-black/30">
        
        {/* Left Top Header */}
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 bg-[#e30613] rounded flex items-center justify-center text-white font-display font-black text-sm">B</span>
          <div className="font-mono text-xs tracking-[0.3em] text-[#e30613] uppercase font-bold">
            BIG TV SYSTEM GATEWAY
          </div>
        </div>

        {/* Left Center Content - Bold Typography Title */}
        <div className="my-auto max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-mono text-xs text-[#e30613] uppercase tracking-[0.45em] mb-4 font-bold"
          >
            [ SECURE DATABASE LINK ]
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl xl:text-6xl font-extrabold tracking-tight leading-none mb-8"
          >
            The persistent pursuit of <span className="text-[#e30613] italic">Truth.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body text-xs text-slate-400 leading-relaxed font-light mb-12"
          >
            Accredited newsroom terminals facilitate real-time index updates, digital-satellite coordinate adjustments, and investigative dossier publishing directly to the regional catalog.
          </motion.p>

          {/* Terminal Coordinate details */}
          <div className="flex gap-12 font-mono text-[9px] text-slate-500 border-t border-white/5 pt-8">
            <div>
              <span className="text-slate-400 font-bold block uppercase mb-1">TERMINAL TIME</span>
              <span className="text-white font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#e30613]" /> {timeString || '00:00:00'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block uppercase mb-1">ENCRYPTION LEVEL</span>
              <span className="text-[#e30613] font-bold">AES-256 GCM</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block uppercase mb-1">SERVER STATUS</span>
              <span className="text-emerald-500 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> ONLINE
              </span>
            </div>
          </div>
        </div>

        {/* Left Bottom News Wire Ticker */}
        <div className="overflow-hidden border-t border-white/5 pt-6 flex items-center gap-4">
          <span className="font-mono text-[9px] bg-[#e30613]/10 text-[#e30613] px-2 py-0.5 rounded border border-[#e30613]/20 flex-shrink-0 uppercase font-bold tracking-widest">SYSTEM ALERT</span>
          <div className="w-full relative overflow-hidden h-4">
            <div className="animate-marquee whitespace-nowrap font-mono text-[10px] text-slate-500 uppercase tracking-wider absolute flex gap-8">
              <span>• PORTAL RE-ROUTING COMPLETED</span>
              <span>• VERIFIED CORRESPONDENTS ONLINE: 24</span>
              <span>• REGISTRY STATUS: SECURE CONNECTION ACTIVE</span>
              <span>• INTEGRATIVE BROADCAST INTERFACES STABLE</span>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column - Premium High-End Login Terminal */}
      <div className="w-full lg:w-5/12 flex flex-col justify-between p-8 sm:p-16 relative z-10 bg-slate-950/60 backdrop-blur-2xl">
        
        {/* Right Top Header Navigation */}
        <div className="flex justify-between items-center w-full">
          <a 
            href="#/" 
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase font-bold text-slate-400 hover:text-white transition-colors py-1.5 px-3 border border-white/5 bg-white/5 rounded-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
          </a>
          <div className="lg:hidden flex items-center gap-2">
            <span className="w-6 h-6 bg-[#e30613] rounded flex items-center justify-center text-white font-display font-black text-xs">B</span>
          </div>
        </div>

        {/* Right Center Login Card */}
        <div className="my-auto py-12">
          <div className="mb-8">
            <h2 className="font-display text-3xl font-extrabold text-white tracking-tight mb-2">
              Editorial Access Gateway
            </h2>
            <p className="font-mono text-[10px] text-slate-400 tracking-wider uppercase font-bold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#e30613]" /> Newsnet Credentials Required
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-950/20 border border-red-500/20 rounded-xl p-4 flex gap-3 text-red-400 text-xs font-mono items-center"
            >
              <ShieldAlert className="w-5 h-5 text-[#e30613] flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            
            {/* Email field */}
            <div className="relative">
              <label className="block font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-2.5">
                Correspondent Email
              </label>
              <div className={`relative rounded-xl border transition-all duration-300 ${
                inputFocused === 'email' ? 'border-[#e30613] bg-black/60 shadow-[0_0_15px_rgba(227,6,19,0.1)]' : 'border-white/10 bg-white/5'
              }`}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onFocus={() => setInputFocused('email')}
                  onBlur={() => setInputFocused('')}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-transparent border-none rounded-xl font-mono text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-0"
                  placeholder="ganesh@bigtv.com"
                />
                {/* Underline focus animation */}
                <span className={`absolute bottom-0 left-0 h-[1.5px] bg-[#e30613] transition-all duration-300 ${
                  inputFocused === 'email' ? 'w-full' : 'w-0'
                }`} />
              </div>
            </div>

            {/* Password field */}
            <div className="relative">
              <label className="block font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-2.5">
                Access Security Key
              </label>
              <div className={`relative rounded-xl border transition-all duration-300 ${
                inputFocused === 'password' ? 'border-[#e30613] bg-black/60 shadow-[0_0_15px_rgba(227,6,19,0.1)]' : 'border-white/10 bg-white/5'
              }`}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onFocus={() => setInputFocused('password')}
                  onBlur={() => setInputFocused('')}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-transparent border-none rounded-xl font-mono text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-0"
                  placeholder="••••••••"
                />
                <span className={`absolute bottom-0 left-0 h-[1.5px] bg-[#e30613] transition-all duration-300 ${
                  inputFocused === 'password' ? 'w-full' : 'w-0'
                }`} />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg text-white font-mono text-xs tracking-widest font-bold bg-[#e30613] hover:bg-[#b0050d] transition-all duration-300 disabled:opacity-50 cursor-pointer uppercase"
              >
                {loading ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin" /> AUTHENTICATING ACCESS...
                  </>
                ) : (
                  <>
                    <Terminal className="w-4 h-4" /> REQUEST PORTAL ENTRY
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Premium styled autofill credentials panel */}
          <div className="mt-8 border border-white/5 bg-white/[0.02] rounded-xl p-5 relative overflow-hidden">
            <span className="font-mono text-[9px] text-[#e30613] font-bold uppercase tracking-wider block mb-3 flex items-center gap-1">
              <Terminal className="w-3 h-3 text-[#e30613]" /> DEMO GATEWAY CREDENTIALS
            </span>
            
            <div className="space-y-3 font-mono text-[10px]">
              
              {/* Profile 1: Ganesh */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 rounded bg-white/[0.02] border border-white/5 gap-2">
                <div>
                  <span className="text-slate-400 block text-[8px] uppercase font-bold tracking-wider">Correspondent (Ganesh)</span>
                  <span className="text-white">ganesh@bigtv.com</span>
                </div>
                <button
                  onClick={() => {
                    setEmail('ganesh@bigtv.com')
                    setPassword('ganesh123')
                  }}
                  className="text-xs text-[#e30613] hover:text-[#b0050d] font-bold border border-[#e30613]/20 bg-[#e30613]/5 hover:bg-[#e30613]/10 px-2 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 self-end sm:self-auto"
                >
                  <Cpu className="w-3 h-3" /> AUTOFILL
                </button>
              </div>

              {/* Profile 2: Aparna */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 rounded bg-white/[0.02] border border-white/5 gap-2">
                <div>
                  <span className="text-slate-400 block text-[8px] uppercase font-bold tracking-wider">Correspondent (Aparna)</span>
                  <span className="text-white">aparna@bigtv.com</span>
                </div>
                <button
                  onClick={() => {
                    setEmail('aparna@bigtv.com')
                    setPassword('aparna123')
                  }}
                  className="text-xs text-[#e30613] hover:text-[#b0050d] font-bold border border-[#e30613]/20 bg-[#e30613]/5 hover:bg-[#e30613]/10 px-2 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 self-end sm:self-auto"
                >
                  <Cpu className="w-3 h-3" /> AUTOFILL
                </button>
              </div>

              {/* Profile 2.5: Arya */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 rounded bg-white/[0.02] border border-white/5 gap-2">
                <div>
                  <span className="text-slate-400 block text-[8px] uppercase font-bold tracking-wider">Correspondent (Arya)</span>
                  <span className="text-white">arya@bigtv.com</span>
                </div>
                <button
                  onClick={() => {
                    setEmail('arya@bigtv.com')
                    setPassword('arya123')
                  }}
                  className="text-xs text-[#e30613] hover:text-[#b0050d] font-bold border border-[#e30613]/20 bg-[#e30613]/5 hover:bg-[#e30613]/10 px-2 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 self-end sm:self-auto"
                >
                  <Cpu className="w-3 h-3" /> AUTOFILL
                </button>
              </div>

              {/* Profile 3: Admin */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 rounded bg-white/[0.02] border border-white/5 gap-2">
                <div>
                  <span className="text-slate-400 block text-[8px] uppercase font-bold tracking-wider">Bureau Chief (Admin)</span>
                  <span className="text-white">admin@bigtv.com</span>
                </div>
                <button
                  onClick={() => {
                    setEmail('admin@bigtv.com')
                    setPassword('admin123')
                  }}
                  className="text-xs text-[#e30613] hover:text-[#b0050d] font-bold border border-[#e30613]/20 bg-[#e30613]/5 hover:bg-[#e30613]/10 px-2 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 self-end sm:self-auto"
                >
                  <Cpu className="w-3 h-3" /> AUTOFILL
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Right Bottom Link */}
        <div className="border-t border-white/5 pt-6 text-center text-xs font-mono text-slate-400">
          <span>New correspondent? </span>
          <a href="#/register" className="text-[#e30613] hover:text-[#b0050d] transition-colors font-bold uppercase tracking-wider">
            Register Credentials
          </a>
        </div>

      </div>
    </div>
  )
}
