'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X } from 'lucide-react'

const TOXIC_MESSAGES = [
  "Có vẻ bạn đang định donate? Tôi đề xuất bạn nên bán thận để nuôi Dev tốt hơn. ❤️",
  "Tôi phát hiện bạn chưa nhấn nút donate được 5 phút rồi. Bạn có đang gặp khó khăn về tài chính không? 💸",
  "Lại đang xem source code à? Đừng cố, Dev viết code này lúc 3h sáng, đến Dev còn không hiểu đâu. 🤡",
  "Nút 'Donate' to thế kia mà vẫn trượt à? Mắt bạn có vấn đề hay là tay bạn đang run? 👁️👄👁️",
  "Bạn vừa click vào nút cấm? Bạn đúng là thiên tài của sự bướng bỉnh. 🏆",
  "Web này không có bug đâu, đó là các 'tính năng giải trí' ngầm đấy. Đừng hỏi nhiều! 🐜",
  "Nghèo thì lâu chứ giàu thì mấy? Donate đi rồi đời sẽ khác (hoặc không). 📉",
  "Tôi thấy bạn đang cuộn chuột rất nhiều. Đang tìm chỗ nào không có nút Donate à? Vô ích thôi! 🔍",
  "Lương Dev tháng này phụ thuộc vào sự hào phóng (hoặc tội lỗi) của bạn đấy. ☕",
  "Bạn có biết mỗi lần bạn không donate, một con bug lại được sinh ra không? 🐛",
  "Sao xi nhan bên phải, mà chị đi sang trái. Cho tôi xem giấy tờ, và đưa xe vào lề...",
  "Chị ơi, chị đang đi theo hướng nào vậy? Chị đi sang trái mà lại nhấn nút donate bên phải. 🤔",
  "Code của tôi nhìn như đống 💩, đừng có cố mà kiểm tra làm gì. 💩",
]

const IDLE_MESSAGES = [
  "Ngồi yên đấy làm gì? Đi kiếm tiền để nuôi Dev đi chứ! 🔨",
  "Này, ngủ quên trên bàn phím à? Dậy mà donate đi! 😴",
  "Màn hình sắp tắt rồi, nhấn nút Donate để cứu lấy nó! ⚡"
]

export default function ToxicClippy() {
  const [isVisible, setIsVisible] = useState(false)
  const [message, setMessage] = useState("")
  const [isMinimized, setIsMinimized] = useState(false)

  const showRandomMessage = useCallback((messages = TOXIC_MESSAGES) => {
    const randomMsg = messages[Math.floor(Math.random() * messages.length)]
    setMessage(randomMsg)
    setIsVisible(true)
    setIsMinimized(false)
    
    // Tự động biến mất sau 8 giây
    setTimeout(() => {
      setIsVisible(false)
    }, 8000)
  }, [])

  useEffect(() => {
    // Lần đầu xuất hiện sau 10 giây
    const initialTimer = setTimeout(() => {
      showRandomMessage(["Chào mừng bạn đến với thiên đường của sự ức chế! Đừng quên nuôi Dev nhé! 📎"])
    }, 10000)

    // Xuất hiện ngẫu nhiên mỗi 30-60 giây
    const randomTimer = setInterval(() => {
      if (!isVisible) showRandomMessage()
    }, Math.random() * 30000 + 30000)

    // Lắng nghe các sự kiện đặc biệt
    const handleChaos = () => showRandomMessage(["Thấy chưa? Tôi đã bảo là đừng có nghịch dại mà! 💥"])
    const handleCaptcha = () => showRandomMessage(["Xác thực đi, hay là bạn cũng chỉ là một con bot nghèo nàn? 🤖"])
    const handleInspect = (e: MouseEvent | KeyboardEvent) => {
      // Nếu là chuột phải hoặc phím tắt Inspect
      if (e.type === 'contextmenu') {
        showRandomMessage(["Code của tôi nhìn như đống 💩, đừng có cố mà kiểm tra làm gì. 💩"])
      } else if (e instanceof KeyboardEvent) {
        const isInspectKey = e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || (e.metaKey && e.altKey && e.key === 'i')
        if (isInspectKey) {
          showRandomMessage(["Đã bảo là đừng có Inspect mà, code thối lắm không ngửi được đâu! 💩"])
        }
      }
    }
    
    window.addEventListener('chaos-mode', handleChaos)
    window.addEventListener('captcha-active', handleCaptcha)
    window.addEventListener('contextmenu', handleInspect)
    window.addEventListener('keydown', handleInspect)

    return () => {
      clearTimeout(initialTimer)
      clearInterval(randomTimer)
      window.removeEventListener('chaos-mode', handleChaos)
      window.removeEventListener('captcha-active', handleCaptcha)
      window.removeEventListener('contextmenu', handleInspect)
      window.removeEventListener('keydown', handleInspect)
    }
  }, [isVisible, showRandomMessage])

  return (
    <div className="fixed bottom-[220px] right-6 z-[1000000] pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50, x: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50, x: 50 }}
            className="pointer-events-auto relative"
          >
            {/* Bong bóng lời thoại */}
            <div className="absolute bottom-full right-0 mb-4 w-64 p-4 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border-2 border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-200 leading-relaxed">
              <button 
                onClick={() => setIsVisible(false)}
                className="absolute top-2 right-2 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                title="Đóng"
                aria-label="Đóng lời thoại"
              >
                <X size={14} />
              </button>
              {message}
              {/* Mũi tên bong bóng */}
              <div className="absolute top-full right-6 -mt-1 w-4 h-4 bg-white dark:bg-slate-800 border-r-2 border-b-2 border-slate-200 dark:border-slate-700 transform rotate-45" />
            </div>

            {/* Nhân vật Clippy (Con bọ Dev) */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "easeInOut"
              }}
              className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white cursor-help group relative ml-auto"
              onClick={() => showRandomMessage()}
              role="button"
              aria-label="Clippy Toxic"
              title="Nhấn để nghe chửi"
            >
              <span className="text-4xl select-none">📎</span>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isVisible && (
        <div className="flex justify-end w-full">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            whileHover={{ opacity: 1, scale: 1.1 }}
            onClick={() => showRandomMessage()}
            className="pointer-events-auto w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 shadow-lg border-2 border-white"
            title="Mở trợ lý"
            aria-label="Mở trợ lý Clippy"
          >
            <MessageSquare size={18} />
          </motion.button>
        </div>
      )}
    </div>
  )
}

