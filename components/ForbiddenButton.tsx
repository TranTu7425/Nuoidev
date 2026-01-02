'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertOctagon, Ghost, Trash2, ZapOff, RefreshCcw, X, ImageIcon, Trophy, Heart } from 'lucide-react'
import { playSound } from '@/lib/sounds'
import Image from 'next/image'

export default function ForbiddenButton() {
  const [clickCount, setClickCount] = useState(0)
  const [isDying, setIsDying] = useState(false)
  const [isFlashbanged, setIsFlashbanged] = useState(false)
  const [isRickRolled, setIsRickRolled] = useState(false)
  const [showForgiveButton, setShowForgiveButton] = useState(false)
  const [cornerIndex, setCornerIndex] = useState(-1)
  const [isPlayingGame, setIsPlayingGame] = useState(false)
  const [gameScore, setGameScore] = useState(0)
  const [showSkipButton, setShowSkipButton] = useState(false)
  const [isFinalScreen, setIsFinalScreen] = useState(false)
  const [skipButtonPos, setSkipButtonPos] = useState({ x: 0, y: 0 })

  const handleRickRoll = useCallback(() => {
    if (isRickRolled) return
    setIsRickRolled(true)
    setShowForgiveButton(false)
    setCornerIndex(-1)
    
    // Thông báo cho Clippy
    window.dispatchEvent(new CustomEvent('rick-roll-active'))
    
    setTimeout(() => {
      setShowForgiveButton(true)
    }, 30000)
  }, [isRickRolled])

  const handleShowFinalScreen = useCallback(() => {
    setIsDying(false)
    setIsRickRolled(false)
    setIsPlayingGame(false)
    setIsFinalScreen(true)
    
    // Tự động đóng sau 15 giây
    setTimeout(() => {
      handleCompleteReset()
    }, 15000)
  }, [])

  const handleCompleteReset = useCallback(() => {
    setIsFinalScreen(false)
    setIsDying(false)
    setIsRickRolled(false)
    setIsPlayingGame(false)
    setGameScore(0)
    setClickCount(0)
    setShowSkipButton(false)
    window.dispatchEvent(new CustomEvent('chaos-mode', { detail: { active: false } }))
  }, [])

  // Timer cho nút "Tha" trong lúc chơi game (1 phút)
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlayingGame) {
      timer = setTimeout(() => {
        setShowSkipButton(true)
      }, 60000)
    }
    return () => clearTimeout(timer)
  }, [isPlayingGame])

  const handleSkipButtonHover = () => {
    // Di chuyển nút "Tha" khi hover để tăng độ nhây
    const randomX = Math.random() * 200 - 100
    const randomY = Math.random() * 100 - 50
    setSkipButtonPos({ x: randomX, y: randomY })
  }

  // INSPECT TRAP
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInspectKey = e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || (e.metaKey && e.altKey && e.key === 'i')
      if (isInspectKey) { e.preventDefault(); handleRickRoll(); }
    }
    const handleResize = () => {
      if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) handleRickRoll()
    }
    const devtoolsDetector = () => {
      const start = Date.now()
      // eslint-disable-next-line no-debugger
      debugger
      if (Date.now() - start > 100) handleRickRoll()
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isRickRolled || isDying || isPlayingGame || isFinalScreen) {
        e.preventDefault()
        e.returnValue = 'Bạn không thể thoát dễ dàng thế đâu! Muahaha!'
        return e.returnValue
      }
    }

    const preventReload = (e: KeyboardEvent) => {
      if ((isRickRolled || isDying || isPlayingGame || isFinalScreen) && 
          (e.key === 'F5' || (e.ctrlKey && e.key === 'r') || (e.metaKey && e.key === 'r'))) {
        e.preventDefault()
        playSound('ALERT')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keydown', preventReload)
    window.addEventListener('resize', handleResize)
    window.addEventListener('beforeunload', handleBeforeUnload)
    const interval = setInterval(devtoolsDetector, 2000)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keydown', preventReload)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      clearInterval(interval)
    }
  }, [handleRickRoll, isRickRolled, isDying, isPlayingGame, isFinalScreen])

  const messages = [
    "CẤM NHẤN!", "Đã bảo là cấm mà!", "Vẫn nhấn à? Lì thế?", "Này... đừng phá nữa!",
    "Dev đang ngủ, đừng làm ồn!", "Hỏng web bây giờ đó!!!", "Cảnh báo cấp độ 1...",
    "Cảnh báo cấp độ 2...", "CHÚC MỪNG BẠN ĐÃ PHÁ HỎNG WEB!",
  ]

  const triggerCatastrophe = () => {
    setIsFlashbanged(true)
    playSound('EXPLOSION')
    setTimeout(() => {
      setIsFlashbanged(false)
      setIsDying(true)
      document.body.classList.add('bsod-active')
      window.dispatchEvent(new CustomEvent('chaos-mode', { detail: { active: true } }))
    }, 5000)
  }

  const handleButtonHover = () => {
    if (!showForgiveButton || cornerIndex >= 3) return
    setCornerIndex(prev => prev + 1)
  }

  const handleResetWithClass = () => {
    document.body.classList.remove('bsod-active')
    handleCompleteReset()
  }

  return (
    <div className="fixed bottom-24 right-6 z-[250]">
      {!isDying && !isFlashbanged && !isFinalScreen && clickCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: (clickCount / (messages.length - 1)) * 0.9 }}
          className="fixed inset-0 bg-black z-[240] pointer-events-none"
        />
      )}

      <AnimatePresence>
        {isFlashbanged && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-white z-[400] pointer-events-none" />
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
                <p className="text-xl font-bold italic opacity-90">"Hệ thống sụp đổ vì bạn. Nạp cà phê hoặc giải đố để khôi phục!"</p>
              </div>
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="bg-white p-4 rounded-[2rem] shadow-2xl inline-block">
                <div className="relative w-48 h-48 mx-auto overflow-hidden rounded-xl">
                  <Image src="https://qr.sepay.vn/img?acc=96247RDFO9&bank=BIDV" alt="Donate" fill unoptimized className="object-cover" />
                </div>
                <p className="text-slate-900 font-black text-xs mt-3 uppercase tracking-widest">Inject Cafe ☕️</p>
              </motion.div>
              <div className="flex flex-col gap-4">
                <button onClick={handleResetWithClass} className="w-full py-4 bg-white text-red-600 rounded-2xl font-black text-lg shadow-xl">Tôi sẽ nạp ngay!</button>
                <button onClick={handleRickRoll} className="w-full py-3 bg-red-700/50 rounded-xl font-bold text-sm">Xem giải pháp triệt để</button>
              </div>
            </div>
          </motion.div>
        )}

        {isRickRolled && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] bg-black flex items-center justify-center">
            <div className={`w-full max-w-4xl aspect-video relative rounded-[2rem] overflow-hidden shadow-2xl ${isPlayingGame ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <iframe width="100%" height="100%" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0&disablekb=1" title="Rick Roll" frameBorder="0" allow="autoplay" className="pointer-events-none"></iframe>
            </div>

            <AnimatePresence>
              {showForgiveButton && !isPlayingGame && (
                <div 
                  className="fixed z-[600]"
                  style={{
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    ...(cornerIndex === -1 ? { bottom: '2rem', right: '2rem' } :
                       cornerIndex === 0 ? { top: '2rem', left: '2rem' } :
                       cornerIndex === 1 ? { top: '2rem', right: '2rem' } :
                       cornerIndex === 2 ? { bottom: '2rem', left: '2rem' } :
                       { bottom: '2rem', right: '2rem' })
                  }}
                >
                  <div className="p-12 -m-12 cursor-pointer" onMouseEnter={handleButtonHover}>
                    <motion.button 
                      initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                      onClick={() => { if (cornerIndex === 3) setIsPlayingGame(true) }}
                      className={`px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-2xl font-black uppercase tracking-widest border border-white/20 whitespace-nowrap ${cornerIndex < 3 ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      {cornerIndex < 3 ? 'Đang cố tha...' : 'Đủ rồi, tha cho tôi!'}
                    </motion.button>
                  </div>
                </div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isPlayingGame && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[700] flex flex-col items-center justify-center bg-blue-400/90 backdrop-blur-md text-white">
                  <div className="mb-8 text-center">
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Thử thách Flappy Dev</h2>
                    <p className="font-bold opacity-80 uppercase tracking-widest text-xs">Phải đạt 20 điểm để được thoát!</p>
                    <div className="flex items-center justify-center gap-4 mt-4 bg-white/20 px-6 py-2 rounded-full">
                      <Trophy className="text-yellow-300" />
                      <span className="text-3xl font-black">{gameScore} / 20</span>
                    </div>
                  </div>
                  <FlappyGame onWin={handleShowFinalScreen} onScoreUpdate={setGameScore} />
                  
                  {/* Nút "Tha" hiện sau 1 phút */}
                  {showSkipButton && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1, x: skipButtonPos.x, y: skipButtonPos.y }}
                      onMouseEnter={handleSkipButtonHover}
                      onClick={handleShowFinalScreen}
                      className="mt-8 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-xl font-bold uppercase tracking-widest border border-white/20 transition-all"
                    >
                      Tha
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* MÀN HÌNH CUỐI CÙNG: QUÝ LẮM MỚI THA CHO ĐÓ */}
        {isFinalScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[800] bg-emerald-600 flex items-center justify-center text-white"
          >
            <div className="text-center space-y-8 p-6">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Heart size={80} fill="currentColor" className="mx-auto text-red-300" />
              </motion.div>
              
              <div className="space-y-2">
                <h2 className="text-5xl font-black uppercase tracking-tighter">Quý lắm mới tha cho đó!</h2>
                <p className="text-xl font-bold opacity-90 italic">"Lần sau đừng có mà lì lợm nữa nghe chưa :P"</p>
              </div>

              <div className="bg-white p-6 rounded-[3rem] shadow-2xl inline-block relative overflow-hidden group">
                <div className="relative w-64 h-64 mx-auto rounded-2xl overflow-hidden">
                  <Image src="https://qr.sepay.vn/img?acc=96247RDFO9&bank=BIDV" alt="QR Donate" fill unoptimized className="object-cover" />
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-slate-900 font-black text-sm uppercase tracking-widest">Mời Dev ly Cafe tri ân ☕️</p>
                  <p className="text-slate-400 text-[10px] font-bold">Màn hình sẽ tự đóng sau vài giây...</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9, rotate: -5 }}
        onClick={() => { if (clickCount >= messages.length - 1) triggerCatastrophe(); else { playSound('CLICK'); setClickCount(c => c + 1); } }}
        className={`px-6 py-4 rounded-2xl shadow-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-colors relative z-[260] ${clickCount > 5 ? 'bg-red-600 text-white animate-pulse' : 'bg-white dark:bg-slate-800 text-red-600 border-4 border-red-600'}`}
      >
        {clickCount > 5 ? <AlertOctagon size={20} /> : <Ghost size={20} />}
        {messages[clickCount]}
      </motion.button>
    </div>
  )
}

// --- MINI GAME COMPONENT ---
function FlappyGame({ onWin, onScoreUpdate }: { onWin: () => void, onScoreUpdate: (s: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameOver, setGameOver] = useState(false)
  const scoreRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let birdY = canvas.height / 2
    let birdVelocity = 0
    let pipes: any[] = []
    let frame = 0

    const gravity = 0.35
    const jump = -6.5

    const resetGame = () => {
      birdY = canvas.height / 2
      birdVelocity = 0
      pipes = []
      scoreRef.current = 0
      onScoreUpdate(0)
      setGameOver(false)
    }

    const handleClick = () => {
      if (gameOver) resetGame()
      else birdVelocity = jump
    }

    window.addEventListener('keydown', (e) => { if (e.code === 'Space') handleClick() })
    canvas.addEventListener('mousedown', handleClick)

    const loop = () => {
      if (gameOver) return
      
      birdVelocity += gravity
      birdY += birdVelocity
      frame++

      if (frame % 100 === 0) {
        const gap = 150
        const minHeight = 50
        const height = Math.random() * (canvas.height - gap - minHeight * 2) + minHeight
        pipes.push({ x: canvas.width, y: height, gap, passed: false })
      }

      pipes.forEach(p => p.x -= 2.2)
      pipes = pipes.filter(p => p.x + 50 > 0)

      if (birdY < 0 || birdY + 30 > canvas.height) setGameOver(true)
      pipes.forEach(p => {
        if (p.x < 100 && p.x + 50 > 50) {
          if (birdY < p.y || birdY + 30 > p.y + p.gap) setGameOver(true)
        }
        if (!p.passed && p.x < 50) {
          p.passed = true
          scoreRef.current++
          onScoreUpdate(scoreRef.current)
          if (scoreRef.current >= 20) onWin()
        }
      })

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#facc15'
      ctx.beginPath()
      ctx.arc(75, birdY + 15, 15, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.fillStyle = '#22c55e'
      pipes.forEach(p => {
        ctx.fillRect(p.x, 0, 50, p.y)
        ctx.fillRect(p.x, p.y + p.gap, 50, canvas.height)
      })

      animationId = requestAnimationFrame(loop)
    }

    loop()
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('keydown', handleClick)
    }
  }, [gameOver, onWin, onScoreUpdate])

  return (
    <div className="relative">
      <canvas ref={canvasRef} width={400} height={500} className="bg-sky-300 rounded-3xl shadow-2xl border-8 border-white cursor-pointer" />
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-2xl text-white">
          <p className="text-2xl font-black mb-4">THUA RỒI!</p>
          <button onClick={() => setGameOver(false)} className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-full">Chơi lại</button>
        </div>
      )}
      <p className="text-center mt-4 text-xs font-bold opacity-60">NHẤN SPACE HOẶC CLICK ĐỂ NHẢY</p>
    </div>
  )
}
