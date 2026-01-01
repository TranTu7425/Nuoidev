'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TrailItem {
  id: number
  x: number
  y: number
}

export default function PoopCursor() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 })
  const [isPressed, setIsPressed] = useState(false)
  const [isCaptchaActive, setIsCaptchaActive] = useState(false)
  const [trail, setTrail] = useState<TrailItem[]>([])
  const trailIdRef = useRef(0)
  const lastPosRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
      
      // Kiểm tra xem captcha có đang hoạt động không (qua class trên body)
      const isCaptcha = document.body.classList.contains('captcha-active')
      setIsCaptchaActive(isCaptcha)

      if (isCaptcha) return // Không rơi phân khi đang xác thực captcha
      
      // Tính khoảng cách di chuyển từ lần cuối rơi phân
      const dist = Math.hypot(e.clientX - lastPosRef.current.x, e.clientY - lastPosRef.current.y)
      
      // Chỉ rơi phân nếu di chuyển đủ xa (ví dụ 100px) để giảm lag
      if (dist > 100) {
        const newItem: TrailItem = {
          id: trailIdRef.current++,
          x: e.clientX,
          y: e.clientY
        }
        
        setTrail(prev => [...prev.slice(-1), newItem]) 
        lastPosRef.current = { x: e.clientX, y: e.clientY }
      }
    }

    const handleMouseDown = () => setIsPressed(true)
    const handleMouseUp = () => setIsPressed(false)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return (
    <div className={`fixed inset-0 pointer-events-none z-[9000000] overflow-hidden ${isCaptchaActive ? 'hidden' : ''}`}>
      {/* Con trỏ chính */}
      <motion.div 
        className="fixed text-3xl select-none origin-center"
        animate={{ 
          x: mousePos.x, 
          y: mousePos.y,
          scale: isPressed ? 3 : 1,
          rotate: isPressed ? [0, -10, 10, -10, 0] : 0
        }}
        transition={{
          x: { type: "spring", stiffness: 1000, damping: 50 },
          y: { type: "spring", stiffness: 1000, damping: 50 },
          scale: { type: "spring", stiffness: 300, damping: 20 },
          rotate: { repeat: isPressed ? Infinity : 0, duration: 0.5 }
        }}
        style={{ 
          left: 0, 
          top: 0,
          x: '-50%',
          y: '-50%'
        }}
      >
        💩
      </motion.div>

      {/* Hiệu ứng rơi vãi (Trail) */}
      <AnimatePresence>
        {trail.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 1, y: item.y, x: item.x, scale: 1 }}
            animate={{ 
              opacity: 0, 
              y: item.y + 100 + Math.random() * 50, // Rơi xuống
              x: item.x + (Math.random() - 0.5) * 50, // Lệch trái/phải một chút
              scale: 0.5,
              rotate: Math.random() * 360
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute text-xl select-none"
            style={{ 
              left: 0, 
              top: 0,
              transform: 'translate(-50%, -50%)' 
            }}
          >
            💩
          </motion.div>
        ))}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        body:not(.captcha-active), 
        body:not(.captcha-active) a, 
        body:not(.captcha-active) button, 
        body:not(.captcha-active) input, 
        body:not(.captcha-active) select, 
        body:not(.captcha-active) textarea, 
        body:not(.captcha-active) [role="button"] {
          cursor: none !important;
        }
        
        .captcha-active {
          cursor: default !important;
        }
        .captcha-active a, .captcha-active button {
          cursor: pointer !important;
        }
      ` }} />
    </div>
  )
}

