# Trang web gây quỹ ủng hộ Developer

Trang web gây quỹ minh bạch và công khai, tự động nhận thông báo giao dịch qua webhook và hiển thị tất cả giao dịch công khai.

## Tính năng

- ✅ Nhận webhook tự động từ ngân hàng/API banking
- ✅ Hiển thị công khai tất cả giao dịch đã xác minh
- ✅ Dashboard thống kê tổng quan (tổng số tiền, số người ủng hộ)
- ✅ Bức tường người ủng hộ với sắp xếp linh hoạt
- ✅ Cập nhật real-time qua Server-Sent Events (SSE)
- ✅ Bảo mật với webhook signature verification và rate limiting

## Công nghệ

- **Framework**: Next.js 14+ (App Router)
- **Database**: MySQL với Prisma ORM
- **Styling**: Tailwind CSS
- **Type Safety**: TypeScript
- **Validation**: Zod

## Cài đặt

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình database

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Cập nhật `DATABASE_URL` trong file `.env`:

```
DATABASE_URL="mysql://user:password@localhost:3306/fundraising_db"
```

### 3. Setup database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push
```

### 4. Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

## Cấu hình Webhook

### Biến môi trường

- `WEBHOOK_SECRET`: Secret key để xác thực webhook signature
- `WEBHOOK_ALLOWED_IPS`: Danh sách IP được phép (phân cách bằng dấu phẩy)
- `AUTO_VERIFY_TRANSACTIONS`: Tự động xác minh giao dịch (`true`/`false`)

### Endpoint Webhook

POST `/api/webhook`

**Headers:**
- `x-webhook-signature` hoặc `x-signature`: Signature để xác thực

**Body (JSON):**
```json
{
  "transaction_id": "TXN123456",
  "amount": 100000,
  "sender_name": "Nguyễn Văn A",
  "sender_account": "1234567890",
  "message": "Ủng hộ developer",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Response:**
```json
{
  "message": "Transaction received",
  "transactionId": "clx...",
  "status": "verified"
}
```

## Cấu trúc dự án

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── webhook/       # Webhook endpoint
│   │   ├── transactions/  # Transactions API
│   │   └── stats/         # Stats API
│   ├── page.tsx           # Trang chủ
│   ├── transactions/       # Trang danh sách giao dịch
│   └── donors/            # Trang người ủng hộ
├── components/            # React components
│   ├── StatsDashboard.tsx
│   ├── TransactionList.tsx
│   └── DonorWall.tsx
├── lib/                   # Utilities
│   ├── db.ts             # Prisma client
│   ├── webhook.ts        # Webhook utilities
│   └── utils.ts          # Helper functions
├── prisma/               # Prisma schema
│   └── schema.prisma
└── types/                # TypeScript types
```

## API Endpoints

### GET `/api/transactions`
Lấy danh sách giao dịch

**Query parameters:**
- `page`: Số trang (mặc định: 1)
- `limit`: Số lượng mỗi trang (mặc định: 20)
- `status`: Trạng thái (`verified`, `pending`, `rejected`, `all`)

### GET `/api/transactions/[id]`
Lấy thông tin chi tiết một giao dịch

### GET `/api/stats`
Lấy thống kê tổng hợp

### GET `/api/transactions/stream`
Server-Sent Events stream cho real-time updates

## Bảo mật

- ✅ Webhook signature verification
- ✅ IP whitelist
- ✅ Rate limiting (10 requests/phút)
- ✅ Input validation với Zod
- ✅ Ẩn một phần thông tin nhạy cảm (số tài khoản)

## Minh bạch

- Tất cả giao dịch đã xác minh được hiển thị công khai
- Timestamp chính xác cho mọi giao dịch
- Không thể chỉnh sửa/xóa giao dịch đã verify
- Mã giao dịch từ ngân hàng được lưu trữ để đối chiếu

## Development

```bash
# Generate Prisma Client sau khi thay đổi schema
npm run db:generate

# Tạo migration
npm run db:migrate

# Mở Prisma Studio để xem database
npm run db:studio
```

## Production

```bash
# Build
npm run build

# Start
npm start
```

## License

MIT

