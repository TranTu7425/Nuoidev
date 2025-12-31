'use client'

import Link from 'next/link'
import { Github, Coffee, Heart, Globe, Mail, ShieldCheck, Facebook, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-slate-900 font-black">
                N
              </div>
              <span className="font-black text-2xl tracking-tighter">Nuoidev.</span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Dự án Nuôi (MỘT MÌNH) Dev. Mọi giao dịch được xác thực tự động và công khai 100%.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/TranTu7425" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:text-blue-600 transition-colors">
                <Github size={20} />
              </a>
              <a href="https://www.facebook.com/tudzntg/" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:text-blue-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:text-blue-700 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-6">Liên kết</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500 dark:text-slate-400">
              <li><Link href="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link></li>
              <li><Link href="/transactions" className="hover:text-blue-600 transition-colors">Xem giao dịch</Link></li>
              <li><Link href="/donors" className="hover:text-blue-600 transition-colors">Nhà hảo tâm</Link></li>
              <li><Link href="/#donate" className="hover:text-blue-600 transition-colors">Thông tin ủng hộ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-6">Hỗ trợ</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-2"><Mail size={16} /> trananhtu.k51a2@gmail.com</li>
              <li className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400"><ShieldCheck size={16} /> Bảo mật Webhook</li>
              <li className="flex items-center gap-2 text-blue-600 dark:text-blue-400"><Heart size={16} /> Trở thành đối tác</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-xs font-medium">
            © 2025 Nuoidev Transparency Project. All rights reserved.
          </p>
          <div className="flex gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Quy trình xác thực</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Điều khoản</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

