'use client'

import { useEffect, useState } from 'react'
import { formatCurrency, formatDateShort } from '@/lib/utils'
import { maskAccount } from '@/lib/webhook'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, MessageCircle, ShieldCheck, ChevronDown } from 'lucide-react'

interface Transaction {
  id: string
  transactionId: string
  amount: number
  senderName: string
  senderAccount: string | null
  message: string | null
  status: string
  verifiedAt: string | null
  createdAt: string
  updatedAt: string
}

export default function TransactionList({ realtime = true }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    if (realtime) {
      const eventSource = new EventSource('/api/transactions/stream')
      eventSource.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'new_transactions' && data.data) {
            setTransactions((prev) => {
              const prevIds = new Set(prev.map(tx => tx.id))
              const uniqueNewTxs = (data.data as Transaction[]).filter(tx => !prevIds.has(tx.id))
              return [...uniqueNewTxs, ...prev]
            })
          }
        } catch (error) {
          console.error('Error parsing transaction stream:', error)
        }
      })
      return () => eventSource.close()
    }
  }, [realtime])

  useEffect(() => {
    loadTransactions()
  }, [page])

  async function loadTransactions() {
    setLoading(true)
    try {
      const res = await fetch(`/api/transactions?page=${page}&limit=20&status=verified`)
      const data = await res.json()
      if (page === 1) setTransactions(data.data)
      else setTransactions((prev) => [...prev, ...data.data])
      setHasMore(data.pagination.page < data.pagination.totalPages)
    } catch (error) {
      console.error('Error loading transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        {transactions.map((tx, index) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-6 rounded-3xl group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldCheck size={80} className="text-emerald-500" />
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
              <div className="flex gap-5">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center font-bold text-xl text-slate-600 dark:text-slate-300 shrink-0">
                  {tx.senderName?.[0] || 'A'}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">{tx.senderName || 'Người ủng hộ ẩn danh'}</h3>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      <ShieldCheck size={10} /> Verified
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      {formatDateShort(tx.createdAt)}
                    </span>
                    {tx.senderAccount && (
                      <span className="flex items-center gap-1.5 opacity-60">
                        • {maskAccount(tx.senderAccount)}
                      </span>
                    )}
                  </div>
                  {tx.message && (
                    <div className="mt-3 p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100/50 dark:border-blue-900/20 text-slate-600 dark:text-slate-300 flex gap-2 italic">
                      <MessageCircle size={16} className="shrink-0 text-blue-400 mt-1" />
                      <p className="text-sm">"{tx.message}"</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                  {formatCurrency(Number(tx.amount))}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono uppercase mt-2">
                  ID: {tx.transactionId} <ExternalLink size={10} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {hasMore && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setPage((p) => p + 1)}
          disabled={loading}
          className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:shadow-blue-500/20"
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <>Tải thêm giao dịch <ChevronDown size={20} /></>
          )}
        </motion.button>
      )}
    </div>
  )
}
