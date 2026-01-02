'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Mosquito {
  id: number
  x: number
  y: number
  rotation: number
  isDead: boolean
  isCaught: boolean
}

export default function MosquitoGame() {
  const [mosquitoes, setMosquitoes] = useState<Mosquito[]>([])
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 })
  const [isPressed, setIsPressed] = useState(false)
  const [isGameActive, setIsGameActive] = useState(false)
  const [isCaptchaActive, setIsCaptchaActive] = useState(false)
  const [score, setScore] = useState(0)

  const buzzAudioRef = useRef<HTMLAudioElement | null>(null)
  const hitAudioRef = useRef<HTMLAudioElement | null>(null)
  const electricAudioRef = useRef<HTMLAudioElement | null>(null)
  const caughtMosquitoIdRef = useRef<number | null>(null)

  // Track captcha state
  useEffect(() => {
    const checkCaptcha = () => {
      setIsCaptchaActive(document.body.classList.contains('captcha-active'))
    }
    
    checkCaptcha()
    const observer = new MutationObserver(checkCaptcha)
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    
    return () => observer.disconnect()
  }, [])

  // Spawning mosquitoes
  useEffect(() => {
    if (!isGameActive) return

    const spawnInitial = () => {
      const initial = Array.from({ length: 5 }).map((_, i) => ({
        id: Date.now() + i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        rotation: Math.random() * 360,
        isDead: false,
        isCaught: false
      }))
      setMosquitoes(initial)
    }

    spawnInitial()

    const spawnInterval = setInterval(() => {
      setMosquitoes(prev => {
        if (prev.filter(m => !m.isDead).length < 8) {
          return [...prev, {
            id: Date.now(),
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            rotation: Math.random() * 360,
            isDead: false,
            isCaught: false
          }]
        }
        return prev
      })
    }, 3000)

    return () => clearInterval(spawnInterval)
  }, [isGameActive])

  // Audio setup
  useEffect(() => {
    buzzAudioRef.current = new Audio('/sounds/Mosquito.m4a')
    buzzAudioRef.current.loop = true
    buzzAudioRef.current.volume = 0.3

    hitAudioRef.current = new Audio('/sounds/muoi.MP3')
    
    electricAudioRef.current = new Audio('/sounds/votmuoi.MP3')
    electricAudioRef.current.loop = true

    return () => {
      buzzAudioRef.current?.pause()
      electricAudioRef.current?.pause()
    }
  }, [])

  // Audio control based on game state
  useEffect(() => {
    if (isGameActive) {
      buzzAudioRef.current?.play().catch(() => {})
      document.body.classList.add('mosquito-game-active')
    } else {
      buzzAudioRef.current?.pause()
      document.body.classList.remove('mosquito-game-active')
    }
    return () => document.body.classList.remove('mosquito-game-active')
  }, [isGameActive])

  // Movement logic
  useEffect(() => {
    if (!isGameActive) return

    const moveInterval = setInterval(() => {
      setMosquitoes(prev => prev.map(m => {
        if (m.isDead || m.isCaught) return m

        // Random jittery movement
        const angle = (Math.random() * Math.PI * 2)
        const dist = 30 + Math.random() * 70
        let nextX = m.x + Math.cos(angle) * dist
        let nextY = m.y + Math.sin(angle) * dist

        // Keep in bounds
        if (nextX < 0 || nextX > window.innerWidth) nextX = m.x - Math.cos(angle) * dist
        if (nextY < 0 || nextY > window.innerHeight) nextY = m.y - Math.sin(angle) * dist

        const dx = nextX - m.x
        const dy = nextY - m.y
        const rotation = Math.atan2(dy, dx) * (180 / Math.PI) + 90

        return { ...m, x: nextX, y: nextY, rotation }
      }))
    }, 150)

    return () => clearInterval(moveInterval)
  }, [isGameActive])

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY })
    
    // If a mosquito is caught, it follows the swatter
    if (caughtMosquitoIdRef.current !== null) {
      setMosquitoes(prev => prev.map(m => 
        m.id === caughtMosquitoIdRef.current 
          ? { ...m, x: e.clientX, y: e.clientY } 
          : m
      ))
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPressed(true)
    if (!isGameActive) return

    // Hit detection (simple radius check)
    const hitRadius = 50
    const hitIndex = mosquitoes.findIndex(m => 
      !m.isDead && !m.isCaught && 
      Math.hypot(m.x - e.clientX, m.y - e.clientY) < hitRadius
    )

    if (hitIndex !== -1) {
      const hitId = mosquitoes[hitIndex].id
      setMosquitoes(prev => prev.map(m => 
        m.id === hitId ? { ...m, isCaught: true } : m
      ))
      caughtMosquitoIdRef.current = hitId
      
      // Play hit sound
      if (hitAudioRef.current) {
        hitAudioRef.current.currentTime = 0
        hitAudioRef.current.play().catch(() => {})
      }

      // Start electric sound while holding
      electricAudioRef.current?.play().catch(() => {})
      setScore(s => s + 1)
    }
  }

  const handleMouseUp = () => {
    setIsPressed(false)
    electricAudioRef.current?.pause()
    
    if (caughtMosquitoIdRef.current !== null) {
      const id = caughtMosquitoIdRef.current
      setMosquitoes(prev => prev.map(m => 
        m.id === id ? { ...m, isCaught: false, isDead: true } : m
      ))
      caughtMosquitoIdRef.current = null
      
      // Remove dead mosquito after a while
      setTimeout(() => {
        setMosquitoes(prev => prev.filter(m => m.id !== id))
      }, 2000)
    }
  }

  return (
    <div 
      className={`fixed inset-0 z-[9999999] overflow-hidden ${isGameActive ? 'cursor-none' : 'pointer-events-none'}`}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* Start Button */}
      {!isGameActive && !isCaptchaActive && (
        <button 
          onClick={(e) => {
            e.stopPropagation()
            setIsGameActive(true)
          }}
          className="pointer-events-auto fixed bottom-[160px] right-6 px-4 py-3 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-2xl hover:bg-red-700 transition-all hover:scale-110 active:scale-95 z-[260] flex items-center gap-2 border-4 border-red-500/20"
        >
          <img src="/images/muoi.png" alt="" className="w-5 h-5 invert brightness-0" />
          CHƠI VỢT MUỖI
        </button>
      )}

      {isGameActive && (
        <>
          {/* Score Display */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-6 py-2 rounded-full font-black text-2xl backdrop-blur-md border-2 border-white/20 select-none">
            DIỆT ĐƯỢC: {score} 🦟
          </div>

          {/* Close Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation()
              setIsGameActive(false)
              setMosquitoes([])
              caughtMosquitoIdRef.current = null
            }}
            className="pointer-events-auto absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-[10000000]"
          >
            ❌
          </button>

          {/* Mosquitoes */}
          <AnimatePresence>
            {mosquitoes.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: m.isDead ? 0.5 : 1, 
                  scale: m.isDead ? 0.8 : 1,
                  x: m.x, 
                  y: m.y,
                  rotate: m.rotation,
                  filter: m.isCaught ? 'brightness(2) drop-shadow(0 0 10px yellow)' : 'none'
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ 
                  x: { type: "spring", stiffness: 100, damping: 10 },
                  y: { type: "spring", stiffness: 100, damping: 10 },
                  rotate: { type: "spring", stiffness: 200, damping: 15 }
                }}
                className="absolute select-none pointer-events-none"
                style={{ 
                  left: 0, 
                  top: 0,
                  transform: 'translate(-50%, -50%)' 
                }}
              >
                <img src="/images/muoi.png" alt="mosquito" className={`w-12 h-12 object-contain ${m.isDead ? 'grayscale' : ''}`} />
                {m.isCaught && (
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 0.1 }}
                    className="absolute inset-0 bg-yellow-400/30 rounded-full blur-xl"
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Swatter Cursor */}
          <motion.div
            className="fixed pointer-events-none select-none z-10"
            animate={{ 
              x: mousePos.x, 
              y: mousePos.y,
              rotate: isPressed ? -20 : 0,
              scale: isPressed ? 0.9 : 1
            }}
            transition={{
              x: { type: "spring", stiffness: 1000, damping: 50 },
              y: { type: "spring", stiffness: 1000, damping: 50 },
              rotate: { type: "spring", stiffness: 300, damping: 15 }
            }}
            style={{ 
              left: 0, 
              top: 0,
              x: '-50%',
              y: '-50%'
            }}
          >
            <img src="/images/votmuoi.png" alt="swatter" className="w-48 h-48 object-contain" />
          </motion.div>
        </>
      )}

    </div>
  )
}

