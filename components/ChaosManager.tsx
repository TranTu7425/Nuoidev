'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Bomb, RefreshCcw } from 'lucide-react'

export default function ChaosManager() {
  const [isChaos, setIsChaos] = useState(false)
  const [hasPermission, setHasPermission] = useState(false)

  const triggerChaos = useCallback(() => {
    if (isChaos) return
    setIsChaos(true)
    
    // Phát sự kiện cho toàn hệ thống
    window.dispatchEvent(new CustomEvent('chaos-mode', { detail: { active: true } }))
    
    // Tự động reset sau 8 giây
    setTimeout(() => {
      setIsChaos(false)
      window.dispatchEvent(new CustomEvent('chaos-mode', { detail: { active: false } }))
    }, 8000)
  }, [isChaos])

  const requestPermission = async () => {
    if (typeof DeviceMotionEvent !== 'undefined' && 
        typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission()
        if (permission === 'granted') {
          setHasPermission(true)
          startDetection()
        }
      } catch (err) {
        console.error('Error requesting motion permission:', err)
      }
    } else {
      // Trình duyệt không yêu cầu quyền (Android hoặc các trình duyệt khác)
      setHasPermission(true)
      startDetection()
    }
  }

  const startDetection = () => {
    let lastX = 0, lastY = 0, lastZ = 0
    let threshold = 15 // Độ nhạy của cú lắc

    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity
      if (!acc) return

      let deltaX = Math.abs((acc.x || 0) - lastX)
      let deltaY = Math.abs((acc.y || 0) - lastY)
      let deltaZ = Math.abs((acc.z || 0) - lastZ)

      if ((deltaX > threshold && deltaY > threshold) || 
          (deltaX > threshold && deltaZ > threshold) || 
          (deltaY > threshold && deltaZ > threshold)) {
        triggerChaos()
      }

      lastX = acc.x || 0
      lastY = acc.y || 0
      lastZ = acc.z || 0
    }

    window.addEventListener('devicemotion', handleMotion)
    return () => window.removeEventListener('devicemotion', handleMotion)
  }

  useEffect(() => {
    // Nếu không phải mobile hoặc đã có quyền, có thể thử start luôn
    if (typeof window !== 'undefined' && !('ontouchstart' in window)) {
      setHasPermission(true)
    }
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-4">
      {!hasPermission && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={requestPermission}
          className="p-4 bg-red-600 text-white rounded-full shadow-2xl flex items-center gap-2 font-black text-xs uppercase tracking-widest"
        >
          <Bomb size={20} /> Big Bang Mode
        </motion.button>
      )}
      
      {isChaos && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => {
            setIsChaos(false)
            window.dispatchEvent(new CustomEvent('chaos-mode', { detail: { active: false } }))
          }}
          className="p-4 bg-blue-600 text-white rounded-full shadow-2xl flex items-center gap-2 font-black text-xs uppercase tracking-widest"
        >
          <RefreshCcw size={20} className="animate-spin" /> Reset Layout
        </motion.button>
      )}
    </div>
  )
}

