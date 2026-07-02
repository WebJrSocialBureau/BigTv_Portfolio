import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock, ArrowLeft, ShieldAlert } from 'lucide-react'
import Lenis from 'lenis'

export default function PendingPayment() {
  // Parse name and role from URL query params
  const params = new URLSearchParams(window.location.hash.split('?')[1] || '')
  const name = params.get('name') || 'Correspondent Profile'
  const role = params.get('role') || 'BIG TV newsroom member'

  // Initialize Lenis for smooth UI feel
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
    return () => lenis.destroy()
  }, [])

  const handleBack = () => {
    window.location.hash = '#/'
  }

  const handleDashboard = () => {
    window.location.hash = '#/dashboard'
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050508] text-white px-6 py-12 relative overflow-hidden select-none font-sans">
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-red-900/10 filter blur-[150px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-900/10 filter blur-[150px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-md w-full bg-neutral-950/70 border border-white/10 backdrop-blur-md rounded-[36px] p-8 md:p-10 text-center shadow-2xl overflow-hidden"
      >
        {/* Top glowing line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
        
        {/* Shield Lock Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Profile Info */}
        <div className="space-y-2 mb-8">
          <span className="inline-flex items-center gap-1.5 bg-red-500/15 border border-red-500/25 px-3.5 py-1 rounded-full text-[9px] font-mono tracking-widest text-red-500 uppercase font-bold">
            Gated Registry Access
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-none pt-2">
            {name}
          </h2>
          <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest font-bold">
            {role}
          </p>
        </div>

        <div className="w-full h-px bg-white/5 my-6" />

        {/* Message */}
        <div className="space-y-4 mb-8">
          <h3 className="font-display text-sm font-bold text-red-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-4 h-4" /> Pending Amount Signal
          </h3>
          <p className="font-body text-xs text-neutral-400 leading-relaxed font-light">
            Public access to this correspondent's professional registry is currently restricted. If you are the owner of this profile, please log into your terminal to unlock full public visibility.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3.5">
          <button
            onClick={handleDashboard}
            className="w-full py-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-mono text-[10px] font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-red-600/10 cursor-pointer"
          >
            Dashboard Terminal
          </button>
          
          <button
            onClick={handleBack}
            className="w-full py-3.5 rounded-full border border-white/5 bg-white/5 text-neutral-400 hover:text-white hover:border-white/10 font-mono text-[10px] font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
          </button>
        </div>

        {/* Small security footer */}
        <div className="mt-8 font-mono text-[8px] text-neutral-600 uppercase tracking-wider">
          Secured by BIG TV newsrooms integrity module
        </div>
      </motion.div>
    </div>
  )
}
