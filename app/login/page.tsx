'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, KeyRound, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [accessKey, setAccessKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, accessKey })
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/admin/disbursements')
      } else {
        setError(data.error || 'Đăng nhập thất bại')
      }
    } catch (err) {
      setError('Đã xảy ra lỗi, vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
              <Lock size={32} />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Admin Login</h1>
              <p className="text-slate-500 text-sm">Chỉ dành cho quản trị viên hệ thống</p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <KeyRound size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    autoFocus
                    required
                    type="password"
                    placeholder="Mật khẩu Admin"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-slate-100 dark:bg-slate-900 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none transition-all font-medium"
                  />
                </div>

                <div className="relative">
                  <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    required
                    type="password"
                    placeholder="Mã truy cập bí mật (Access Key)"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-slate-100 dark:bg-slate-900 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none transition-all font-medium"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-xs font-bold bg-red-50 dark:bg-red-900/20 py-3 px-4 rounded-xl border border-red-100 dark:border-red-900/30">
                  {error}
                </div>
              )}

              <button 
                disabled={loading}
                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : 'Đăng nhập'}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

