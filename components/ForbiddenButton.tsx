'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertOctagon, Ghost, Trash2, ZapOff, RefreshCcw, X } from 'lucide-react'
import { playSound } from '@/lib/sounds'
import Image from 'next/image'

export default function ForbiddenButton() {
  const [clickCount, setClickCount] = useState(0)
  const [isDying, setIsDying] = useState(false)
  const [isFlashbanged, setIsFlashbanged] = useState(false)
  const [isRickRolled, setIsRickRolled] = useState(false)
  const [showForgiveButton, setShowForgiveButton] = useState(false)
  const [buttonPos, setButtonPos] = useState({ x: 0, y: 0 })

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
    // 1. Hiệu ứng Flashbang (choáng)
    setIsFlashbanged(true)
    playSound('EXPLOSION')
    
    setTimeout(() => {
      // 2. Sau 5 giây, chuyển sang màn hình Critical Error
      setIsFlashbanged(false)
      setIsDying(true)
      
      // Kích hoạt rung lắc toàn trang
      window.dispatchEvent(new CustomEvent('chaos-mode', { detail: { active: true } }))
    }, 5000)
  }

  const handleReset = () => {
    setIsDying(false)
    setIsRickRolled(false)
    setClickCount(0)
    window.dispatchEvent(new CustomEvent('chaos-mode', { detail: { active: false } }))
  }

  const handleRickRoll = () => {
    setIsRickRolled(true)
    setShowForgiveButton(false)
    setButtonPos({ x: 0, y: 0 })
    
    // Hiện nút "Tha cho tôi" sau 30 giây
    setTimeout(() => {
      setShowForgiveButton(true)
    }, 30000)
  }

  const handleButtonHover = () => {
    if (!showForgiveButton) return
    
    // Di chuyển nút ngẫu nhiên khi hover
    const randomX = Math.random() * 200 - 100 // -100px to 100px
    const randomY = Math.random() * 100 - 50  // -50px to 50px
    setButtonPos({ x: randomX, y: randomY })
  }

  return (
    <div className="fixed bottom-24 right-6 z-[250]">
      {/* Màn hình tối dần theo số lần nhấn */}
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

              {/* QR Code khều donate */}
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
                  <motion.button 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      x: buttonPos.x,
                      y: buttonPos.y
                    }}
                    onMouseEnter={handleButtonHover}
                    onClick={handleReset}
                    className="absolute bottom-6 right-6 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-2xl font-black uppercase tracking-widest transition-all border border-white/20 z-[600]"
                  >
                    Đủ rồi, tha cho tôi!
                  </motion.button>
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

