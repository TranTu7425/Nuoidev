'use client'

import { motion } from 'framer-motion'
import { History, ShieldCheck } from 'lucide-react'
import TransactionList from '@/components/TransactionList'

export default function TransactionsPage() {
  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
              <History size={32} />
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">Lịch sử giao dịch</h1>
            </div>
            <p className="text-xl text-slate-500 max-w-2xl">
              Tất cả các giao dịch dưới đây đều được xác thực tự động và không thể thay đổi để đảm bảo tính minh bạch.
            </p>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold w-fit border border-emerald-100 dark:border-emerald-900/50">
              <ShieldCheck size={14} /> Cập nhật thời gian thực qua Webhook
            </div>
          </div>

          <TransactionList realtime={true} />
        </motion.div>
      </main>
    </div>
  )
}
