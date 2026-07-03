import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Unlock, Shield, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { API_BASE_URL } from '../utils/api.js'

// Helper to load external scripts dynamically
const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function GatedAccess({ identifier, name, division, children }) {
  const [unlocked, setUnlocked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [error, setError] = useState('')

  // Unique key for local storage
  const storageKey = `unlocked_${identifier.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`

  useEffect(() => {
    const isUnlocked = localStorage.getItem(storageKey) === 'true'
    if (isUnlocked) {
      setUnlocked(true)
    }
  }, [storageKey])

  const handlePayment = async () => {
    setLoading(true)
    setError('')

    try {
      // 1. Load Razorpay script
      const scriptLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
      if (!scriptLoaded) {
        setError('Failed to load Razorpay payment portal. Please check your network connection.')
        setLoading(false)
        return
      }

      // 2. Create order on backend (nominal ₹2 charge)
      const resOrder = await fetch(`${API_BASE_URL}/api/payment/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: 2 })
      })

      if (!resOrder.ok) {
        const errData = await resOrder.json()
        throw new Error(errData.message || 'Failed to initialize payment order.')
      }

      const orderData = await resOrder.json()

      // 3. Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_SoNz6WoLNwdc0l',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'BIG TV NEWSNET',
        description: `Premium Registry Access for ${name}`,
        image: 'https://www.socialbureau.in/assets/logo.webp',
        order_id: orderData.orderId,
        handler: async function (response) {
          setLoading(false)
          setVerifying(true)

          try {
            // 4. Verify signature on backend
            const resVerify = await fetch(`${API_BASE_URL}/api/payment/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            })

            const verifyData = await resVerify.json()
            if (verifyData.verified) {
              setPaymentSuccess(true)
              setTimeout(() => {
                localStorage.setItem(storageKey, 'true')
                setUnlocked(true)
                setVerifying(false)
              }, 2000)
            } else {
              throw new Error(verifyData.message || 'Payment verification failed.')
            }
          } catch (verifyErr) {
            console.error('Signature verification error:', verifyErr)
            setError(verifyErr.message || 'Payment verification failed. Please contact support.')
            setVerifying(false)
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#e30613'
        },
        modal: {
          ondismiss: function () {
            setLoading(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (err) {
      console.error('Razorpay process error:', err)
      setError(err.message || 'An error occurred during the payment initiation.')
      setLoading(false)
    }
  }

  const handleBack = () => {
    window.location.hash = '#/'
  }

  // If already unlocked, render the correspondent's actual portfolio page!
  if (unlocked) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col justify-between items-center relative overflow-hidden select-none font-sans py-8 px-6">
      {/* Premium Ambient Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#e30613]/5 filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/5 filter blur-[120px] pointer-events-none" />
      
      {/* Header back button */}
      <header className="w-full max-w-5xl flex justify-between items-center z-20">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-md text-[10px] font-mono tracking-widest text-neutral-400 hover:text-white hover:border-white/20 transition-all duration-300 group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          BACK TO DIRECTORY
        </button>
      </header>

      {/* Main Gating card */}
      <main className="w-full max-w-md z-10 my-auto">
        <AnimatePresence mode="wait">
          {verifying ? (
            <motion.div
              key="verifying"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-900/80 border border-white/5 rounded-[40px] p-8 text-center space-y-6 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex justify-center">
                {paymentSuccess ? (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                  </motion.div>
                ) : (
                  <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-[#e30613] animate-spin" />
                )}
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-lg font-black uppercase tracking-wider">
                  {paymentSuccess ? 'ACCESS GRANTED' : 'VERIFYING PAYMENT'}
                </h3>
                <p className="font-mono text-xs text-neutral-500">
                  {paymentSuccess 
                    ? 'Securing database connection streams...' 
                    : 'Syncing with Razorpay ledger network...'}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="gated-form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-neutral-900/60 border border-white/5 rounded-[40px] p-8 text-center space-y-8 shadow-2xl backdrop-blur-xl relative overflow-hidden group"
            >
              {/* Glowing header light */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#e30613]/30 to-transparent" />
              
              {/* Lock icon container */}
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-3xl bg-[#e30613]/10 border border-[#e30613]/20 flex items-center justify-center text-[#e30613] group-hover:scale-105 transition-transform duration-300">
                  <Lock className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              {/* Profile card preview details */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 bg-[#e30613]/10 border border-[#e30613]/20 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest text-[#e30613] uppercase font-bold">
                  PREMIUM DOSSIER ACCESS
                </div>
                <h2 className="font-display text-3xl font-black text-white uppercase tracking-tight leading-none pt-2">
                  {name}
                </h2>
                <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                  {division}
                </p>
              </div>

              <div className="w-full h-px bg-white/5" />

              <p className="font-body text-xs text-neutral-400 leading-relaxed font-light">
                Unlock full and unlimited public access to this correspondent's professional showreels, career timeline, latest writings, and scheduled briefings.
              </p>

              {/* Action Button */}
              <div className="space-y-4">
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full py-4 rounded-full bg-[#e30613] hover:bg-[#c40510] disabled:bg-neutral-800 text-white font-mono text-[11px] font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-[#e30613]/10 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      CONNECTING...
                    </>
                  ) : (
                    <>
                      <Shield className="w-3.5 h-3.5" />
                      UNLOCK REGISTRY • ₹2
                    </>
                  )}
                </button>

                {error && (
                  <div className="flex items-center gap-2 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-mono text-[9px] text-left leading-normal uppercase">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <div className="font-mono text-[8px] text-slate-600 flex items-center justify-center gap-1 uppercase tracking-wider">
                <Shield className="w-3 h-3 text-slate-600" /> Secure Payment processed by Razorpay
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="w-full text-center font-mono text-[9px] text-slate-700 uppercase tracking-[0.2em] mt-auto">
        &copy; 2026 BIG TV NEWSNET. ALL RIGHTS RESERVED.
      </footer>
    </div>
  )
}
