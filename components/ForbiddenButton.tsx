'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertOctagon, Ghost, Trash2, ZapOff } from 'lucide-react'
import { playSound } from '@/lib/sounds'

export default function ForbiddenButton() {
  const [clickCount, setClickCount] = useState(0)
  const [isDying, setIsDying] = useState(false)
  const [isFlashbanged, setIsFlashbanged] = useState(false)

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
      
      setTimeout(() => {
        // 3. Reset hệ thống
        setIsDying(false)
        setClickCount(0)
        window.dispatchEvent(new CustomEvent('chaos-mode', { detail: { active: false } }))
      }, 5000)
    }, 5000)
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
            animate={{ opacity: 1, scale: 2 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-red-600/90 text-white z-[350] pointer-events-none"
          >
            <div className="text-center p-10">
              <ZapOff size={120} className="mx-auto mb-6 animate-bounce" />
              <h1 className="text-6xl font-black mb-4 uppercase">Critical Error</h1>
              <p className="text-2xl font-bold italic">"Lỗi hệ thống: Thiếu cà phê để xử lý sự lì lợm!"</p>
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

