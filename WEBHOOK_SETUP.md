# Hướng dẫn cấu hình Webhook (SePay.vn)

## Tổng quan

Dự án đã được tích hợp sẵn để nhận thông báo giao dịch tự động từ **SePay.vn**. Khi có người quét mã QR và chuyển khoản thành công, SePay sẽ gửi tín hiệu về website của bạn để hiển thị sao kê tức thì.

## Các bước cấu hình trên SePay.vn

1.  **Đăng ký & Kết nối**: Đăng ký tài khoản trên [SePay.vn](https://sepay.vn) và kết nối với tài khoản ngân hàng BIDV của bạn.
2.  **Tạo Webhook**: 
    *   Vào mục **Cấu hình Webhook** trên SePay.
    *   Nhấn **Thêm Webhook mới**.
    *   **URL nhận Webhook**: `https://ten-mien-cua-ban.com/api/webhook` (Thay bằng domain thực tế của bạn).
    *   **Kiểu xác thực**: Chọn `API Key (Bearer Token)`.
    *   **API Key**: Copy mã API Key mà SePay cung cấp.

## Cấu hình trên Website (File .env)

Mở file `.env` và cập nhật thông tin:

```env
# Dán API Key từ SePay vào đây
WEBHOOK_SECRET="MÃ_API_KEY_TU_SEPAY"

# Tự động xác minh giao dịch (Nên để true để hiện lên website ngay)
AUTO_VERIFY_TRANSACTIONS=true
```

## Cách thức hoạt động

1.  **Xác thực**: Website sẽ kiểm tra header `Authorization: Bearer <WEBHOOK_SECRET>` từ SePay gửi tới.
2.  **Xử lý**: Hệ thống tự động chuyển đổi dữ liệu từ SePay (số tiền, nội dung, mã giao dịch) sang định dạng của website.
3.  **Real-time**: Ngay khi SePay gửi tín hiệu, website sẽ lưu vào database và thông báo tới trang "Check Logs Realtime" mà không cần load lại trang.

## Payload mẫu từ SePay (Hệ thống đã hỗ trợ)

```json
{
  "id": 123456,
  "gateway": "BIDV",
  "transactionDate": "2024-01-01 10:00:00",
  "accountNumber": "3711007752",
  "content": "ND12345 TRAN ANH TU UNG HO",
  "transferType": "in",
  "transferAmount": 50000,
  "referenceCode": "BIDV.12345.6789",
  "description": "Chuyen tien den TRAN ANH TU..."
}
```

## Kiểm tra thử (Test)

Bạn có thể dùng tính năng **"Gửi thử"** trên giao diện Webhook của SePay để kiểm tra xem dữ liệu có đổ về website hay không. 

---
*Lưu ý: Đảm bảo website của bạn đã được deploy lên môi trường có HTTPS để SePay có thể gửi dữ liệu thành công.*
