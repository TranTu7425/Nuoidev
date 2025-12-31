'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertOctagon, Ghost, Trash2, ZapOff } from 'lucide-react'

export default function ForbiddenButton() {
  const [clickCount, setClickCount] = useState(0)
  const [isDying, setIsDying] = useState(false)

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
      triggerCatastrophe()
      return
    }
    setClickCount(prev => prev + 1)
  }

  const triggerCatastrophe = () => {
    setIsDying(true)
    // Kích hoạt rung lắc toàn trang
    window.dispatchEvent(new CustomEvent('chaos-mode', { detail: { active: true } }))
    
    setTimeout(() => {
      setIsDying(false)
      setClickCount(0)
      window.dispatchEvent(new CustomEvent('chaos-mode', { detail: { active: false } }))
    }, 5000)
  }

  return (
    <div className="fixed bottom-24 right-6 z-[100]">
      <AnimatePresence>
        {isDying && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 2 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-red-600/90 text-white z-[200] pointer-events-none"
          >
            <div className="text-center p-10">
              <ZapOff size={120} className="mx-auto mb-6 animate-bounce" />
              <h1 className="text-6xl font-black mb-4">CRITICAL ERROR</h1>
              <p className="text-2xl font-bold italic">"Lỗi hệ thống: Thiếu cà phê để xử lý sự lì lợm!"</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9, rotate: -5 }}
        onClick={handleClick}
        className={`px-6 py-4 rounded-2xl shadow-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-colors ${
          clickCount > 5 ? 'bg-red-600 text-white animate-pulse' : 'bg-white dark:bg-slate-800 text-red-600 border-4 border-red-600'
        }`}
      >
        {clickCount > 5 ? <AlertOctagon size={20} /> : <Ghost size={20} />}
        {messages[clickCount]}
      </motion.button>
    </div>
  )
}

