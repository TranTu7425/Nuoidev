'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import StatsDashboard from '@/components/StatsDashboard'
import WelcomeModal from '@/components/WelcomeModal'
import TypingEffect from '@/components/TypingEffect'
import ChaosManager from '@/components/ChaosManager'
import ChaosWrapper from '@/components/ChaosWrapper'
import EvasiveWrapper from '@/components/EvasiveWrapper'
import BSOD from '@/components/BSOD'
import { ArrowRight, ShieldCheck, Zap, Heart, Copy, Check, X, Star, Info, MessageCircle, AlertCircle, Code, Coffee, Cpu, Terminal, Activity, History, Target, LockOpen, Rocket, HardDrive, XCircle, CheckCircle2, Laptop, Package, Receipt, Video, Bug, MessageSquare, Settings, BarChart3, Mic2, MonitorOff, Keyboard, Wrench } from 'lucide-react'
import { useState } from 'react'

export default function Home() {
  const [copied, setCopied] = useState(false)
  const [showBSOD, setShowBSOD] = useState(false)
  const stk = "3711007752"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(stk)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen">
      <WelcomeModal />
      <ChaosManager />
      <BSOD isActive={showBSOD} onClose={() => setShowBSOD(false)} />
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-purple-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-8">
            <ChaosWrapper>
              <EvasiveWrapper>
                <motion.a
                  href="#donate"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-black text-lg border-2 border-emerald-500/20 shadow-xl shadow-emerald-500/10 animate-bounce cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-colors"
                >
                  NUÔI (MỘT MÌNH) DEV NGAY
                </motion.a>
              </EvasiveWrapper>
            </ChaosWrapper>

            <ChaosWrapper className="flex flex-col items-center justify-center gap-6">
              <TypingEffect
                text="HÃY NUÔI DEV."
                className="text-5xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase gradient-text"
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.8 }}
                className="text-xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-4 text-center"
              >
                <span className="text-blue-600 dark:text-blue-400">ĐỂ CẢ ĐỜI ẤM NO</span>
              </motion.div>
            </ChaosWrapper>

            <ChaosWrapper>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-2xl mx-auto text-xl md:text-2xl font-bold text-slate-600 dark:text-slate-300 italic"
              >
                "Cầm tiền thì sợ tiền rơi,<br />
                Mang đi nuôi dev đời đời ấm no."
              </motion.p>
            </ChaosWrapper>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-6"
            >
              <ChaosWrapper>
                <Link
                  href="/transactions"
                  className="px-10 py-5 bg-blue-600 text-white rounded-3xl font-black text-xl shadow-2xl shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                >
                  <Activity size={24} /> Check Logs Realtime
                </Link>
              </ChaosWrapper>
              <ChaosWrapper>
                <Link
                  href="/donors"
                  className="px-10 py-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-3xl font-black text-xl shadow-xl border-4 border-slate-100 dark:border-slate-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                >
                  <History size={24} /> Lịch Sử Pull Request
                </Link>
              </ChaosWrapper>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Stats Dashboard */}
      <section className="py-24 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase flex items-center justify-center gap-4">
              <Target size={48} className="text-blue-600 hidden md:block" /> TẠI SAO NÊN NUÔI DEV?
            </h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm md:text-base">Nếu không nuôi, Dev sẽ tự sinh Bug để giải trí!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {[
              { 
                title: "Webhook Sao Kê", 
                desc: "Cập nhật từng giây qua API! Nhanh hơn cả tốc độ Build của Next.js!",
                icon: Zap,
                color: "text-blue-500"
              },
              { 
                title: "Báo Cáo Chi Tiêu", 
                desc: "Minh bạch 1000%! Báo cáo từ ly cà phê Highland đến gói mì tôm Hảo Hảo!",
                icon: LockOpen,
                color: "text-emerald-500"
              },
              { 
                title: "Optimize Resource", 
                desc: "Tiền donate chỉ dùng để mua RAM, cà phê và phở. Tuyệt đối không có Bug!",
                icon: Rocket,
                color: "text-orange-500"
              },
              { 
                title: "Support 24/7", 
                desc: "Hỏi Dev ăn gì, fix bug ra sao bất cứ lúc nào (trừ lúc đang họp Daily Standup!)",
                icon: MessageCircle,
                color: "text-purple-500"
              }
            ].map((f, i) => (
              <ChaosWrapper key={i}>
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="glass-card p-8 rounded-[2.5rem] border-2 border-transparent hover:border-blue-500/20 transition-all text-center space-y-4 flex flex-col items-center"
                >
                  <f.icon size={48} className={f.color} />
                  <h3 className="text-xl font-black uppercase tracking-tighter">{f.title}</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              </ChaosWrapper>
            ))}
          </div>

          <StatsDashboard />
        </div>
      </section>

      {/* Comparison Section - THE "DEV" SARCASM */}
      <section className="py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-6xl font-black tracking-tighter mb-4 uppercase flex items-center justify-center gap-4">
              <HardDrive size={54} className="text-slate-400 hidden md:block" /> SO SÁNH VỚI "PROJECT KHÁC"
            </h2>
            <div className="h-2 w-24 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Legacy Project */}
            <ChaosWrapper>
              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="p-10 bg-slate-100 dark:bg-slate-900/50 rounded-[3rem] space-y-8 opacity-60 grayscale hover:grayscale-0 transition-all border-2 border-transparent hover:border-red-500/20"
              >
                <div className="flex items-center gap-4 text-red-600">
                  <X size={48} strokeWidth={3} />
                  <h3 className="text-4xl font-black uppercase tracking-tighter">Legacy Dev:</h3>
                </div>
                <ul className="space-y-6">
                  {[
                    "Sao kê bằng tay (Manual Input), sai số tùm lum",
                    "File báo cáo PDF mờ căm như màn hình xanh chết chóc",
                    "Spending logic: 1 + 1 = 0 (Do lỗi tràn bộ nhớ)",
                    "Block người hỏi vì \"It works on my machine\""
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-xl font-bold text-slate-400">
                      <XCircle className="text-red-500 mt-1 flex-shrink-0" size={24} /> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </ChaosWrapper>

            {/* MODERN DEV */}
            <ChaosWrapper>
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="p-10 bg-blue-600 text-white rounded-[3rem] space-y-8 shadow-2xl shadow-blue-500/40 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform">
                  <Terminal size={120} fill="white" />
                </div>
                <div className="flex items-center gap-4 relative z-10">
                  <Check size={48} strokeWidth={3} />
                  <h3 className="text-4xl font-black uppercase tracking-tighter">Modern Dev:</h3>
                </div>
                <ul className="space-y-6 relative z-10">
                  {[
                    "Unit Test cho từng đồng chi tiêu (100% Coverage)",
                    "Hóa đơn 4K, Render bằng GPU, sắc nét đến từng pixel",
                    "Webhook tự động báo về từng gói mì tôm",
                    "Mở Issue công khai, trả lời nhanh hơn ChatGPT"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-xl font-bold">
                      <CheckCircle2 className="text-white mt-1 flex-shrink-0" size={24} /> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </ChaosWrapper>
          </div>
        </div>
      </section>

      {/* Commitments & Budget Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Cam Kết Của Dev */}
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase flex items-center gap-4">
                  <Laptop size={48} className="text-amber-500 hidden md:block" /> CAM KẾT VÀNG CỦA DEV:
                </h2>
                <div className="h-1 w-20 bg-amber-500 rounded-full" />
              </div>
              
              <div className="space-y-8">
                {[
                  { icon: Coffee, text: "Commit sao kê mỗi ngày: Push lúc 9h sáng, No Conflict! (Kể cả Lễ, Tết)", color: "text-orange-500" },
                  { icon: Package, text: "Full Transparency: Từ License phần mềm đến tô phở 25k đều được log lại!", color: "text-blue-500" },
                  { icon: Receipt, text: "Bill chính chủ: Chụp hình, Scan, lưu trên Cloud vĩnh viễn!", color: "text-emerald-500" },
                  { icon: Video, text: "Live Debug Spending: Mở ví tiền, đếm mì tôm livestream cho anh chị xem!", color: "text-purple-500" },
                  { icon: Bug, text: "Zero Dark Patterns: Không giấu giếm, không thu phí ngầm, không phí duy trì!", color: "text-red-500" },
                  { icon: MessageSquare, text: "Hỗ trợ đa luồng: Hỏi khó đến mấy cũng trả lời bằng kiến thức Computer Science!", color: "text-indigo-500" }
                ].map((c, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 items-center bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
                  >
                    <c.icon size={32} className={c.color} />
                    <span className="font-bold text-slate-600 dark:text-slate-300">{c.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Resource Allocation */}
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase flex items-center gap-4">
                  <Settings size={48} className="text-blue-600 hidden md:block" /> ALLOCATE RESOURCE VÀO ĐÂU?
                </h2>
                <div className="h-1 w-20 bg-blue-600 rounded-full" />
              </div>

              <div className="space-y-6">
                {[
                  { label: "Cà phê & Năng lượng (Fuel để fix bug 3h sáng)", pct: 40, color: "bg-blue-600" },
                  { label: "Server, Domain, Cloud API (Để duy trì sao kê này)", pct: 20, color: "bg-purple-600" },
                  { label: "Nâng cấp Hardware (Bàn phím cơ, Chuột, RAM 64GB)", pct: 15, color: "bg-emerald-600" },
                  { label: "Y tế & Thuốc bổ mắt (Dev hay thức khuya lắm!)", pct: 10, color: "bg-amber-600" },
                  { label: "Sách & Khóa học (Để viết code sạch hơn, đỡ ăn chửi)", pct: 10, color: "bg-indigo-600" },
                  { label: "Dự phòng Bug phát sinh (Tiền điện, nước, internet)", pct: 5, color: "bg-pink-600" }
                ].map((b, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="font-bold text-sm text-slate-500 uppercase">{b.label}</span>
                      <span className="font-black text-xl text-slate-900 dark:text-white">{b.pct}%</span>
                    </div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${b.pct}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full ${b.color}`}
                      />
                    </div>
                  </div>
                ))}
                <p className="text-xs font-bold text-slate-400 italic pt-4 flex items-center gap-2">
                  <BarChart3 size={14} /> Dashboard chi tiết cập nhật hàng ngày trên website!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Heart Message */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
          <div className="inline-flex p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full animate-pulse">
            <Code size={48} strokeWidth={3} />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase tracking-widest flex items-center justify-center gap-4">
              <Mic2 size={48} className="hidden md:block" /> TÂM THƯ CỦA DEV
            </h2>
            <p className="text-xl md:text-2xl font-bold text-slate-600 dark:text-slate-300 leading-relaxed italic">
              "Trong thế giới mà Bug nhiều hơn tính năng, Tôi xin cam kết: HÃY NUÔI DEV!"
            </p>
            <p className="text-lg font-medium text-slate-500 leading-relaxed flex items-center justify-center gap-2">
              Dev nghèo, Dev cần cà phê để thức đêm, nhưng Dev KHÔNG BAO GIỜ gian lận Logic! Mỗi đồng các bạn gửi, Dev sẽ Optimize Resource đến mức tối đa!
            </p>
            <p className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center justify-center gap-2">
              P/S: Hứa không mua Macbook Pro M4 bằng tiền donate này đâu (Trừ khi anh chị bảo mua!)
            </p>
          </div>
        </div>
      </section>

      {/* QR & Info Section */}
      <section id="donate" className="py-24 bg-slate-950 dark:bg-black text-white rounded-[4rem] mx-4 md:mx-8 mb-8 overflow-hidden relative">
        <div className="absolute inset-0 bg-blue-600/10 -z-10" />
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase flex items-center justify-center gap-4">
              <Keyboard size={48} className="hidden md:block" /> PUSH CODE, GET CƠM!
            </h2>
            <p className="text-slate-400 font-bold tracking-widest uppercase flex items-center justify-center gap-2 text-sm md:text-base">
            Dev ngại lắm, đừng đưa tiền cho Dev! Nhưng nếu bạn đã cuộn đến đây thì Dev xin cảm ơn vì tấm lòng hảo tâm của bạn nhìu nhé :3
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side: Info */}
            <div className="space-y-8">
              <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 space-y-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Ngân hàng</p>
                  <p className="text-xl font-bold">BIDV - Ngân hàng Đầu tư và Phát triển Việt Nam</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Chủ tài khoản (Root Admin)</p>
                  <p className="text-2xl md:text-3xl font-black tracking-tight uppercase">TRAN ANH TU</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Số tài khoản (Address)</p>
                  <div className="flex items-center gap-4">
                    <p className="text-3xl md:text-4xl font-mono font-black tracking-tighter text-white">
                      {stk}
                    </p>
                    <button 
                      onClick={copyToClipboard}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all active:scale-90"
                    >
                      {copied ? <Check size={24} className="text-emerald-400" /> : <Copy size={24} />}
                    </button>
                  </div>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowBSOD(true)}
                className="w-full py-6 bg-white text-slate-900 rounded-[2rem] font-black text-2xl shadow-2xl shadow-white/10 flex items-center justify-center gap-3"
              >
                <Wrench size={28} /> TÔI MUỐN MAINTAIN BẠN!
              </motion.button>
            </div>

            {/* Right Side: QR Code */}
            <div className="flex justify-center lg:justify-end">
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="relative p-6 bg-white rounded-[3rem] shadow-2xl shadow-blue-500/40 border-8 border-white/20"
                >
                  <div className="relative w-72 h-72 md:w-80 md:h-80 overflow-hidden rounded-2xl">
                    <Image 
                      src="https://qr.sepay.vn/img?acc=96247RDFO9&bank=BIDV" 
                      alt="QR Banking TRAN ANH TU" 
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest whitespace-nowrap shadow-xl flex items-center gap-2">
                    Quét để Merge cà phê <Coffee size={16} />
                  </div>
                </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">
            <AlertCircle size={14} className="text-amber-500" /> SYSTEM WARNING
          </div>
          <p className="text-slate-400 text-[10px] font-medium leading-relaxed uppercase tracking-widest">
            Trang web này mang tính chất giải trí cao (High Availability Humor). Mọi nội dung cợt nhả không nhằm mục đích xúc phạm bất kỳ ai. 
            Vui lòng không gửi mã độc vào số tài khoản, Dev chỉ nhận VND và cà phê để duy trì uptime của cơ thể.
          </p>
        </div>
      </section>
    </div>
  )
}
