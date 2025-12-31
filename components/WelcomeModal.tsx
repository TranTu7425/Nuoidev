'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, CheckCircle2, ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Show modal after a short delay
    const timer = setTimeout(() => {
      const hasSeenNotice = sessionStorage.getItem('hasSeenNotice')
      if (!hasSeenNotice) {
        setIsOpen(true)
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    sessionStorage.setItem('hasSeenNotice', 'true')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
          >
            {/* Header with gradient */}
            <div className="bg-amber-500 p-6 flex items-center gap-4 text-white">
              <div className="p-3 bg-white/20 rounded-2xl">
                <ShieldAlert size={32} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Hệ Thống Cảnh Báo</h3>
                <p className="text-amber-100 font-bold text-xs uppercase tracking-widest">Vui lòng đọc kỹ trước khi Deploy</p>
              </div>
              <button 
                onClick={handleClose}
                className="ml-auto p-2 hover:bg-white/20 rounded-xl transition-colors"
                aria-label="Đóng cảnh báo"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-4">
                {[
                  {
                    icon: <AlertTriangle className="text-amber-500" />,
                    text: (
                      <span>
                        Website này mang tính chất giải trí cao và gây quỹ tự nguyện để duy trì uptime của Developer. Khi deploy cơm đồng nghĩa với việc bạn đã đồng ý với{' '}
                        <Link href="/terms" className="text-amber-600 dark:text-amber-400 underline font-black hover:text-amber-700 transition-colors">
                          điều kiện và điều khoản
                        </Link>{' '}
                        của dự án.
                      </span>
                    )
                  },
                  {
                    icon: <CheckCircle2 className="text-emerald-500" />,
                    text: "Mọi giao dịch donate sẽ được hệ thống Webhook tự động cập nhật và công khai 100% trên bảng sao kê."
                  },
                  {
                    icon: <ShieldAlert className="text-blue-500" />,
                    text: "Dữ liệu cá nhân (nội dung chuyển khoản) sẽ được hiển thị công khai. Vui lòng không ghi thông tin nhạy cảm."
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="mt-1 flex-shrink-0">{item.icon}</div>
                    <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={handleClose}
                className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-tighter"
              >
                Đã hiểu, cho tôi vào Inspect!
              </button>
              
              <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-[0.2em]">
                System Status: Ready to be Funded
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

