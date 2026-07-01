import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  LogOut, 
  FileText, 
  ShieldCheck, 
  Cpu, 
  ArrowLeft,
  Compass,
  Radio,
  FileCheck,
  Plus,
  Trash2,
  Calendar,
  Award,
  BookOpen
} from 'lucide-react'

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
      <canvas ref={canvasRef} className="w-full h-full block opacity-40" />
    </div>
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

export default function Dashboard() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    division: 'Political Bureau',
    bio: '',
    status: 'PENDING VERIFICATION'
  })

  const [activeTab, setActiveTab] = useState('profile') // 'profile' | 'hero' | 'timeline' | 'highlights' | 'awards' | 'blogs' | 'events'

  const [editName, setEditName] = useState('')
  const [editDivision, setEditDivision] = useState('Political Bureau')
  const [editBio, setEditBio] = useState('')
  const [editStatus, setEditStatus] = useState('PENDING VERIFICATION')

  // Portfolio details states
  const [editHeroTitle, setEditHeroTitle] = useState('')
  const [editHeroSubtitle, setEditHeroSubtitle] = useState('')
  const [editPillars, setEditPillars] = useState([
    { title: '', desc: '' },
    { title: '', desc: '' },
    { title: '', desc: '' }
  ])
  const [editTimeline, setEditTimeline] = useState([
    { period: '', title: '', desc: '', tags: [] },
    { period: '', title: '', desc: '', tags: [] },
    { period: '', title: '', desc: '', tags: [] }
  ])
  const [editHighlights, setEditHighlights] = useState([
    { period: '', station: '', title: '', desc: '' },
    { period: '', station: '', title: '', desc: '' },
    { period: '', station: '', title: '', desc: '' }
  ])
  const [editAwards, setEditAwards] = useState([
    { title: '', category: '', desc: '' },
    { title: '', category: '', desc: '' },
    { title: '', category: '', desc: '' }
  ])
  const [editBlogs, setEditBlogs] = useState([])
  const [editEvents, setEditEvents] = useState([])
  const [editYoutubeLink, setEditYoutubeLink] = useState('')
  const [youtubeLinks, setYoutubeLinks] = useState([''])

  // Temporary helper states for creating a new Blog/Event
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogDate, setNewBlogDate] = useState('')
  const [newBlogExcerpt, setNewBlogExcerpt] = useState('')
  const [newBlogContent, setNewBlogContent] = useState('')
  const [newBlogImage, setNewBlogImage] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [editingBlogIndex, setEditingBlogIndex] = useState(null)

  const [newEventTitle, setNewEventTitle] = useState('')
  const [newEventDate, setNewEventDate] = useState('')
  const [newEventLocation, setNewEventLocation] = useState('')
  const [newEventDesc, setNewEventDesc] = useState('')
  const [editingEventIndex, setEditingEventIndex] = useState(null)

  const [notification, setNotification] = useState('')
  const [lastSaved, setLastSaved] = useState('')

  const ensureLength3 = (arr, defaultValue) => {
    const result = [...(arr || [])]
    while (result.length < 3) {
      result.push({ ...defaultValue })
    }
    return result.slice(0, 3)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingImage(true)
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setNewBlogImage(data.url)
    } catch (err) {
      console.error('Image upload failed:', err)
      alert('Failed to upload image. Please verify your connection.')
    } finally {
      setUploadingImage(false)
    }
  }

  // Load user data on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.hash = '#/login'
      return
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!response.ok) {
          throw new Error('Unauthorized')
        }
        const parsedUser = await response.json()
        setUser(parsedUser)
        setEditName(parsedUser.name || '')
        setEditDivision(parsedUser.division || '')
        setEditBio(parsedUser.bio || '')
        setEditStatus(parsedUser.status || 'PENDING VERIFICATION')

        const portfolio = parsedUser.portfolio || {}
        setEditHeroTitle(portfolio.heroTitle || '')
        setEditHeroSubtitle(portfolio.heroSubtitle || '')
        setEditPillars(ensureLength3(portfolio.pillars, { title: '', desc: '' }))
        setEditTimeline(ensureLength3(portfolio.timeline, { period: '', title: '', desc: '', tags: [] }))
        setEditHighlights(ensureLength3(portfolio.broadcastHighlights, { period: '', station: '', title: '', desc: '' }))
        setEditAwards(ensureLength3(portfolio.awards, { title: '', category: '', desc: '' }))
        setEditBlogs(portfolio.blogs || [])
        setEditEvents(portfolio.events || [])
        const yLink = portfolio.youtubeLink || ''
        setEditYoutubeLink(yLink)
        const parsedLinks = yLink.split(',').map(s => s.trim()).filter(Boolean)
        setYoutubeLinks(parsedLinks.length > 0 ? parsedLinks : [''])

        localStorage.setItem('currentUser', JSON.stringify(parsedUser))
      } catch (err) {
        console.error('Error fetching profile:', err)
        localStorage.removeItem('currentUser')
        localStorage.removeItem('token')
        window.location.hash = '#/login'
      }
    }

    fetchProfile()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('token')
    window.location.hash = '#/login'
  }

  const handleSave = async (e) => {
    if (e) e.preventDefault()
    setNotification('')

    const token = localStorage.getItem('token')
    if (!token) {
      window.location.hash = '#/login'
      return
    }

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editName,
          division: editDivision,
          bio: editBio,
          status: editStatus,
          portfolio: {
            heroTitle: editHeroTitle,
            heroSubtitle: editHeroSubtitle,
            pillars: editPillars,
            timeline: editTimeline,
            broadcastHighlights: editHighlights,
            awards: editAwards,
            blogs: editBlogs,
            events: editEvents,
            youtubeLink: editYoutubeLink
          }
        })
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || 'Failed to update profile.')
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))

      const now = new Date()
      setLastSaved(now.toLocaleTimeString())
      setNotification('Profile index updated successfully in network registry!')
    } catch (err) {
      console.error('Save profile error:', err)
      setNotification(`Error: ${err.message}`)
    }

    // Auto-clear notification
    setTimeout(() => {
      setNotification('')
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-white text-[#10141a] relative font-body selection:bg-[#e30613] selection:text-white antialiased dashboard-view">
      <WebGLRedShader />

      {/* Header */}
      <header className="sticky top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-black/5 py-4">
        <nav className="flex justify-between items-center max-w-container-max mx-auto px-margin-desktop h-12 w-full">
          <div className="flex items-center gap-3">
            <a href="#/" className="flex items-center gap-2 hover:text-[#e30613] transition-colors">
              <span className="w-6 h-6 bg-[#e30613] rounded flex items-center justify-center text-white font-display font-black text-xs">B</span>
              <div className="font-mono text-xs tracking-[0.2em] text-[#e30613] uppercase font-bold">
                BIG TV NEWSNET
              </div>
            </a>
          </div>
          
          <div className="flex items-center gap-6">
            <a 
              href="#/" 
              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold text-text-muted hover:text-[#10141a] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Hub
            </a>
            <button 
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold text-[#e30613] hover:text-[#b0050d] transition-colors cursor-pointer border border-[#e30613]/25 px-3 py-1 rounded bg-[#e30613]/5"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </nav>
      </header>

      <main className="max-w-container-max mx-auto px-margin-desktop py-16 relative z-10">
        
        {/* Welcome Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 font-mono text-[9px] text-[#e30613] font-bold uppercase tracking-widest mb-3">
            <Cpu className="w-4 h-4 text-[#e30613] animate-pulse" /> newsroom terminal connected
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold text-text-primary tracking-tight">
            Welcome Back, <span className="text-[#e30613] font-black">{user.name || 'Correspondent'}</span>
          </h1>
          <p className="font-body text-xs text-text-muted mt-2 font-light">
            Editorial Registry Account: <code className="font-bold text-[#10141a]">{user.email}</code>
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Edit form */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 border border-black/5 rounded-2xl p-8 shadow-sm backdrop-blur"
            >
              <h2 className="font-display text-xl font-bold border-b border-black/5 pb-4 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-[#e30613]" /> Edit Directory Profile
              </h2>

              {notification && (
                <div className="mb-6 bg-emerald-50 border border-emerald-200/50 rounded-xl p-4 flex gap-3 text-emerald-800 text-xs font-mono items-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <span>{notification}</span>
                    <span className="block text-[10px] text-text-muted mt-0.5">Registry updated at {lastSaved}</span>
                  </div>
                </div>
              )}

              {/* Tab Navigation */}
              <div className="flex border-b border-black/10 mb-8 overflow-x-auto pb-1 gap-2">
                {[
                  { id: 'profile', label: 'Directory Info' },
                  { id: 'hero', label: 'Hero & Pillars' },
                  { id: 'timeline', label: 'Timeline' },
                  { id: 'highlights', label: 'Milestones & Awards' },
                  { id: 'blogs', label: 'Blogs' },
                  { id: 'events', label: 'Events' },
                  { id: 'youtube', label: 'YouTube' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-4 px-4 font-mono text-[10px] uppercase tracking-wider relative transition-all duration-300 font-bold whitespace-nowrap cursor-pointer border-none bg-transparent ${
                      activeTab === tab.id
                        ? 'text-[#e30613]' 
                        : 'text-text-muted hover:text-[#10141a]'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeDashboardTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#e30613]"
                      />
                    )}
                  </button>
                ))}
              </div>

              <form className="space-y-6" onSubmit={handleSave}>
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-wider text-text-muted font-bold mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="block w-full px-4 py-3 bg-white/50 border border-black/10 rounded-xl font-mono text-xs text-[#10141a] focus:outline-none focus:border-[#e30613] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-wider text-text-muted font-bold mb-2">
                          News Division
                        </label>
                        <select
                          value={editDivision}
                          onChange={(e) => setEditDivision(e.target.value)}
                          className="block w-full px-4 py-3 bg-white/50 border border-black/10 rounded-xl font-mono text-xs text-[#10141a] focus:outline-none focus:border-[#e30613] transition-colors"
                        >
                          <option value="Political Bureau">Political Bureau</option>
                          <option value="Investigative Bureau">Investigative Bureau</option>
                          <option value="Regional Desk">Regional Desk</option>
                          <option value="National Bureau">National Bureau</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-wider text-text-muted font-bold mb-2">
                        Personal Status Vetting (Hub Card Banner)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setEditStatus('PENDING VERIFICATION')}
                          className={`px-4 py-3.5 rounded-xl border font-mono text-xs text-center font-bold tracking-wider transition-all cursor-pointer ${
                            editStatus === 'PENDING VERIFICATION'
                              ? 'border-[#e30613] bg-[#e30613]/5 text-[#e30613]'
                              : 'border-black/10 hover:bg-black/5 text-text-muted bg-white'
                          }`}
                        >
                          PENDING VERIFICATION
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setEditStatus('LIVE RECORD')}
                          className={`px-4 py-3.5 rounded-xl border font-mono text-xs text-center font-bold tracking-wider transition-all cursor-pointer ${
                            editStatus === 'LIVE RECORD'
                              ? 'border-emerald-500 bg-emerald-500/5 text-emerald-600'
                              : 'border-black/10 hover:bg-black/5 text-text-muted bg-white'
                          }`}
                        >
                          LIVE RECORD (PUBLIC)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-wider text-text-muted font-bold mb-2">
                        Professional Biography snippet
                      </label>
                      <textarea
                        required
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        rows={4}
                        maxLength={200}
                        className="block w-full px-4 py-3 bg-white/50 border border-black/10 rounded-xl font-mono text-xs text-[#10141a] focus:outline-none focus:border-[#e30613] transition-colors resize-none"
                        placeholder="Provide a brief summary of your reporting coverage..."
                      />
                      <p className="mt-2 text-[10px] font-mono text-text-muted text-right">
                        {editBio.length}/200 characters max
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'hero' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-wider text-text-muted font-bold mb-2">
                        Hero Section Title (supports line breaks)
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={editHeroTitle}
                        onChange={(e) => setEditHeroTitle(e.target.value)}
                        className="block w-full px-4 py-3 bg-white/50 border border-black/10 rounded-xl font-mono text-xs text-[#10141a] focus:outline-none focus:border-[#e30613] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-wider text-text-muted font-bold mb-2">
                        Hero Section Subtitle / Intro text
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={editHeroSubtitle}
                        onChange={(e) => setEditHeroSubtitle(e.target.value)}
                        className="block w-full px-4 py-3 bg-white/50 border border-black/10 rounded-xl font-mono text-xs text-[#10141a] focus:outline-none focus:border-[#e30613] transition-colors"
                      />
                    </div>

                    <div className="border-t border-black/5 pt-6">
                      <h3 className="font-display font-bold text-sm text-[#10141a] mb-4">Core Ethical Pillars</h3>
                      <div className="space-y-6">
                        {editPillars.map((pillar, idx) => (
                          <div key={idx} className="bg-slate-50/50 border border-black/5 rounded-xl p-4 space-y-4">
                            <span className="font-mono text-[9px] text-[#e30613] font-bold">PILLAR {idx + 1}</span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="sm:col-span-1">
                                <label className="block font-mono text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">Title</label>
                                <input
                                  type="text"
                                  value={pillar.title}
                                  onChange={(e) => {
                                    const updated = [...editPillars];
                                    updated[idx].title = e.target.value;
                                    setEditPillars(updated);
                                  }}
                                  className="block w-full px-3 py-2 bg-white border border-black/10 rounded-lg font-mono text-[11px] text-[#10141a] focus:outline-none focus:border-[#e30613] transition-colors"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block font-mono text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">Description</label>
                                <input
                                  type="text"
                                  value={pillar.desc}
                                  onChange={(e) => {
                                    const updated = [...editPillars];
                                    updated[idx].desc = e.target.value;
                                    setEditPillars(updated);
                                  }}
                                  className="block w-full px-3 py-2 bg-white border border-black/10 rounded-lg font-mono text-[11px] text-[#10141a] focus:outline-none focus:border-[#e30613] transition-colors"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'timeline' && (
                  <div className="space-y-6">
                    <h3 className="font-display font-bold text-sm text-[#10141a] mb-4">Timeline Evolution (3 Items)</h3>
                    {editTimeline.map((item, idx) => (
                      <div key={idx} className="bg-slate-50/50 border border-black/5 rounded-xl p-4 space-y-4">
                        <span className="font-mono text-[9px] text-[#e30613] font-bold">TIMELINE NODE {idx + 1}</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-mono text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">Period (Years/Role)</label>
                            <input
                              type="text"
                              value={item.period}
                              onChange={(e) => {
                                const updated = [...editTimeline];
                                updated[idx].period = e.target.value;
                                setEditTimeline(updated);
                              }}
                              className="block w-full px-3 py-2 bg-white border border-black/10 rounded-lg font-mono text-[11px] text-[#10141a] focus:outline-none focus:border-[#e30613] transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">Title / Organization</label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => {
                                const updated = [...editTimeline];
                                updated[idx].title = e.target.value;
                                setEditTimeline(updated);
                              }}
                              className="block w-full px-3 py-2 bg-white border border-black/10 rounded-lg font-mono text-[11px] text-[#10141a] focus:outline-none focus:border-[#e30613] transition-colors"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block font-mono text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">Description</label>
                          <textarea
                            rows={2}
                            value={item.desc}
                            onChange={(e) => {
                              const updated = [...editTimeline];
                              updated[idx].desc = e.target.value;
                              setEditTimeline(updated);
                            }}
                            className="block w-full px-3 py-2 bg-white border border-black/10 rounded-lg font-mono text-[11px] text-[#10141a] focus:outline-none focus:border-[#e30613] transition-colors resize-none"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">Tags (Comma-separated)</label>
                          <input
                            type="text"
                            value={item.tags ? item.tags.join(', ') : ''}
                            onChange={(e) => {
                              const updated = [...editTimeline];
                              updated[idx].tags = e.target.value.split(',').map(t => t.trim());
                              setEditTimeline(updated);
                            }}
                            className="block w-full px-3 py-2 bg-white border border-black/10 rounded-lg font-mono text-[11px] text-[#10141a] focus:outline-none focus:border-[#e30613] transition-colors"
                            placeholder="e.g. Sat Broadcast, Live Anchor"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'highlights' && (
                  <div className="space-y-6">

                    <div>
                      <h3 className="font-display font-bold text-sm text-[#10141a] mb-4">Broadcast Highlights (3 Items)</h3>
                      <div className="space-y-6">
                        {editHighlights.map((card, idx) => (
                          <div key={idx} className="bg-slate-50/50 border border-black/5 rounded-xl p-4 space-y-4">
                            <span className="font-mono text-[9px] text-[#e30613] font-bold">HIGHLIGHT CARD {idx + 1}</span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <label className="block font-mono text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">Period</label>
                                <input
                                  type="text"
                                  value={card.period}
                                  onChange={(e) => {
                                    const updated = [...editHighlights];
                                    updated[idx].period = e.target.value;
                                    setEditHighlights(updated);
                                  }}
                                  className="block w-full px-3 py-2 bg-white border border-black/10 rounded-lg font-mono text-[11px] focus:outline-none focus:border-[#e30613] transition-colors"
                                />
                              </div>
                              <div>
                                <label className="block font-mono text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">Station / Network</label>
                                <input
                                  type="text"
                                  value={card.station}
                                  onChange={(e) => {
                                    const updated = [...editHighlights];
                                    updated[idx].station = e.target.value;
                                    setEditHighlights(updated);
                                  }}
                                  className="block w-full px-3 py-2 bg-white border border-black/10 rounded-lg font-mono text-[11px] focus:outline-none focus:border-[#e30613] transition-colors"
                                />
                              </div>
                              <div>
                                <label className="block font-mono text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">Milestone Title</label>
                                <input
                                  type="text"
                                  value={card.title}
                                  onChange={(e) => {
                                    const updated = [...editHighlights];
                                    updated[idx].title = e.target.value;
                                    setEditHighlights(updated);
                                  }}
                                  className="block w-full px-3 py-2 bg-white border border-black/10 rounded-lg font-mono text-[11px] focus:outline-none focus:border-[#e30613] transition-colors"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block font-mono text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">Description</label>
                              <textarea
                                rows={2}
                                value={card.desc}
                                onChange={(e) => {
                                  const updated = [...editHighlights];
                                  updated[idx].desc = e.target.value;
                                  setEditHighlights(updated);
                                }}
                                className="block w-full px-3 py-2 bg-white border border-black/10 rounded-lg font-mono text-[11px] focus:outline-none focus:border-[#e30613] transition-colors resize-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-black/5 pt-6">
                      <h3 className="font-display font-bold text-sm text-[#10141a] mb-4">Recognition &amp; Awards (3 Items)</h3>
                      <div className="space-y-6">
                        {editAwards.map((award, idx) => (
                          <div key={idx} className="bg-slate-50/50 border border-black/5 rounded-xl p-4 space-y-4">
                            <span className="font-mono text-[9px] text-[#e30613] font-bold">AWARD CARD {idx + 1}</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block font-mono text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">Award Title</label>
                                <input
                                  type="text"
                                  value={award.title}
                                  onChange={(e) => {
                                    const updated = [...editAwards];
                                    updated[idx].title = e.target.value;
                                    setEditAwards(updated);
                                  }}
                                  className="block w-full px-3 py-2 bg-white border border-black/10 rounded-lg font-mono text-[11px] focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block font-mono text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">Category</label>
                                <input
                                  type="text"
                                  value={award.category}
                                  onChange={(e) => {
                                    const updated = [...editAwards];
                                    updated[idx].category = e.target.value;
                                    setEditAwards(updated);
                                  }}
                                  className="block w-full px-3 py-2 bg-white border border-black/10 rounded-lg font-mono text-[11px] focus:outline-none placeholder-text-muted/50"
                                  placeholder="e.g. RECOGNITION"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block font-mono text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">Description / Achievement</label>
                              <textarea
                                rows={2}
                                value={award.desc}
                                onChange={(e) => {
                                  const updated = [...editAwards];
                                  updated[idx].desc = e.target.value;
                                  setEditAwards(updated);
                                }}
                                className="block w-full px-3 py-2 bg-white border border-black/10 rounded-lg font-mono text-[11px] focus:outline-none resize-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'blogs' && (
                  <div className="space-y-6">
                    <h3 className="font-display font-bold text-sm text-[#10141a] mb-4">Blogs &amp; Insights Manager</h3>
                    
                    {/* Add/Edit Blog Form */}
                    <div className="bg-slate-50/50 border border-black/10 rounded-xl p-6 space-y-4">
                      <span className="font-mono text-[10px] text-[#e30613] font-bold uppercase flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5" /> {editingBlogIndex !== null ? 'Edit Blog Article' : 'Add New Blog Article'}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-mono text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">Article Title</label>
                          <input
                            type="text"
                            value={newBlogTitle}
                            onChange={(e) => setNewBlogTitle(e.target.value)}
                            className="block w-full px-3 py-2 bg-white border border-black/10 rounded-lg font-mono text-[11px] focus:outline-none"
                            placeholder="Future of Regional Broadcast"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">Publish Date</label>
                          <input
                            type="text"
                            value={newBlogDate}
                            onChange={(e) => setNewBlogDate(e.target.value)}
                            className="block w-full px-3 py-2 bg-white border border-black/10 rounded-lg font-mono text-[11px] focus:outline-none"
                            placeholder="June 29, 2026"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-mono text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">Brief Excerpt (shown on list)</label>
                        <input
                          type="text"
                          value={newBlogExcerpt}
                          onChange={(e) => setNewBlogExcerpt(e.target.value)}
                          className="block w-full px-3 py-2 bg-white border border-black/10 rounded-lg font-mono text-[11px] focus:outline-none"
                          placeholder="A quick summary of the article..."
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">Full Article Content</label>
                        <textarea
                          rows={4}
                          value={newBlogContent}
                          onChange={(e) => setNewBlogContent(e.target.value)}
                          className="block w-full px-3 py-2 bg-white border border-black/10 rounded-lg font-mono text-[11px] focus:outline-none"
                          placeholder="Write the full content of the blog post here..."
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">Cover Image</label>
                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            className="block w-full text-[10px] font-mono text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-[10px] file:font-mono file:font-bold file:bg-[#e30613]/10 file:text-[#e30613] file:cursor-pointer hover:file:bg-[#e30613]/15 transition-all"
                          />
                          {uploadingImage && (
                            <span className="text-[9px] font-mono text-text-muted animate-pulse">Uploading to Cloudflare R2...</span>
                          )}
                        </div>
                        {newBlogImage && (
                          <div className="mt-3 relative w-32 aspect-video rounded-lg overflow-hidden border border-black/5">
                            <img src={newBlogImage} alt="Cover Preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setNewBlogImage('')}
                              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 border-none hover:bg-black/80 transition-all cursor-pointer"
                              style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px' }}
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            if (!newBlogTitle || !newBlogDate) {
                              alert('Title and date are required for blogs');
                              return;
                            }
                            const blogData = {
                              title: newBlogTitle,
                              date: newBlogDate,
                              excerpt: newBlogExcerpt,
                              content: newBlogContent,
                              image: newBlogImage
                            };

                            if (editingBlogIndex !== null) {
                              const updated = [...editBlogs];
                              updated[editingBlogIndex] = blogData;
                              setEditBlogs(updated);
                              setEditingBlogIndex(null);
                            } else {
                              setEditBlogs([...editBlogs, blogData]);
                            }

                            setNewBlogTitle('');
                            setNewBlogDate('');
                            setNewBlogExcerpt('');
                            setNewBlogContent('');
                            setNewBlogImage('');
                          }}
                          className="px-4 py-2 border border-transparent rounded-lg text-white font-mono text-[10px] font-bold bg-[#e30613] hover:bg-[#b0050d] transition-colors cursor-pointer w-fit"
                        >
                          {editingBlogIndex !== null ? 'UPDATE BLOG' : 'ADD BLOG TO LIST'}
                        </button>
                        {editingBlogIndex !== null && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingBlogIndex(null);
                              setNewBlogTitle('');
                              setNewBlogDate('');
                              setNewBlogExcerpt('');
                              setNewBlogContent('');
                              setNewBlogImage('');
                            }}
                            className="px-4 py-2 border border-black/10 text-text-primary rounded-lg font-mono text-[10px] font-bold bg-transparent hover:bg-black/5 transition-colors cursor-pointer w-fit"
                          >
                            CANCEL EDIT
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Existing Blogs List */}
                    <div className="space-y-4">
                      <h4 className="font-mono text-[10px] uppercase tracking-wider text-text-muted font-bold">Current Articles ({editBlogs.length})</h4>
                      {editBlogs.length === 0 ? (
                        <p className="font-mono text-[10px] text-text-muted italic">No blog posts added yet. Use the form above to add one.</p>
                      ) : (
                        <div className="space-y-2">
                          {editBlogs.map((blog, bIdx) => (
                            <div key={bIdx} className="border border-black/5 bg-slate-50/30 rounded-xl p-4 flex justify-between items-center text-left">
                              <div className="flex items-center gap-4">
                                {blog.image && (
                                  <img src={blog.image} alt={blog.title} className="w-12 h-8 object-cover rounded border border-black/5 flex-shrink-0" />
                                )}
                                <div>
                                  <h5 className="font-display font-bold text-xs text-[#10141a]">{blog.title}</h5>
                                  <span className="font-mono text-[9px] text-text-muted">{blog.date}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingBlogIndex(bIdx);
                                    setNewBlogTitle(blog.title || '');
                                    setNewBlogDate(blog.date || '');
                                    setNewBlogExcerpt(blog.excerpt || '');
                                    setNewBlogContent(blog.content || '');
                                    setNewBlogImage(blog.image || '');
                                  }}
                                  className="p-2 text-text-muted hover:text-[#0055ff] hover:bg-[#0055ff]/5 rounded-lg transition-colors cursor-pointer bg-transparent border-none"
                                  title="Edit Blog"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = editBlogs.filter((_, idx) => idx !== bIdx);
                                    setEditBlogs(updated);
                                    if (editingBlogIndex === bIdx) {
                                      setEditingBlogIndex(null);
                                      setNewBlogTitle('');
                                      setNewBlogDate('');
                                      setNewBlogExcerpt('');
                                      setNewBlogContent('');
                                      setNewBlogImage('');
                                    }
                                  }}
                                  className="p-2 text-text-muted hover:text-[#e30613] hover:bg-[#e30613]/5 rounded-lg transition-colors cursor-pointer bg-transparent border-none"
                                  title="Delete Blog"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'events' && (
                  <div className="space-y-6">
                    <h3 className="font-display font-bold text-sm text-[#10141a] mb-4">Upcoming Events Manager</h3>
                    
                    {/* Add/Edit Event Form */}
                    <div className="bg-slate-50/50 border border-black/10 rounded-xl p-6 space-y-4">
                      <span className="font-mono text-[10px] text-[#e30613] font-bold uppercase flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5" /> {editingEventIndex !== null ? 'Edit Event' : 'Add New Event'}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-mono text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">Event Name</label>
                          <input
                            type="text"
                            value={newEventTitle}
                            onChange={(e) => setNewEventTitle(e.target.value)}
                            className="block w-full px-3 py-2 bg-white border border-black/10 rounded-lg font-mono text-[11px] focus:outline-none"
                            placeholder="Broadcast Synergy Summit"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">Date</label>
                          <input
                            type="text"
                            value={newEventDate}
                            onChange={(e) => setNewEventDate(e.target.value)}
                            className="block w-full px-3 py-2 bg-white border border-black/10 rounded-lg font-mono text-[11px] focus:outline-none"
                            placeholder="July 12, 2026"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-mono text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">Location</label>
                          <input
                            type="text"
                            value={newEventLocation}
                            onChange={(e) => setNewEventLocation(e.target.value)}
                            className="block w-full px-3 py-2 bg-white border border-black/10 rounded-lg font-mono text-[11px] focus:outline-none"
                            placeholder="Hyderabad Convention Center"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[9px] uppercase tracking-wider text-text-muted font-bold mb-1">Short Description</label>
                          <input
                            type="text"
                            value={newEventDesc}
                            onChange={(e) => setNewEventDesc(e.target.value)}
                            className="block w-full px-3 py-2 bg-white border border-black/10 rounded-lg font-mono text-[11px] focus:outline-none"
                            placeholder="Keynote speaker address..."
                          />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            if (!newEventTitle || !newEventDate) {
                              alert('Title and date are required for events');
                              return;
                            }
                            const eventData = {
                              title: newEventTitle,
                              date: newEventDate,
                              location: newEventLocation,
                              desc: newEventDesc
                            };

                            if (editingEventIndex !== null) {
                              const updated = [...editEvents];
                              updated[editingEventIndex] = eventData;
                              setEditEvents(updated);
                              setEditingEventIndex(null);
                            } else {
                              setEditEvents([...editEvents, eventData]);
                            }

                            setNewEventTitle('');
                            setNewEventDate('');
                            setNewEventLocation('');
                            setNewEventDesc('');
                          }}
                          className="px-4 py-2 border border-transparent rounded-lg text-white font-mono text-[10px] font-bold bg-[#e30613] hover:bg-[#b0050d] transition-colors cursor-pointer w-fit"
                        >
                          {editingEventIndex !== null ? 'UPDATE EVENT' : 'ADD EVENT TO LIST'}
                        </button>
                        {editingEventIndex !== null && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingEventIndex(null);
                              setNewEventTitle('');
                              setNewEventDate('');
                              setNewEventLocation('');
                              setNewEventDesc('');
                            }}
                            className="px-4 py-2 border border-black/10 text-text-primary rounded-lg font-mono text-[10px] font-bold bg-transparent hover:bg-black/5 transition-colors cursor-pointer w-fit"
                          >
                            CANCEL EDIT
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Existing Events List */}
                    <div className="space-y-4">
                      <h4 className="font-mono text-[10px] uppercase tracking-wider text-text-muted font-bold">Current Events ({editEvents.length})</h4>
                      {editEvents.length === 0 ? (
                        <p className="font-mono text-[10px] text-text-muted italic">No upcoming events added yet. Use the form above to add one.</p>
                      ) : (
                        <div className="space-y-2">
                          {editEvents.map((event, eIdx) => (
                            <div key={eIdx} className="border border-black/5 bg-slate-50/30 rounded-xl p-4 flex justify-between items-center text-left">
                              <div>
                                <h5 className="font-display font-bold text-xs text-[#10141a]">{event.title}</h5>
                                <span className="font-mono text-[9px] text-text-muted">{event.date} • {event.location}</span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingEventIndex(eIdx);
                                    setNewEventTitle(event.title || '');
                                    setNewEventDate(event.date || '');
                                    setNewEventLocation(event.location || '');
                                    setNewEventDesc(event.desc || '');
                                  }}
                                  className="p-2 text-text-muted hover:text-[#0055ff] hover:bg-[#0055ff]/5 rounded-lg transition-colors cursor-pointer bg-transparent border-none"
                                  title="Edit Event"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = editEvents.filter((_, idx) => idx !== eIdx);
                                    setEditEvents(updated);
                                    if (editingEventIndex === eIdx) {
                                      setEditingEventIndex(null);
                                      setNewEventTitle('');
                                      setNewEventDate('');
                                      setNewEventLocation('');
                                      setNewEventDesc('');
                                    }
                                  }}
                                  className="p-2 text-text-muted hover:text-[#e30613] hover:bg-[#e30613]/5 rounded-lg transition-colors cursor-pointer bg-transparent border-none"
                                  title="Delete Event"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── YOUTUBE TAB ── */}
                {activeTab === 'youtube' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                      {/* YouTube icon (inline SVG) */}
                      <svg className="w-5 h-5 text-[#e30613] fill-current" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      <h3 className="font-display text-base font-bold text-[#10141a]">YouTube Feature Videos</h3>
                    </div>
                    <p className="font-mono text-[10px] text-text-muted leading-relaxed">
                      Add one or more YouTube video links. They will appear as interactive video cards with horizontal scrolling on your portfolio.
                    </p>

                    <div className="space-y-4">
                      {youtubeLinks.map((link, index) => (
                        <div key={index} className="bg-slate-50/50 border border-black/5 rounded-2xl p-5 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-[9px] text-[#e30613] font-bold uppercase">Video #{index + 1}</span>
                            {youtubeLinks.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newLinks = youtubeLinks.filter((_, idx) => idx !== index);
                                  setYoutubeLinks(newLinks);
                                  setEditYoutubeLink(newLinks.filter(Boolean).join(','));
                                }}
                                className="font-mono text-[9px] text-text-muted hover:text-[#e30613] transition-colors bg-transparent border-none cursor-pointer"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          
                          <div className="relative flex items-center gap-2">
                            <svg className="absolute left-3 w-4 h-4 text-text-muted pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                            </svg>
                            <input
                              type="url"
                              value={link}
                              onChange={(e) => {
                                let url = e.target.value.trim();
                                const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
                                if (watchMatch) {
                                  url = `https://www.youtube.com/embed/${watchMatch[1]}`;
                                }
                                const newLinks = [...youtubeLinks];
                                newLinks[index] = url;
                                setYoutubeLinks(newLinks);
                                setEditYoutubeLink(newLinks.filter(Boolean).join(','));
                              }}
                              placeholder="https://www.youtube.com/watch?v=... or embed URL"
                              className="block w-full pl-9 pr-4 py-3 bg-white border border-black/10 rounded-xl font-mono text-xs text-[#10141a] focus:outline-none focus:border-[#e30613] transition-colors"
                            />
                          </div>

                          {link && !link.includes('/embed/') && (
                            <p className="font-mono text-[9px] text-amber-600">
                              ⚠ Could not auto-detect embed format. Standard links will auto-convert.
                            </p>
                          )}

                          {link && link.includes('/embed/') && (
                            <div className="relative w-full rounded-xl overflow-hidden border border-black/5 bg-black shadow-sm" style={{ paddingTop: '56.25%' }}>
                              <iframe
                                src={link}
                                className="absolute inset-0 w-full h-full"
                                title={`YouTube preview ${index + 1}`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setYoutubeLinks([...youtubeLinks, ''])}
                      className="w-full py-3 border border-dashed border-[#e30613]/30 hover:border-[#e30613]/60 text-[#e30613] font-mono text-[10px] uppercase font-bold tracking-wider rounded-xl transition-all hover:bg-[#e30613]/5 cursor-pointer"
                    >
                      + Add Another YouTube Video
                    </button>
                  </div>
                )}

                <div className="border-t border-black/5 pt-6 flex justify-between items-center">
                  <span className="font-mono text-[9px] text-text-muted">ALL TAB EDITS ARE PUBLISHED SIMULTANEOUSLY</span>
                  <button
                    type="submit"
                    className="flex justify-center py-3.5 px-8 border border-transparent rounded-xl shadow-md text-white font-mono text-xs tracking-widest font-bold bg-[#e30613] hover:bg-[#b0050d] transition-all duration-300 cursor-pointer"
                  >
                    PUBLISH TO DIRECTORY
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

        </div>

      </main>
    </div>
  )
}
