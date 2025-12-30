# Hướng dẫn cấu hình Webhook

## Tổng quan

Webhook endpoint nhận thông báo giao dịch từ ngân hàng/API banking và tự động cập nhật vào database.

## Endpoint

**URL**: `POST /api/webhook`

## Bảo mật

### 1. Signature Verification

Webhook sử dụng HMAC SHA256 để xác thực request. Header cần gửi kèm:

- `x-webhook-signature` hoặc `x-signature`: Signature được tính từ payload và secret key

**Cách tính signature (Node.js):**
```javascript
const crypto = require('crypto');
const secret = 'your-webhook-secret';
const payload = JSON.stringify(requestBody);
const signature = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');
```

### 2. IP Whitelist

Cấu hình IP whitelist trong file `.env`:

```
WEBHOOK_ALLOWED_IPS="192.168.1.100,203.0.113.0"
```

Nếu để trống, sẽ chấp nhận tất cả IP (không khuyến khích cho production).

### 3. Rate Limiting

Mặc định: 10 requests/phút cho mỗi IP.

## Payload Format

### Request Body (JSON)

```json
{
  "transaction_id": "TXN123456789",
  "amount": 100000,
  "sender_name": "Nguyễn Văn A",
  "sender_account": "1234567890",
  "message": "Ủng hộ developer",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Fields

- `transaction_id` (required, string): Mã giao dịch duy nhất từ ngân hàng
- `amount` (required, number): Số tiền (VND)
- `sender_name` (required, string): Tên người chuyển
- `sender_account` (optional, string): Số tài khoản người chuyển
- `message` (optional, string): Nội dung chuyển khoản
- `timestamp` (optional, string/date): Thời gian giao dịch (ISO 8601)

### Response

**Success (201):**
```json
{
  "message": "Transaction received",
  "transactionId": "clx...",
  "status": "verified"
}
```

**Error (400/401/403/429/500):**
```json
{
  "error": "Error message"
}
```

## Auto Verification

Cấu hình tự động xác minh giao dịch trong file `.env`:

```
AUTO_VERIFY_TRANSACTIONS=true
```

- `true`: Giao dịch sẽ tự động được đánh dấu là `verified` ngay khi nhận được
- `false`: Giao dịch sẽ ở trạng thái `pending`, cần xác minh thủ công

## Testing

### Sử dụng cURL

```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-signature: YOUR_SIGNATURE" \
  -d '{
    "transaction_id": "TEST123",
    "amount": 50000,
    "sender_name": "Test User",
    "sender_account": "1234567890",
    "message": "Test donation"
  }'
```

### Sử dụng Postman

1. Method: POST
2. URL: `http://localhost:3000/api/webhook`
3. Headers:
   - `Content-Type: application/json`
   - `x-webhook-signature: YOUR_SIGNATURE`
4. Body (raw JSON):
```json
{
  "transaction_id": "TEST123",
  "amount": 50000,
  "sender_name": "Test User",
  "message": "Test donation"
}
```

## Xử lý lỗi

### Transaction đã tồn tại

Nếu `transaction_id` đã tồn tại trong database, API sẽ trả về status 200 với thông báo:

```json
{
  "message": "Transaction already exists",
  "transactionId": "existing-id"
}
```

### Invalid Signature

Nếu signature không hợp lệ, API trả về 401:

```json
{
  "error": "Invalid signature"
}
```

### Rate Limit Exceeded

Nếu vượt quá rate limit, API trả về 429:

```json
{
  "error": "Rate limit exceeded"
}
```

## Production Checklist

- [ ] Đặt `WEBHOOK_SECRET` mạnh và bảo mật
- [ ] Cấu hình IP whitelist chính xác
- [ ] Kiểm tra HTTPS được bật
- [ ] Test với dữ liệu thực từ ngân hàng
- [ ] Monitor logs để phát hiện lỗi
- [ ] Setup alert cho failed webhooks

