'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playSound } from '@/lib/sounds'
import Image from 'next/image'

interface Crack {
  id: number
  x: number
  y: number
  rotation: number
  scale: number
}

interface Stripe {
  id: number
  type: 'vertical' | 'horizontal'
  pos: number
  color: string
  width: number
}

export default function BrokenScreen() {
  const [cracks, setCracks] = useState<Crack[]>([])
  const [stripes, setStripes] = useState<Stripe[]>([])
  const [isBroken, setIsBroken] = useState(false)
  const stripesCountRef = useRef(0)

  const triggerStripe = useCallback(() => {
    const newStripes: Stripe[] = [
      {
        id: Date.now() + Math.random(),
        type: Math.random() > 0.5 ? 'vertical' : 'horizontal',
        pos: Math.random() * 100,
        color: ['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#ffff00'][Math.floor(Math.random() * 5)],
        width: Math.random() * 4 + 1
      },
      {
        id: Date.now() + Math.random() + 1,
        type: Math.random() > 0.5 ? 'vertical' : 'horizontal',
        pos: Math.random() * 100,
        color: ['#ff00ff', '#00ffff', '#ffffff'][Math.floor(Math.random() * 3)],
        width: Math.random() * 2 + 0.5
      }
    ]
    setStripes(prev => [...prev, ...newStripes])
    setIsBroken(true)
    stripesCountRef.current += 2
  }, [])

  const triggerCrack = useCallback((x?: number, y?: number) => {
    const newCrack: Crack = {
      id: Date.now(),
      x: x ?? (typeof window !== 'undefined' ? window.innerWidth / 2 : 0),
      y: y ?? (typeof window !== 'undefined' ? window.innerHeight / 2 : 0),
      rotation: Math.random() * 360,
      scale: 0.8 + Math.random() * 0.5
    }

    setCracks(prev => [...prev.slice(-3), newCrack])
    setIsBroken(true)
    playSound('GLASS_BREAK')
    
    // Thêm 1 sọc khi click cho sinh động
    triggerStripe()
  }, [triggerStripe])

  useEffect(() => {
    const handleDoubleClick = (e: MouseEvent) => {
      // Chỉ kích hoạt vỡ nếu click vào body hoặc vùng không phải nút bấm
      if ((e.target as HTMLElement).tagName !== 'BUTTON') {
        triggerCrack(e.clientX, e.clientY)
      }
    }

    window.addEventListener('dblclick', handleDoubleClick)
    
    // Idle detection: Chỉ sọc màn hình sau 30 giây không làm gì
    let idleTimer: NodeJS.Timeout
    
    const resetIdleTimer = () => {
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        if (stripesCountRef.current < 30) {
          triggerStripe()
        }
      }, 30000) // 30 giây
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach(event => window.addEventListener(event, resetIdleTimer))
    
    resetIdleTimer()

    return () => {
      window.removeEventListener('dblclick', handleDoubleClick)
      events.forEach(event => window.removeEventListener(event, resetIdleTimer))
      clearTimeout(idleTimer)
    }
  }, [triggerCrack, triggerStripe])

  const reset = () => {
    setCracks([])
    setStripes([])
    setIsBroken(false)
    stripesCountRef.current = 0
  }

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[1500000] overflow-hidden">
        {/* Sọc màn hình LCD bị hỏng */}
        <AnimatePresence>
          {stripes.map((stripe) => (
            <motion.div
              key={stripe.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0.4, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 0.2 + Math.random() * 0.5 }}
              className="absolute pointer-events-none shadow-[0_0_5px_rgba(255,255,255,0.5)]"
              style={{
                backgroundColor: stripe.color,
                left: stripe.type === 'vertical' ? `${stripe.pos}%` : 0,
                top: stripe.type === 'horizontal' ? `${stripe.pos}%` : 0,
                width: stripe.type === 'vertical' ? `${stripe.width}px` : '100%',
                height: stripe.type === 'horizontal' ? `${stripe.width}px` : '100%',
                boxShadow: `0 0 10px ${stripe.color}`,
                zIndex: 1500002
              }}
            />
          ))}
        </AnimatePresence>

        {/* Các vết nứt kính */}
        <AnimatePresence>
          {cracks.map((crack) => (
            <motion.div
              key={crack.id}
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed inset-0 pointer-events-none"
              style={{ zIndex: 1500001 }}
            >
                <Image
                  src="/images/broken-glass-texture.png"
                  alt="Broken Glass"
                  fill
                  className="object-cover opacity-60"
                  unoptimized
                />
            </motion.div>
          ))}
        </AnimatePresence>

        {isBroken && (
           <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.1, 0.05, 0.15, 0.1] }}
            transition={{ repeat: Infinity, duration: 0.1 }}
            className="fixed inset-0 bg-white pointer-events-none"
            style={{ zIndex: 1500000 }}
           />
        )}
      </div>

      {isBroken && (
        <div className="fixed bottom-4 left-4 z-[1500005]">
          <button
            onClick={reset}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold uppercase tracking-widest shadow-xl hover:bg-red-700 transition-colors"
          >
            Đền màn hình (10k)
          </button>
        </div>
      )}
    </>
  )
}
