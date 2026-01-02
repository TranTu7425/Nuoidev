'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatCurrency, formatDateShort } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, Users, ArrowUpRight, TrendingUp, Clock, Award } from 'lucide-react'

interface Stats {
  totalAmount: number
  totalDonors: number
  totalTransactions: number
  recentTransactions: any[]
  topDonors: any[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

export default function StatsDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  async function fetchStats() {
    try {
      const res = await fetch('/api/stats')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-600 animate-spin"></div>
          <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-400 animate-ping opacity-20"></div>
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { 
            label: 'Tổng ngân quỹ', 
            value: formatCurrency(Number(stats.totalAmount)), 
            icon: Wallet, 
            color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
            trend: '+12% tuần này'
          },
          { 
            label: 'Người ủng hộ', 
            value: stats.totalDonors, 
            icon: Users, 
            color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
            trend: 'Cộng đồng đang lớn mạnh'
          },
          { 
            label: 'Giao dịch', 
            value: stats.totalTransactions, 
            icon: TrendingUp, 
            color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
            trend: 'Minh bạch & Công khai'
          }
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="glass-card p-8 rounded-3xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 rounded-2xl ${stat.color}`}>
                <stat.icon size={28} />
              </div>
              <ArrowUpRight className="text-slate-400" size={20} />
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">{stat.label}</h3>
            <p className="text-3xl font-bold tracking-tight mb-2">{stat.value}</p>
            <p className="text-xs text-slate-400">{stat.trend}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
                <Clock size={20} />
              </div>
              <h2 className="text-2xl font-bold">Hoạt động gần đây</h2>
            </div>
            <Link href="/transactions" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
              Xem tất cả
            </Link>
          </div>
          
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {stats.recentTransactions.slice(0, 5).map((tx) => (
                <motion.div
                  key={tx.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card p-5 rounded-2xl flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {tx.senderName?.[0] || '?'}
                    </div>
                    <div>
                      <h4 className="font-semibold">{tx.senderName || 'Ẩn danh'}</h4>
                      <p className="text-xs text-slate-500">{formatDateShort(tx.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(Number(tx.amount))}
                    </p>
                    {tx.message && (
                      <p className="text-[10px] text-slate-400 italic max-w-[150px] truncate">
                        {`"${tx.message}"`}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Top Donors Ranking */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
                <Award size={20} />
              </div>
              <h2 className="text-2xl font-bold">Bảng vàng vinh danh</h2>
            </div>
            <Link href="/donors" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
              Xem tất cả
            </Link>
          </div>

          <div className="glass-card rounded-3xl overflow-hidden">
            {stats.topDonors.slice(0, 5).map((donor, index) => (
              <div
                key={donor.id}
                className={`flex items-center justify-between p-6 transition-colors ${
                  index !== stats.topDonors.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''
                } hover:bg-slate-50/50 dark:hover:bg-slate-800/30`}
              >
                <div className="flex items-center gap-5">
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
                    ${index === 0 ? 'bg-amber-100 text-amber-600' : 
                      index === 1 ? 'bg-slate-100 text-slate-600' : 
                      index === 2 ? 'bg-orange-100 text-orange-600' : 
                      'bg-slate-50 text-slate-400'}
                  `}>
                    #{index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold">{donor.name}</h4>
                    <p className="text-xs text-slate-500">{donor.transactionCount} lần ủng hộ</p>
                  </div>
                </div>
                <p className="font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(Number(donor.totalAmount))}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
