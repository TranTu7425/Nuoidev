'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TrailItem {
  id: number
  x: number
  y: number
}

interface Fly {
  id: number
  x: number
  y: number
  rotation: number
  isTargeting: boolean
}

export default function PoopCursor() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 })
  const [isPressed, setIsPressed] = useState(false)
  const [isCaptchaActive, setIsCaptchaActive] = useState(false)
  const [isIdle, setIsIdle] = useState(false)
  const [trail, setTrail] = useState<TrailItem[]>([])
  const [flies, setFlies] = useState<Fly[]>([])
  
  const trailIdRef = useRef(0)
  const lastPosRef = useRef({ x: 0, y: 0 })
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const clickAudioRef = useRef<HTMLAudioElement | null>(null)
  const holdAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Khởi tạo âm thanh ruồi
    audioRef.current = new Audio('/sounds/fly.m4a')
    audioRef.current.loop = true
    audioRef.current.volume = 0.5

    // Khởi tạo âm thanh nhấn chuột
    clickAudioRef.current = new Audio('/sounds/poop.MP3')
    holdAudioRef.current = new Audio('/sounds/fart1.MP3')
    holdAudioRef.current.loop = true

    return () => {
      audioRef.current?.pause()
      clickAudioRef.current?.pause()
      holdAudioRef.current?.pause()
      audioRef.current = null
      clickAudioRef.current = null
      holdAudioRef.current = null
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (isIdle && !isCaptchaActive) {
      audioRef.current?.play().catch(() => {})
    } else {
      audioRef.current?.pause()
      if (audioRef.current) audioRef.current.currentTime = 0
    }
  }, [isIdle, isCaptchaActive])

  useEffect(() => {
    const startIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(() => {
        setIsIdle(true)
      }, 30000) // 30 giây
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
      setIsIdle(false)
      startIdleTimer()
      
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

    const handleMouseDown = () => {
      setIsPressed(true)
      setIsIdle(false)
      startIdleTimer()

      // Phát âm thanh click ngay lập tức
      if (clickAudioRef.current) {
        clickAudioRef.current.currentTime = 0
        clickAudioRef.current.play().catch(() => {})
      }
      
      // Đợi 200ms, nếu vẫn đang giữ chuột thì mới phát tiếng fart1
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current)
      holdTimerRef.current = setTimeout(() => {
        if (holdAudioRef.current) {
          holdAudioRef.current.currentTime = 0
          holdAudioRef.current.play().catch(() => {})
        }
      }, 200) // Trễ 200ms để phân biệt giữa click nhanh và nhấn giữ
    }
    
    const handleMouseUp = () => {
      setIsPressed(false)
      
      // Hủy timer chờ nếu người dùng thả chuột sớm
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current)
      }

      // Dừng âm thanh giữ
      if (holdAudioRef.current) {
        holdAudioRef.current.pause()
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    startIdleTimer()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [])

  // Xử lý logic đàn ruồi khi idle
  useEffect(() => {
    if (!isIdle) {
      setFlies([])
      return
    }

    // Tạo đàn ruồi ban đầu
    const initialFlies: Fly[] = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      rotation: Math.random() * 360,
      isTargeting: i < 5
    }))
    setFlies(initialFlies)

    const moveFlies = () => {
      setFlies(prev => prev.map(fly => {
        let nextX, nextY
        
        if (fly.isTargeting) {
          // Bay quanh cursor: giật giật mạnh và gần
          nextX = mousePos.x + (Math.random() - 0.5) * 100
          nextY = mousePos.y + (Math.random() - 0.5) * 100
        } else {
          // Bay tự do: Di chuyển từng đoạn ngắn ngẫu nhiên (Brownian-ish)
          const angle = (Math.random() * Math.PI * 2)
          const dist = 50 + Math.random() * 150
          nextX = fly.x + Math.cos(angle) * dist
          nextY = fly.y + Math.sin(angle) * dist

          // Giới hạn trong màn hình (bật lại nếu chạm biên)
          if (nextX < 0 || nextX > window.innerWidth) nextX = fly.x - Math.cos(angle) * dist
          if (nextY < 0 || nextY > window.innerHeight) nextY = fly.y - Math.sin(angle) * dist
        }

        // Tính góc xoay để hướng đầu về phía di chuyển
        const dx = nextX - fly.x
        const dy = nextY - fly.y
        const rotation = Math.atan2(dy, dx) * (180 / Math.PI) + 90 // +90 vì ảnh ruồi thường hướng lên

        return { ...fly, x: nextX, y: nextY, rotation }
      }))
    }

    // Interval ngắn hơn để tạo cảm giác linh hoạt (200-500ms)
    const interval = setInterval(moveFlies, 300)
    return () => clearInterval(interval)
  }, [isIdle, mousePos])

  return (
    <div className={`fixed inset-0 pointer-events-none z-[9000000] overflow-hidden ${isCaptchaActive ? 'hidden' : ''}`}>
      {/* Con trỏ chính */}
      <motion.div 
        className="fixed text-3xl select-none origin-center z-10"
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

      {/* Đàn ruồi khi idle */}
      <AnimatePresence>
        {isIdle && flies.map((fly) => (
          <motion.div
            key={fly.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: fly.x, 
              y: fly.y,
              rotate: fly.rotation
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              x: { type: "spring", stiffness: 200, damping: 15 },
              y: { type: "spring", stiffness: 200, damping: 15 },
              rotate: { type: "spring", stiffness: 300, damping: 20 },
              opacity: { duration: 0.5 }
            }}
            className="absolute select-none"
            style={{ 
              left: 0, 
              top: 0,
              transform: 'translate(-50%, -50%)' 
            }}
          >
            <img src="/images/fly.png" alt="fly" className="w-8 h-8 object-contain" />
          </motion.div>
        ))}
      </AnimatePresence>

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

