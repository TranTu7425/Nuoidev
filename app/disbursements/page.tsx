'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ReceiptText } from 'lucide-react'
import DisbursementCard from '@/components/DisbursementCard'

export default function DisbursementsPage() {
  const [disbursements, setDisbursements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDisbursements()
  }, [])

  const fetchDisbursements = async () => {
    try {
      const res = await fetch('/api/disbursements')
      const data = await res.json()
      setDisbursements(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-3xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                <ReceiptText size={32} />
                <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase">Nhật ký Giải ngân</h1>
              </div>
              <p className="text-xl text-slate-500 max-w-2xl">
                Minh bạch quá trình sử dụng nguồn quỹ cho các hoạt động cần thiết để duy trì sự sống.
              </p>
            </div>
          </div>

          {/* List */}
          <div className="space-y-8">
            {loading ? (
              <div className="flex flex-col items-center py-20 gap-4">
                <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 font-medium">Đang tải nhật ký...</p>
              </div>
            ) : disbursements.length > 0 ? (
              disbursements.map((d) => (
                <DisbursementCard key={d.id} disbursement={d} />
              ))
            ) : (
              <div className="text-center py-20 glass-card rounded-[2rem] border-dashed border-2 border-slate-200 dark:border-slate-800">
                <p className="text-slate-400 italic">Chưa có bản cập nhật giải ngân nào.</p>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
