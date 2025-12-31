'use client'

import { useEffect, useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Calendar, Filter, Star } from 'lucide-react'

interface Donor {
  id: string
  name: string
  totalAmount: number
  transactionCount: number
  firstDonationAt: string | null
  lastDonationAt: string | null
  createdAt: string
  updatedAt: string
}

export default function DonorWall() {
  const [donors, setDonors] = useState<Donor[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'amount' | 'time'>('amount')

  useEffect(() => {
    fetchDonors()
    const interval = setInterval(fetchDonors, 30000)
    return () => clearInterval(interval)
  }, [sortBy])

  async function fetchDonors() {
    try {
      const res = await fetch('/api/stats?limit=50')
      const data = await res.json()
      let sortedDonors = [...(data.topDonors || [])]
      if (sortBy === 'time') {
        sortedDonors.sort((a, b) => {
          const timeA = new Date(a.lastDonationAt || a.createdAt).getTime()
          const timeB = new Date(b.lastDonationAt || b.createdAt).getTime()
          return timeB - timeA
        })
      }
      setDonors(sortedDonors)
    } catch (error) {
      console.error('Error fetching donors:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-6 p-2 bg-slate-100 dark:bg-slate-800/50 rounded-3xl w-fit mx-auto md:mx-0">
        <button
          onClick={() => setSortBy('amount')}
          className={`px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition-all ${
            sortBy === 'amount' 
            ? 'bg-white dark:bg-slate-700 shadow-md text-blue-600 scale-105' 
            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Trophy size={18} /> Cao nhất
        </button>
        <button
          onClick={() => setSortBy('time')}
          className={`px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition-all ${
            sortBy === 'time' 
            ? 'bg-white dark:bg-slate-700 shadow-md text-blue-600 scale-105' 
            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Calendar size={18} /> Gần đây
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {donors.map((donor, index) => (
            <motion.div
              key={donor.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -8 }}
              className="glass-card p-8 rounded-[2rem] relative group border-2 border-transparent hover:border-blue-500/20 transition-all"
            >
              {index < 3 && sortBy === 'amount' && (
                <div className="absolute -top-4 -right-4 bg-amber-400 text-white p-3 rounded-2xl shadow-xl transform rotate-12 group-hover:rotate-0 transition-transform">
                  <Star size={24} fill="currentColor" />
                </div>
              )}

              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-2xl">
                    {donor.name[0]}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-900 h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs border-2 border-slate-100 dark:border-slate-800 shadow-lg">
                    #{index + 1}
                  </div>
                </div>
                <div className="min-w-0">
                  <h3 className="text-2xl font-bold truncate pr-4">{donor.name}</h3>
                  <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                    <Star size={14} className="text-amber-500" /> {donor.transactionCount} lần ủng hộ
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tổng ủng hộ</span>
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{formatCurrency(Number(donor.totalAmount))}</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 opacity-20"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
