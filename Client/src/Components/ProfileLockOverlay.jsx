import React from 'react'
import { motion } from 'framer-motion'
import { Lock, ArrowLeft, ShieldAlert } from 'lucide-react'

export default function ProfileLockOverlay({ name, division, handleBack }) {
  const handleDashboard = () => {
    window.location.hash = '#/dashboard'
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/75 backdrop-blur-[24px] px-6 select-none font-sans">
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-red-600/10 filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[40vw] h-[40vw] rounded-full bg-blue-600/10 filter blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-md w-full bg-neutral-950/70 border border-white/10 rounded-[36px] p-8 text-center shadow-2xl relative overflow-hidden"
      >
        {/* Glowing top line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
        
        {/* Shield icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <Lock className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        {/* Profile Info */}
        <div className="space-y-2 mb-8">
          <span className="inline-flex items-center gap-1.5 bg-red-500/15 border border-red-500/25 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest text-red-500 uppercase font-bold">
            Gated Registry Access
          </span>
          <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight leading-none pt-2">
            {name}
          </h2>
          <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest font-bold">
            {division}
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
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Hub
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
