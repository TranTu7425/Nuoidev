'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ReceiptText, Plus, X, ImageIcon, Send, LogOut, ArrowLeft, Upload, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminDisbursementsPage() {
  const [disbursements, setDisbursements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Create Form State
  const [amount, setAmount] = useState('')
  const [caption, setCaption] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.push('/')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setSelectedFiles(prev => [...prev, ...files])
    
    // Tạo preview
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviews(prev => [...prev, ...newPreviews])
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let uploadedUrls: string[] = []

      // 1. Tải ảnh lên trước (nếu có)
      if (selectedFiles.length > 0) {
        const formData = new FormData()
        selectedFiles.forEach(file => formData.append('files', file))

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        const uploadData = await uploadRes.json()
        if (uploadRes.ok) {
          uploadedUrls = uploadData.urls
        } else {
          throw new Error(uploadData.error || 'Upload failed')
        }
      }

      // 2. Tạo bản tin giải ngân
      const res = await fetch('/api/disbursements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          caption,
          images: uploadedUrls
        })
      })

      if (res.ok) {
        setShowCreateModal(false)
        setAmount('')
        setCaption('')
        setSelectedFiles([])
        setPreviews([])
        fetchDisbursements()
      }
    } catch (error) {
      console.error(error)
      alert('Có lỗi xảy ra: ' + (error instanceof Error ? error.message : 'Lỗi không xác định'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <main className="max-w-4xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Admin Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Link href="/" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors">
                  <ArrowLeft size={24} />
                </Link>
                <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800" />
                <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                  <ReceiptText className="text-blue-600" /> Quản trị Giải ngân
                </h1>
              </div>
              <p className="text-slate-500 font-medium">Khu vực dành riêng cho Quản trị viên</p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-all active:scale-95"
              >
                <Plus size={20} /> Tạo bản tin giải ngân
              </button>
              <button 
                onClick={handleLogout}
                className="p-3 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-2xl hover:bg-red-100 transition-colors"
                title="Đăng xuất"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

          {/* Admin Table View */}
          <div className="glass-card rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Ngày đăng</th>
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Số tiền</th>
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Mô tả</th>
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Ảnh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                {disbursements.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="px-8 py-6 text-sm text-slate-500 font-medium">
                      {new Date(d.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-black text-blue-600 dark:text-blue-400">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(d.amount)}
                      </span>
                    </td>
                    <td className="px-8 py-6 max-w-md">
                      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{d.caption}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex -space-x-2">
                        {d.images?.slice(0, 3).map((img: string, i: number) => (
                          <div key={i} className="h-10 w-10 rounded-lg border-2 border-white dark:border-slate-950 bg-slate-200 overflow-hidden shadow-sm">
                            <img src={img} className="h-full w-full object-cover" alt="" />
                          </div>
                        ))}
                        {d.images?.length > 3 && (
                          <div className="h-10 w-10 rounded-lg border-2 border-white dark:border-slate-950 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 shadow-sm">
                            +{d.images.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>

      {/* Modal Cập nhật Giải ngân */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Cập nhật Giải ngân</h2>
                  <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="disbursement-amount" className="text-xs font-black uppercase tracking-widest text-slate-400">Số tiền giải ngân (VND)</label>
                    <input 
                      id="disbursement-amount"
                      name="disbursement-amount"
                      required
                      type="number"
                      placeholder="VD: 500000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-blue-600 transition-all font-bold text-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="disbursement-caption" className="text-xs font-black uppercase tracking-widest text-slate-400">Nội dung giải ngân</label>
                    <textarea 
                      id="disbursement-caption"
                      name="disbursement-caption"
                      required
                      placeholder="Mô tả mục đích sử dụng số tiền này..."
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-blue-600 transition-all min-h-[120px]"
                    />
                  </div>

                  <div className="space-y-4">
                    <label htmlFor="disbursement-files" className="text-xs font-black uppercase tracking-widest text-slate-400 flex justify-between">
                      Hình ảnh chứng từ
                    </label>
                    
                    <input 
                      id="disbursement-files"
                      name="disbursement-files"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />

                    <div className="grid grid-cols-3 gap-3">
                      {previews.map((src, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <img src={src} className="h-full w-full object-cover" alt="" />
                          <button 
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all bg-slate-50/50 dark:bg-slate-900/50"
                      >
                        <Upload size={24} />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">Chọn ảnh</span>
                      </button>
                    </div>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>Đăng bản cập nhật <Send size={18} /></>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
