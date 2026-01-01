'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'

interface EvasiveWrapperProps {
  children: React.ReactNode
  className?: string
}

export default function EvasiveWrapper({ children, className = "" }: EvasiveWrapperProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const controls = useAnimation()
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    // Tạo vị trí ngẫu nhiên trong phạm vi màn hình
    // Giới hạn trong khoảng +/- 300px để không bay quá xa mất dấu
    const randomX = (Math.random() - 0.5) * 600
    const randomY = (Math.random() - 0.5) * 400

    setPosition({ x: randomX, y: randomY })
  }

  return (
    <motion.div
      ref={containerRef}
      className={`relative inline-block ${className}`}
      animate={{ x: position.x, y: position.y }}
      onMouseEnter={handleMouseEnter}
      transition={{ 
        type: "spring", 
        stiffness: 150, 
        damping: 15 
      }}
    >
      {children}
    </motion.div>
  )
}

