import { z } from 'zod'

export const TransactionStatus = z.enum(['pending', 'verified', 'rejected'])
export type TransactionStatus = z.infer<typeof TransactionStatus>

export const WebhookPayloadSchema = z.object({
  transaction_id: z.string(),
  amount: z.number().positive(),
  sender_name: z.string(),
  sender_account: z.string().optional(),
  message: z.string().optional(),
  timestamp: z.string().or(z.date()).optional(),
})

export type WebhookPayload = z.infer<typeof WebhookPayloadSchema>

export interface Transaction {
  id: string
  transactionId: string
  amount: number
  senderName: string
  senderAccount: string | null
  message: string | null
  status: TransactionStatus
  verifiedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface Donor {
  id: string
  name: string
  totalAmount: number
  transactionCount: number
  firstDonationAt: Date | null
  lastDonationAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface Stats {
  totalAmount: number
  totalDonors: number
  totalTransactions: number
  recentTransactions: Transaction[]
  topDonors: Donor[]
}

