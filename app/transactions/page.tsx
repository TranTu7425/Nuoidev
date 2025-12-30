'use client'

import { motion } from 'framer-motion'
import { History, ShieldCheck, Wheat, Wallet, CalendarDays } from 'lucide-react'
import TransactionList from '@/components/TransactionList'
import { useEffect, useState } from 'react'
import { formatCurrency } from '@/lib/utils'

export default function TransactionsPage() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
  }, [])

  return (
    <div className="min-h-screen">
      <main className="max-w-5xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Header & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
              <History size={32} />
              <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase">Check Logs Realtime</h1>
            </div>
            <p className="text-xl text-slate-500 max-w-2xl">
              Danh sách chi tiết các lệnh "Deploy Cơm" được Webhook xác thực tự động.
            </p>
          </div>

          {/* New Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass-card p-6 rounded-[2rem] border-2 border-emerald-500/10 flex items-center gap-5"
            >
              <div className="h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center">
                <Wheat size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Lúa về hôm nay</p>
                <p className="text-2xl font-black text-emerald-600">
                  {stats ? formatCurrency(Number(stats.todayAmount)) : '...'}
                </p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass-card p-6 rounded-[2rem] border-2 border-purple-500/10 flex items-center gap-5"
            >
              <div className="h-14 w-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center">
                <CalendarDays size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Quỹ tháng này</p>
                <p className="text-2xl font-black text-purple-600">
                  {stats ? formatCurrency(Number(stats.monthAmount)) : '...'}
                </p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass-card p-6 rounded-[2rem] border-2 border-blue-500/10 flex items-center gap-5"
            >
              <div className="h-14 w-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                <Wallet size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Số dư khả dụng</p>
                <p className="text-2xl font-black text-blue-600">
                  {stats ? formatCurrency(Number(stats.totalAmount)) : '...'}
                </p>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold w-fit border border-emerald-100 dark:border-emerald-900/50">
            <ShieldCheck size={14} /> Dữ liệu đã được Unit Test 100% chính xác
          </div>

          <TransactionList realtime={true} />
        </motion.div>
      </main>
    </div>
  )
}
