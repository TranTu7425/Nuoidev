'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertOctagon, Ghost, Trash2, ZapOff, RefreshCcw, X, ImageIcon } from 'lucide-react'
import { playSound } from '@/lib/sounds'
import Image from 'next/image'

export default function ForbiddenButton() {
  const [clickCount, setClickCount] = useState(0)
  const [isDying, setIsDying] = useState(false)
  const [isFlashbanged, setIsFlashbanged] = useState(false)
  const [isRickRolled, setIsRickRolled] = useState(false)
  const [showForgiveButton, setShowForgiveButton] = useState(false)
  const [cornerIndex, setCornerIndex] = useState(-1) // -1: initial, 0: top-left, 1: top-right, 2: bottom-left, 3: bottom-right

  const handleRickRoll = useCallback(() => {
    setIsRickRolled(true)
    setShowForgiveButton(false)
    setCornerIndex(-1)
    
    // Hiện nút "Tha cho tôi" sau 30 giây
    setTimeout(() => {
      setShowForgiveButton(true)
    }, 30000)
  }, [])

  const handleReset = useCallback(() => {
    setIsDying(false)
    setIsRickRolled(false)
    setClickCount(0)
    window.dispatchEvent(new CustomEvent('chaos-mode', { detail: { active: false } }))
  }, [])

  // INSPECT TRAP LOGIC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInspectKey = 
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.metaKey && e.altKey && e.key === 'i')

      if (isInspectKey) {
        e.preventDefault()
        handleRickRoll()
      }
    }

    let threshold = 160
    const handleResize = () => {
      if (window.outerWidth - window.innerWidth > threshold || 
          window.outerHeight - window.innerHeight > threshold) {
        handleRickRoll()
      }
    }

    const devtoolsDetector = () => {
      const start = Date.now()
      // eslint-disable-next-line no-debugger
      debugger
      const end = Date.now()
      if (end - start > 100) {
        handleRickRoll()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleResize)
    const interval = setInterval(devtoolsDetector, 2000)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
      clearInterval(interval)
    }
  }, [handleRickRoll])

  const messages = [
    "CẤM NHẤN!",
    "Đã bảo là cấm mà!",
    "Vẫn nhấn à? Lì thế?",
    "Này... đừng phá nữa!",
    "Dev đang ngủ, đừng làm ồn!",
    "Hỏng web bây giờ đó!!!",
    "Cảnh báo cấp độ 1...",
    "Cảnh báo cấp độ 2...",
    "CHÚC MỪNG BẠN ĐÃ PHÁ HỎNG WEB!",
  ]

  const handleClick = () => {
    if (clickCount >= messages.length - 1) {
      playSound('ALERT')
      triggerCatastrophe()
      return
    }
    playSound('CLICK')
    setClickCount(prev => prev + 1)
  }

  const triggerCatastrophe = () => {
    setIsFlashbanged(true)
    playSound('EXPLOSION')
    
    setTimeout(() => {
      setIsFlashbanged(false)
      setIsDying(true)
      window.dispatchEvent(new CustomEvent('chaos-mode', { detail: { active: true } }))
    }, 5000)
  }

  const handleButtonHover = () => {
    if (!showForgiveButton || cornerIndex >= 3) return
    setCornerIndex(prev => prev + 1)
  }

  return (
    <div className="fixed bottom-24 right-6 z-[250]">
      {!isDying && !isFlashbanged && clickCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: (clickCount / (messages.length - 1)) * 0.9 }}
          className="fixed inset-0 bg-black z-[240] pointer-events-none"
        />
      )}

      <AnimatePresence>
        {isFlashbanged && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 bg-white z-[400] pointer-events-none"
          />
        )}

        {isDying && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-red-600/95 text-white z-[350]"
          >
            <div className="text-center p-6 max-w-md w-full space-y-8">
              <div className="space-y-4">
                <ZapOff size={80} className="mx-auto animate-bounce text-yellow-300" />
                <h1 className="text-5xl font-black uppercase tracking-tighter">Critical Error</h1>
                <p className="text-xl font-bold italic opacity-90">
                  "Hệ thống đã sụp đổ hoàn toàn vì sự lì lợm của bạn. Vui lòng nạp cà phê để khôi phục!"
                </p>
              </div>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white p-4 rounded-[2rem] shadow-2xl inline-block"
              >
                <div className="relative w-48 h-48 mx-auto overflow-hidden rounded-xl">
                  <Image 
                    src="https://qr.sepay.vn/img?acc=96247RDFO9&bank=BIDV" 
                    alt="Khôi phục hệ thống" 
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <p className="text-slate-900 font-black text-xs mt-3 uppercase tracking-widest">
                  Quét để Inject Cà Phê ☕️
                </p>
              </motion.div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={handleReset}
                  className="w-full py-4 bg-white text-red-600 rounded-2xl font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCcw size={20} /> Tôi sẽ nạp cà phê ngay!
                </button>
                <button
                  onClick={handleRickRoll}
                  className="w-full py-3 bg-red-700/50 hover:bg-red-800 text-white/80 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border border-red-500/30"
                >
                  <RefreshCcw size={16} /> Xem giải pháp khắc phục triệt để
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {isRickRolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-black flex items-center justify-center p-4"
          >
            <div className="w-full max-w-4xl aspect-video relative rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.2)]">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0&disablekb=1" 
                title="Rick Roll" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                className="pointer-events-none"
              ></iframe>

              <AnimatePresence>
                {showForgiveButton && (
                  <div 
                    className="fixed z-[600]"
                    style={{
                      transition: 'all 0.15s ease-out',
                      ...(cornerIndex === -1 ? { bottom: '2rem', right: '2rem' } :
                         cornerIndex === 0 ? { top: '2rem', left: '2rem' } :
                         cornerIndex === 1 ? { top: '2rem', right: '2rem' } :
                         cornerIndex === 2 ? { bottom: '2rem', left: '2rem' } :
                         { bottom: '2rem', right: '2rem' })
                    }}
                  >
                    <div 
                      className="p-12 -m-12 cursor-pointer"
                      onMouseEnter={handleButtonHover}
                    >
                      <motion.button 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => {
                          if (cornerIndex === 3) handleReset()
                        }}
                        className={`px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-2xl font-black uppercase tracking-widest transition-all border border-white/20 whitespace-nowrap ${cornerIndex < 3 ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        {cornerIndex < 3 ? 'Đang cố tha...' : 'Đủ rồi, tha cho tôi!'}
                      </motion.button>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9, rotate: -5 }}
        onClick={handleClick}
        className={`px-6 py-4 rounded-2xl shadow-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-colors relative z-[260] ${
          clickCount > 5 ? 'bg-red-600 text-white animate-pulse' : 'bg-white dark:bg-slate-800 text-red-600 border-4 border-red-600'
        }`}
      >
        {clickCount > 5 ? <AlertOctagon size={20} /> : <Ghost size={20} />}
        {messages[clickCount]}
      </motion.button>
    </div>
  )
}
