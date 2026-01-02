'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CoffeeRain() {
  const [items, setItems] = useState<{ id: number, left: number, duration: number, icon: string }[]>([])

  useEffect(() => {
    const triggerRain = () => {
      const newItems = Array.from({ length: 20 }).map((_, i) => ({
        id: Date.now() + i,
        left: Math.random() * 100,
        duration: 2 + Math.random() * 3,
        icon: Math.random() > 0.5 ? '☕️' : '🫘'
      }))
      
      setItems(prev => [...prev, ...newItems])
      
      // Cleanup after 5 seconds
      setTimeout(() => {
        setItems(prev => prev.filter(item => !newItems.find(ni => ni.id === item.id)))
      }, 6000)
    }

    window.addEventListener('donation-rain', triggerRain)
    return () => window.removeEventListener('donation-rain', triggerRain)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[150] overflow-hidden">
      <AnimatePresence>
        {items.map(item => (
          <motion.div
            key={item.id}
            initial={{ y: -100, opacity: 0, rotate: 0 }}
            animate={{ 
              y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000, 
              opacity: [0, 1, 1, 0],
              rotate: 360 * 2
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: item.duration, ease: "linear" }}
            className="absolute text-4xl"
            style={{ left: `${item.left}%` }}
          >
            {item.icon}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

