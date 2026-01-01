'use client'

import { useState } from 'react'
import { formatCurrency, formatDateShort } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Send, ImageIcon } from 'lucide-react'

interface Comment {
  id: string
  content: string
  authorName: string
  createdAt: string
}

interface Disbursement {
  id: string
  amount: number
  caption: string
  images: string[]
  createdAt: string
  _count: {
    comments: number
    reactions: number
  }
}

export default function DisbursementCard({ disbursement }: { disbursement: Disbursement }) {
  const [likes, setLikes] = useState(disbursement._count.reactions)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [loadingComments, setLoadingComments] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  const handleLike = async () => {
    if (isLiking) return
    setIsLiking(true)
    try {
      await fetch(`/api/disbursements/${disbursement.id}/reactions`, {
        method: 'POST',
        body: JSON.stringify({ type: 'heart' })
      })
      setLikes(prev => prev + 1)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLiking(false)
    }
  }

  const loadComments = async () => {
    if (showComments) {
      setShowComments(false)
      return
    }
    setShowComments(true)
    setLoadingComments(true)
    try {
      const res = await fetch(`/api/disbursements/${disbursement.id}/comments`)
      const data = await res.json()
      setComments(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingComments(false)
    }
  }

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    try {
      const res = await fetch(`/api/disbursements/${disbursement.id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content: newComment, authorName })
      })
      const data = await res.json()
      setComments(prev => [data, ...prev])
      setNewComment('')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-800"
    >
      {/* Images Grid */}
      {disbursement.images && disbursement.images.length > 0 && (
        <div className={`grid gap-1 ${disbursement.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {disbursement.images.map((url, idx) => (
            <img 
              key={idx} 
              src={url} 
              alt={`Disbursement ${idx}`} 
              className="w-full h-64 object-cover"
            />
          ))}
        </div>
      )}

      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
              Đã giải ngân
            </p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">
              {formatCurrency(disbursement.amount)}
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {formatDateShort(disbursement.createdAt)}
          </span>
        </div>

        <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
          {disbursement.caption}
        </p>

        <div className="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-2 transition-colors ${isLiking ? 'text-red-500' : 'text-slate-500 hover:text-red-500'}`}
          >
            <Heart size={20} fill={isLiking ? 'currentColor' : 'none'} />
            <span className="font-bold text-sm">{likes}</span>
          </button>
          
          <button 
            onClick={loadComments}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors"
          >
            <MessageCircle size={20} />
            <span className="font-bold text-sm">{disbursement._count.comments + (comments.length > 0 ? comments.length - disbursement._count.comments : 0)}</span>
          </button>
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4 pt-4 overflow-hidden"
            >
              {/* Comment Form */}
              <form onSubmit={submitComment} className="space-y-2">
                <input 
                  type="text"
                  placeholder="Tên của bạn (tùy chọn)..."
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-blue-500 transition-all"
                />
                <div className="relative">
                  <textarea 
                    placeholder="Viết bình luận..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-blue-500 transition-all min-h-[80px]"
                  />
                  <button 
                    type="submit"
                    className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>

              {/* Comment List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {loadingComments ? (
                  <div className="flex justify-center py-4">
                    <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : comments.length > 0 ? (
                  comments.map(comment => (
                    <div key={comment.id} className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-blue-600 dark:text-blue-400">
                          {comment.authorName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatDateShort(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {comment.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-xs text-slate-400 py-4 italic">Chưa có bình luận nào.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

