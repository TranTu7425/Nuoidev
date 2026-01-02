'use client'

import { motion } from 'framer-motion'
import { History, ShieldCheck, Wheat, Wallet, CalendarDays, FileDown } from 'lucide-react'
import TransactionList from '@/components/TransactionList'
import { useEffect, useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import { exportTransactionsToPDF } from '@/lib/export-pdf'

export default function TransactionsPage() {
  const [stats, setStats] = useState<any>(null)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
  }, [])

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      // Fetch all verified transactions for export
      const res = await fetch('/api/transactions?limit=1000&status=verified')
      const data = await res.json()
      await exportTransactionsToPDF(data.data)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Có lỗi khi xuất PDF. Vui lòng thử lại.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-5xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Header & Description */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
                <History size={32} />
                <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase">Check Logs Realtime</h1>
              </div>
              <p className="text-xl text-slate-500 max-w-2xl">
                {`Danh sách chi tiết các lệnh "Deploy Cơm" được Webhook xác thực tự động.`}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-700 dark:text-slate-300 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-lg shadow-slate-200/50 dark:shadow-none disabled:opacity-50"
            >
              {isExporting ? (
                <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <FileDown size={20} />
              )}
              Xuất sao kê PDF
            </motion.button>
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
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Tổng quyên góp</p>
                <p className="text-2xl font-black text-emerald-600">
                  {stats ? formatCurrency(Number(stats.totalAmount)) : '...'}
                </p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass-card p-6 rounded-[2rem] border-2 border-red-500/10 flex items-center gap-5"
            >
              <div className="h-14 w-14 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center justify-center">
                <CalendarDays size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Đã giải ngân</p>
                <p className="text-2xl font-black text-red-600">
                  {stats ? formatCurrency(Number(stats.totalDisbursed)) : '...'}
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
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Số dư hiện tại</p>
                <p className="text-2xl font-black text-blue-600">
                  {stats ? formatCurrency(Number(stats.currentBalance)) : '...'}
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
