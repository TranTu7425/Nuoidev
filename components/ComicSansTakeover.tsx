'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

export default function ComicSansTakeover() {
  const [isActive, setIsActive] = useState(false)
  const [showNotification, setShowNotification] = useState(false)

  const triggerTakeover = useCallback(() => {
    if (isActive) return
    setIsActive(true)
    setShowNotification(true)
    
    // Tự động ẩn thông báo sau 5 giây, nhưng font vẫn giữ nguyên
    setTimeout(() => {
      setShowNotification(false)
    }, 5000)
  }, [isActive])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    
    const resetTimer = () => {
      if (isActive) return
      clearTimeout(timeout)
      // Kích hoạt sau 45 giây không hoạt động
      timeout = setTimeout(triggerTakeover, 120000)
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']
    events.forEach(event => window.addEventListener(event, resetTimer))
    
    const handleSecretKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.altKey && e.key.toLowerCase() === 'c') {
        triggerTakeover()
      }
    }
    window.addEventListener('keydown', handleSecretKey)
    
    resetTimer()

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer))
      window.removeEventListener('keydown', handleSecretKey)
      clearTimeout(timeout)
    }
  }, [isActive, triggerTakeover])

  return (
    <>
      <AnimatePresence>
        {isActive && (
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes rainbow-text {
              0% { color: #ff0000; }
              17% { color: #ff00ff; }
              33% { color: #0000ff; }
              50% { color: #00ffff; }
              66% { color: #00ff00; }
              83% { color: #ffff00; }
              100% { color: #ff0000; }
            }

            @keyframes rainbow-bg {
              0% { background-color: #000080; }
              25% { background-color: #800000; }
              50% { background-color: #004d00; }
              75% { background-color: #4b0082; }
              100% { background-color: #000080; }
            }

            @keyframes shake {
              0% { transform: translate(0, 0) rotate(0deg); }
              25% { transform: translate(2px, 2px) rotate(1deg); }
              50% { transform: translate(-2px, -2px) rotate(-1deg); }
              75% { transform: translate(2px, -2px) rotate(1deg); }
              100% { transform: translate(0, 0) rotate(0deg); }
            }

            * {
              font-family: "Comic Sans MS", "Comic Sans", "Chalkboard SE", "Comic Neue", cursive !important;
              transition: background-color 0.5s linear, color 0.5s linear !important;
            }
            
            h1, h2, h3, h4, h5, h6 {
              animation: rainbow-text 2s infinite linear, shake 0.2s infinite !important;
              text-shadow: 4px 4px #ff00ff, -4px -4px #00ffff !important;
            }

            p, span, div, li, a, button {
              animation: rainbow-text 3s infinite linear !important;
              font-weight: 900 !important;
            }

            .gradient-text {
              background: none !important;
              -webkit-text-fill-color: initial !important;
              animation: rainbow-text 3s infinite linear !important;
            }

            body {
              animation: rainbow-bg 5s infinite alternate !important;
            }

            .glass-card {
              background: rgba(255, 255, 255, 0.3) !important;
              border: 10px double #ff00ff !important;
              animation: shake 5s infinite !important;
            }

            img, svg {
              filter: hue-rotate(90deg) saturate(500%) !important;
              animation: shake 5s infinite !important;
            }
          ` }} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ y: -100, x: '-50%', opacity: 0 }}
            animate={{ y: 20, x: '-50%', opacity: 1 }}
            exit={{ y: -100, x: '-50%', opacity: 0 }}
            className="fixed top-0 left-1/2 z-[1000000] bg-yellow-400 text-black px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-4 border-black font-bold"
            style={{ fontFamily: '"Comic Sans MS", cursive' }}
          >
            <AlertTriangle className="animate-bounce" />
            <div>
              <p className="text-lg uppercase">System Update!</p>
              <p className="text-sm">Giao diện đã được tối ưu hóa theo yêu cầu của PO (Product Owner)!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

