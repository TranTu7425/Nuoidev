'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, History, Users, Heart, Sun, Moon, ReceiptText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const navItems = [
  { name: 'Trang chủ', href: '/', icon: Home },
  { name: 'Xem giao dịch', href: '/transactions', icon: History },
  { name: 'Giải ngân', href: '/disbursements', icon: ReceiptText },
  { name: 'Người ủng hộ', href: '/donors', icon: Users },
]

export default function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Tránh lỗi hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card px-6 py-3 rounded-2xl flex items-center gap-4 md:gap-8 shadow-2xl shadow-blue-500/10"
      >
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg group-hover:scale-110 transition-transform">
            N
          </div>
          <span className="font-black text-xl tracking-tighter hidden sm:block">Nuoidev.</span>
        </Link>

        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 hidden md:block" />

        <div className="flex items-center gap-1 md:gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                  isActive 
                    ? "text-blue-600 dark:text-blue-400" 
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                )}
              >
                <item.icon size={18} className={cn(isActive && "animate-pulse")} />
                <span className="hidden md:block">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-xl -z-10 border border-blue-100 dark:border-blue-900/50"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800" />

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all active:scale-95"
            aria-label="Toggle theme"
          >
            {mounted ? (
              theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />
            ) : (
              <div className="w-5 h-5" /> // Placeholder khi chưa mount
            )}
          </button>

          <Link
            href="/#donate"
            className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            <Heart size={16} fill="currentColor" /> Ủng hộ ngay
          </Link>
        </div>
      </motion.nav>
    </header>
  )
}
