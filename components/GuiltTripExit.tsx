'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, X, AlertCircle } from 'lucide-react'

export default function GuiltTripExit() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Chỉ hiện khi chuột di chuyển lên phía trên (thường là để tắt tab/đổi URL)
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true)
        setHasShown(true)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [hasShown])

  const handleDonate = () => {
    setIsVisible(false)
    const donateSection = document.getElementById('donate')
    if (donateSection) {
      donateSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[2000000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative max-w-md w-full bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-2xl border-4 border-blue-500/20 text-center space-y-6"
          >
            {/* Close button - also guilt tripping */}
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition-colors"
              title="Nhẫn tâm thế..."
            >
              <X size={24} />
            </button>

            {/* Character/Emoji */}
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [-2, 2, -2]
              }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-8xl select-none"
            >
              😿
            </motion.div>

            <div className="space-y-4">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
                Bạn đi thật sao?
              </h2>
              <p className="text-lg font-bold text-slate-600 dark:text-slate-400 italic leading-relaxed">
                {"\"Dev vừa mới bóc gói mì tôm cuối cùng... Thôi bạn đi đi, mình không sao đâu, mình quen với cái đói rồi...\""}
              </p>
              <p className="text-xs font-black text-blue-500 uppercase tracking-widest flex items-center justify-center gap-2">
                Cảnh báo: Rời đi có thể gây cắn rứt lương tâm nhẹ
              </p>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDonate}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3"
              >
                 TÔI THẤY HỐI LỖI (DONATE NGAY)
              </motion.button>
              
              <button
                onClick={() => setIsVisible(false)}
                className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-xl font-bold text-sm hover:text-red-500 transition-colors"
              >
                TÔI LÀ NGƯỜI MÁU LẠNH (TẮT TRANG)
              </button>
            </div>

            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-full text-white/20 font-black text-4xl uppercase pointer-events-none select-none">
              PLEASE STAY
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

