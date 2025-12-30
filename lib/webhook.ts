import { WebhookPayloadSchema, type WebhookPayload } from '@/types/transaction'
import { z } from 'zod'
import crypto from 'crypto'

/**
 * Xác thực webhook bằng secret key
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false
  
  // Implement signature verification logic
  // Ví dụ: HMAC SHA256
  // Trong thực tế, cần implement theo cách ngân hàng/API banking yêu cầu
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

/**
 * Kiểm tra IP whitelist
 */
export function isAllowedIP(ip: string, allowedIPs: string[]): boolean {
  if (allowedIPs.length === 0) return true // Nếu không có whitelist thì cho phép tất cả
  return allowedIPs.includes(ip)
}

/**
 * Parse và validate webhook payload
 */
export function parseWebhookPayload(data: unknown): WebhookPayload {
  return WebhookPayloadSchema.parse(data)
}

/**
 * Ẩn một phần số tài khoản để bảo mật
 */
export function maskAccount(account: string | null | undefined): string {
  if (!account) return 'Ẩn danh'
  if (account.length <= 4) return '****'
  return account.slice(0, 2) + '****' + account.slice(-2)
}

