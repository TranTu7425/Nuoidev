'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BSODProps {
  isActive: boolean
  onClose: () => void
}

export default function BSOD({ isActive, onClose }: BSODProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isActive) return

    // Chuyển sang chế độ toàn màn hình
    const enterFullscreen = async () => {
      try {
        const docElm = document.documentElement as any
        
        // Ẩn thanh scroll của toàn bộ trang và thêm class bsod-active
        document.body.style.overflow = 'hidden'
        document.documentElement.style.overflow = 'hidden'
        document.body.classList.add('bsod-active')

        if (docElm.requestFullscreen) {
          await docElm.requestFullscreen()
        } else if (docElm.mozRequestFullScreen) {
          await docElm.mozRequestFullScreen()
        } else if (docElm.webkitRequestFullScreen) {
          await docElm.webkitRequestFullScreen()
        } else if (docElm.msRequestFullscreen) {
          await docElm.msRequestFullscreen()
        }
      } catch (err) {
        console.error("Không thể kích hoạt chế độ toàn màn hình:", err)
      }
    }
    enterFullscreen()

    // Chặn mọi thao tác bàn phím
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()
      e.stopPropagation()
      
      // Lối thoát bí mật: Nhấn Ctrl + Shift + Alt + B để thoát (đề phòng)
      if (e.ctrlKey && e.shiftKey && e.altKey && e.key.toLowerCase() === 'b') {
        onClose()
      }
      
      return false
    }

    // Chặn chuột phải
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    window.addEventListener('keydown', handleKeyDown, true)
    window.addEventListener('contextmenu', handleContextMenu, true)
    
    // Giả lập tiến trình %
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        // Tăng ngẫu nhiên để trông thật hơn
        const increment = Math.random() > 0.8 ? Math.floor(Math.random() * 10) : 1
        return Math.min(prev + increment, 100)
      })
    }, 1500)

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
      window.removeEventListener('contextmenu', handleContextMenu, true)
      clearInterval(interval)
      
      // Hiện lại thanh scroll và xóa class bsod-active
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      document.body.classList.remove('bsod-active')

      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {})
      }
    }
  }, [isActive, onClose])

  return (
    <AnimatePresence>
      {isActive && (
        <>
          <style dangerouslySetInnerHTML={{ __html: `
            body, html {
              overflow: hidden !important;
              cursor: none !important;
            }
            ::-webkit-scrollbar {
              display: none !important;
            }
            * {
              scrollbar-width: none !important;
              -ms-overflow-style: none !important;
            }
          ` }} />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black text-white flex flex-col items-center justify-center p-8 md:p-24 select-none cursor-none overflow-hidden"
            style={{ 
              fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif',
              backgroundColor: '#000000'
            }}
          >
          <div className="max-w-5xl w-full space-y-16">
            <div className="space-y-10">
              <div className="text-8xl md:text-9xl font-normal mb-8">
                :(
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal leading-tight tracking-tight">
                Your device ran into a problem and needs to restart.
              </h1>
              <p className="text-2xl md:text-3xl font-normal opacity-90">
                {progress}% complete
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-10 items-start pt-4">
              <div className="w-32 h-32 bg-white p-2 shrink-0">
                 {/* Giả lập mã QR */}
                 <div className="w-full h-full bg-black flex flex-wrap p-1">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1/8 h-1/8 ${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`}
                        style={{ width: '12.5%', height: '12.5%' }}
                      />
                    ))}
                 </div>
              </div>
              <div className="space-y-6 text-sm md:text-lg opacity-80 max-w-2xl font-normal">
                <p>For more information about this issue and possible fixes, visit https://www.windows.com/stopcode</p>
                <div className="space-y-2">
                  <p>If you call a support person, give them this info:</p>
                  <p className="font-semibold">Stop code: DRIVER_IRQL_NOT_LESS_OR_EQUAL (0xD1)</p>
                  <p className="font-semibold">What failed: myfault.sys</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Một nút tàng hình ở góc để thoát nếu cần (chỉ dành cho dev) */}
          <div 
            className="fixed bottom-0 right-0 w-10 h-10 opacity-0 cursor-default" 
            onClick={onClose}
          />
        </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

