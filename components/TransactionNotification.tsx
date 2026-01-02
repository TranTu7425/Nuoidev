'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Heart, X } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { playSound } from '@/lib/sounds'

interface Transaction {
  id: string
  senderName: string
  amount: number
  message: string | null
}

export default function TransactionNotification() {
  const [notifications, setNotifications] = useState<Transaction[]>([])

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let retryCount = 0;

    const connect = () => {
      if (eventSource) eventSource.close();
      
      eventSource = new EventSource('/api/transactions/stream')
      
      eventSource.onopen = () => {
        console.log('✅ SSE Connected')
        retryCount = 0;
      }

      eventSource.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'new_transactions' && data.data) {
            // Trigger coffee rain
            window.dispatchEvent(new CustomEvent('donation-rain'))
            
            // Play success sound
            playSound('SUCCESS')
            
            const newTxs = data.data as Transaction[]
          
          // Filter out transactions we've already notified to prevent duplicates
          setNotifications((prev) => {
              const prevIds = new Set(prev.map(n => n.id))
              const uniqueNewTxs = newTxs.filter(tx => !prevIds.has(tx.id))
              
              if (uniqueNewTxs.length === 0) return prev;

              // Auto-remove each NEW notification after 10 seconds
              uniqueNewTxs.forEach((tx) => {
                setTimeout(() => {
                  setNotifications((current) => current.filter((n) => n.id !== tx.id))
                }, 10000)
              })

              return [...prev, ...uniqueNewTxs]
            })
          }
        } catch (error) {
          console.error('❌ SSE Parse Error:', error)
        }
      })

      eventSource.onerror = (error) => {
        console.error('❌ SSE Error:', error)
        eventSource?.close();
        
        // Retry logic with exponential backoff
        const timeout = Math.min(1000 * Math.pow(2, retryCount), 30000);
        setTimeout(() => {
          retryCount++;
          connect();
        }, timeout);
      }
    }

    connect();

    return () => {
      if (eventSource) eventSource.close()
    }
  }, [])

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="fixed bottom-6 left-6 z-[110] flex flex-col gap-4 pointer-events-none max-w-sm w-full px-4 md:px-0">
      <AnimatePresence mode="popLayout">
        {notifications.map((tx) => (
          <motion.div
            key={tx.id}
            layout
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className="pointer-events-auto bg-white dark:bg-slate-900 border-2 border-emerald-500/20 dark:border-emerald-500/30 rounded-3xl shadow-2xl p-5 relative overflow-hidden group"
          >
            {/* Progress bar for auto-hide */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 10, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-emerald-500/50"
            />

            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Heart size={24} fill="currentColor" />
              </div>
              
              <div className="flex-grow space-y-1">
                <div className="flex justify-between items-start">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    Cảm ơn nhà hảo tâm!
                  </p>
                  <button 
                    onClick={() => removeNotification(tx.id)}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    aria-label="Đóng thông báo"
                  >
                    <X size={14} className="text-slate-400" />
                  </button>
                </div>
                
                <h4 className="font-black text-slate-900 dark:text-white truncate">
                  {tx.senderName || 'Người ủng hộ ẩn danh'}
                </h4>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    +{formatCurrency(tx.amount)}
                  </span>
                </div>
                
                {tx.message && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic line-clamp-2 mt-2 leading-relaxed">
                    {`"${tx.message}"`}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

