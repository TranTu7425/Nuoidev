'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, Scale, FileText, AlertCircle, Info, Lock, Eye, Handshake } from 'lucide-react'
import Link from 'next/link'

export default function TermsPage() {
  const sections = [
    {
      icon: <Info className="text-blue-500" />,
      title: "1. Mục đích dự án",
      content: "Nuoidev là một dự án cá nhân mang tính chất giải trí và gây quỹ cộng đồng tự nguyện. Mục đích chính là để duy trì chi phí vận hành (server, domain, API) và tiếp thêm động lực cho Developer thông qua việc 'deploy cơm' (donate)."
    },
    {
      icon: <Eye className="text-emerald-500" />,
      title: "2. Tính minh bạch",
      content: "Mọi giao dịch chuyển khoản tới số tài khoản công khai trên website đều được hệ thống Webhook tự động ghi nhận và hiển thị công khai trên bảng sao kê realtime. Chúng tôi không can thiệp vào dữ liệu này để đảm bảo tính trung thực 100%."
    },
    { section_break: true },
    {
      icon: <Lock className="text-amber-500" />,
      title: "3. Quyền riêng tư & Dữ liệu",
      content: "Bằng việc thực hiện giao dịch, bạn đồng ý rằng: Tên người gửi (nếu có trong nội dung sao kê) và nội dung chuyển khoản sẽ được hiển thị công khai. Chúng tôi khuyến cáo không ghi các thông tin cá nhân nhạy cảm, số điện thoại hoặc địa chỉ nhà riêng vào nội dung chuyển khoản."
    },
    {
      icon: <Handshake className="text-purple-500" />,
      title: "4. Chính sách hoàn tiền",
      content: "Vì đây là dự án gây quỹ tự nguyện và các khoản đóng góp được coi là quà tặng (gift), chúng tôi không có chính sách hoàn tiền sau khi giao dịch đã được hệ thống ghi nhận thành công."
    },
    {
      icon: <AlertCircle className="text-red-500" />,
      title: "5. Giới hạn trách nhiệm",
      content: "Developer không chịu trách nhiệm cho bất kỳ thiệt hại gián tiếp nào phát sinh từ việc sử dụng website hoặc việc hiển thị thông tin sao kê công khai theo yêu cầu minh bạch của dự án."
    },
    {
      icon: <Scale className="text-indigo-500" />,
      title: "6. Thay đổi điều khoản",
      content: "Chúng tôi có quyền cập nhật các điều khoản này bất cứ lúc nào để phù hợp với quy định pháp luật hoặc thay đổi trong vận hành hệ thống. Việc bạn tiếp tục sử dụng website đồng nghĩa với việc chấp nhận các thay đổi đó."
    }
  ]

  return (
    <div className="min-h-screen py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-10%] w-[30%] h-[30%] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-3xl mb-4"
          >
            <ShieldCheck size={48} strokeWidth={2.5} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black tracking-tighter uppercase"
          >
            Điều Khoản <span className="gradient-text">& Dịch Vụ</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 font-bold uppercase tracking-[0.2em] text-sm"
          >
            Cập nhật lần cuối: 31 Tháng 12, 2025
          </motion.p>
        </div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            section.section_break ? (
              <div key={`break-${index}`} className="h-px bg-slate-200 dark:bg-slate-800 my-12" />
            ) : (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex-shrink-0">
                    {section.icon}
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                      {section.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-10 bg-slate-900 text-white rounded-[3rem] text-center space-y-6 shadow-2xl shadow-slate-900/20"
        >
          <div className="inline-flex p-3 bg-white/10 rounded-2xl mb-2">
            <FileText size={32} />
          </div>
          <h3 className="text-3xl font-black uppercase tracking-tight">Xác nhận chấp thuận</h3>
          <p className="text-slate-400 font-medium leading-relaxed max-w-xl mx-auto italic">
            "Bằng việc tiếp tục truy cập website và thực hiện donate, bạn xác nhận đã đọc, hiểu và đồng ý hoàn toàn với các điều khoản nêu trên."
          </p>
          <div className="pt-4">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-slate-900 rounded-2xl font-black text-lg hover:scale-105 transition-all"
            >
              Tôi đồng ý, quay lại trang chủ
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

