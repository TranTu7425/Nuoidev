import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatCurrency, formatDateShort } from './utils'

/**
 * Loại bỏ dấu tiếng Việt để hiển thị tốt trên PDF mà không cần nhúng font lớn
 */
function removeVietnameseTones(str: string): string {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i")
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
  str = str.replace(/đ/g, "d")
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A")
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E")
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I")
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O")
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U")
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y")
  str = str.replace(/Đ/g, "D")
  // Một số trình duyệt có thể dùng các ký tự tổ hợp
  str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
  return str
}

export async function exportTransactionsToPDF(transactions: any[]) {
  if (!transactions || transactions.length === 0) {
    alert('Khong co giao dich nao de xuat.')
    return
  }

  // SỬ DỤNG TIẾNG VIỆT KHÔNG DẤU ĐỂ ĐẢM BẢO HIỂN THỊ 100% TRÊN MỌI THIẾT BỊ
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(22)
  doc.setTextColor(30, 41, 59) // slate-800
  doc.text('SAO KE GIAO DICH - NUOIDEV', 14, 22)
  
  doc.setFontSize(10)
  doc.setTextColor(100, 116, 139) // slate-500
  const now = new Date()
  doc.text(`Ngay xuat: ${now.toLocaleDateString('vi-VN')} ${now.toLocaleTimeString('vi-VN')}`, 14, 30)
  doc.text(`Tong so giao dich: ${transactions.length}`, 14, 36)
  
  const totalAmount = transactions.reduce((sum, tx) => sum + Number(tx.amount), 0)
  doc.setFontSize(11)
  doc.setTextColor(37, 99, 235) // blue-600
  doc.text(`Tong so tien quyen gop: ${formatCurrency(totalAmount).replace('₫', 'VND')}`, 14, 42)
  
  doc.setFontSize(10)
  doc.setTextColor(100, 116, 139) // slate-500
  doc.text('He thong xac thuc tu dong 100%', 14, 48)

  const tableColumn = ["STT", "Ngay", "Nguoi gui", "Noi dung", "So tien"]

  const tableRows = transactions.map((tx, index) => [
    index + 1,
    formatDateShort(tx.createdAt),
    removeVietnameseTones(tx.senderName || 'An danh'),
    removeVietnameseTones(tx.message || ''),
    formatCurrency(Number(tx.amount)).replace('₫', 'VND')
  ])

  // Generate table
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 55,
    styles: { 
      font: 'helvetica', 
      fontStyle: 'normal',
      fontSize: 9,
      cellPadding: 3
    },
    headStyles: { 
      fillColor: [37, 99, 235], // blue-600
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: { 
      fillColor: [241, 245, 249] // slate-100
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 35 },
      2: { cellWidth: 40 },
      4: { cellWidth: 35, halign: 'right' }
    }
  })

  // Save the PDF
  doc.save(`sao-ke-nuoidev-${new Date().toISOString().split('T')[0]}.pdf`)
}
