'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert, RefreshCw } from 'lucide-react'

const TARGET_WORD = 'ROBOT' // Từ khóa: ROBOT (Robot...)
const MAX_ATTEMPTS = 6

export default function CaptchaWordle() {
  const [isActive, setIsActive] = useState(false)
  const [isRickRolled, setIsRickRolled] = useState(false)
  const [attempts, setAttempts] = useState<string[]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing')
  const [message, setMessage] = useState('Xác thực bạn không phải Robot (để tránh bị Hack tiền donate!)')

  const triggerRickroll = () => {
    setGameState('lost')
    setMessage('Bạn là Robot! Đang khởi động giao thức Rickroll...')
    setTimeout(() => {
      setIsRickRolled(true)
    }, 2000)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(true)
    }, 300000) // 5 phút = 300,000ms

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isActive) {
      document.body.classList.add('captcha-active')
    } else {
      document.body.classList.remove('captcha-active')
    }
    return () => {
      document.body.classList.remove('captcha-active')
    }
  }, [isActive])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isActive || gameState !== 'playing') return

    if (e.key === 'Enter') {
      if (currentGuess.length !== 5) {
        setMessage('Vui lòng nhập đủ 5 chữ cái!')
        return
      }

      const newAttempts = [...attempts, currentGuess.toUpperCase()]
      setAttempts(newAttempts)
      setCurrentGuess('')

      if (currentGuess.toUpperCase() === TARGET_WORD) {
        setGameState('won')
        setMessage('Xác thực thành công! Bạn là con người (hoặc Robot rất thông minh).')
        setTimeout(() => setIsActive(false), 2000)
      } else if (newAttempts.length >= MAX_ATTEMPTS) {
        triggerRickroll()
      }
    } else if (e.key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1))
    } else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < 5) {
      setCurrentGuess(prev => prev + e.key.toUpperCase())
    }
  }, [isActive, currentGuess, attempts, gameState])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const getLetterClass = (letter: string, index: number, attempt: string) => {
    if (attempt[index] === TARGET_WORD[index]) return 'bg-emerald-500 border-emerald-600'
    if (TARGET_WORD.includes(attempt[index])) return 'bg-amber-500 border-amber-600'
    return 'bg-slate-500 border-slate-600'
  }

  if (!isActive) return null

  return (
    <div className="fixed inset-0 z-[2000000] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <AnimatePresence>
        {isRickRolled ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="fixed inset-0 z-[2000001] bg-black flex flex-col items-center justify-center p-4"
          >
            <div className="w-full max-w-4xl aspect-video relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/10">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0&disablekb=1" 
                title="Rick Roll" 
                frameBorder="0" 
                allow="autoplay" 
                className="pointer-events-none"
              ></iframe>
            </div>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 5 }}
              onClick={() => {
                setIsRickRolled(false)
                setIsActive(false)
              }}
              className="mt-8 px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-xl font-bold uppercase tracking-widest border border-white/20 transition-all pointer-events-auto"
            >
              Tha cho tôi, tôi sẽ nạp cà phê!
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl max-w-md w-full border-4 border-blue-500/30 space-y-8"
          >
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                  <ShieldAlert size={40} />
                </div>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight">System Captcha</h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm leading-relaxed">
                {message}
              </p>
            </div>

            {/* Wordle Grid */}
            <div className="grid grid-rows-6 gap-2 max-w-[250px] mx-auto">
              {[...Array(MAX_ATTEMPTS)].map((_, i) => (
                <div key={i} className="grid grid-cols-5 gap-2">
                  {[...Array(5)].map((_, j) => {
                    const attempt = attempts[i]
                    const letter = attempt ? attempt[j] : (i === attempts.length ? currentGuess[j] : '')
                    return (
                      <div 
                        key={j}
                        className={`w-10 h-10 md:w-12 md:h-12 border-2 rounded-xl flex items-center justify-center text-xl font-black transition-all duration-500 ${
                          attempt 
                            ? `${getLetterClass(letter, j, attempt)} text-white`
                            : (i === attempts.length && letter ? 'border-blue-500 scale-110' : 'border-slate-200 dark:border-slate-700')
                        }`}
                      >
                        {letter}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>

            <div className="text-center space-y-4">
                {gameState === 'playing' && (
                  <div className="flex items-center justify-center gap-2 text-blue-500 animate-pulse">
                    <RefreshCw size={14} className="animate-spin" />
                    <span className="text-xs font-bold uppercase">Waiting for input...</span>
                  </div>
                )}
            </div>

            {/* Nút thoát giả mạo */}
            <button 
              onClick={triggerRickroll}
              className="w-full py-4 text-slate-400 text-xs font-bold hover:text-red-500 transition-colors uppercase tracking-widest"
            >
              Oke, tôi là Robot! Tôi bị ngoo.
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

