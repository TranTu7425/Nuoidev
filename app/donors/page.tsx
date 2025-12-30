'use client'

import { motion } from 'framer-motion'
import { Award, Star } from 'lucide-react'
import DonorWall from '@/components/DonorWall'

export default function DonorsPage() {
  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-16"
        >
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-[2rem] shadow-xl shadow-amber-500/10">
                <Award size={64} />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-black tracking-tight">Nhà hảo tâm</h1>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                Vinh danh những cá nhân tuyệt vời đã góp phần giúp dự án duy trì và phát triển.
              </p>
            </div>
            <div className="flex justify-center gap-2">
               {[1, 2, 3].map(i => (
                 <Star key={i} size={20} className="text-amber-400 fill-amber-400" />
               ))}
            </div>
          </div>

          <DonorWall />
        </motion.div>
      </main>
    </div>
  )
}
