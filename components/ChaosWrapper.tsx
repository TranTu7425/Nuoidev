'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function ChaosWrapper({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const [chaosState, setChaosState] = useState({ active: false, x: 0, y: 0, rotate: 0 })

  useEffect(() => {
    const handleChaos = (e: any) => {
      const active = e.detail.active
      if (active) {
        // Tạo vị trí rơi ngẫu nhiên xuống phía dưới màn hình
        setChaosState({
          active: true,
          x: (Math.random() - 0.5) * 200,
          y: window.innerHeight + Math.random() * 500,
          rotate: (Math.random() - 0.5) * 90
        })
      } else {
        // Reset về vị trí cũ
        setChaosState({ active: false, x: 0, y: 0, rotate: 0 })
      }
    }

    window.addEventListener('chaos-mode', handleChaos)
    return () => window.removeEventListener('chaos-mode', handleChaos)
  }, [])

  return (
    <motion.div
      animate={{ 
        x: chaosState.x,
        y: chaosState.y,
        rotate: chaosState.rotate,
      }}
      transition={{ 
        type: "spring", 
        stiffness: chaosState.active ? 30 : 200, 
        damping: chaosState.active ? 10 : 25,
        mass: chaosState.active ? 2 : 1
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

