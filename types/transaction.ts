import { z } from 'zod'

export const TransactionStatus = z.enum(['pending', 'verified', 'rejected'])
export type TransactionStatus = z.infer<typeof TransactionStatus>

export const WebhookPayloadSchema = z.object({
  // Original fields (for testing/generic)
  transaction_id: z.string().optional(),
  amount: z.number().positive().optional(),
  sender_name: z.string().optional(),
  sender_account: z.string().optional(),
  message: z.string().optional(),
  timestamp: z.string().or(z.date()).optional(),

  // SePay specific fields
  id: z.union([z.string(), z.number()]).optional(),
  gateway: z.string().optional(),
  transactionDate: z.string().optional(),
  accountNumber: z.string().optional(),
  code: z.string().optional().nullable(),
  content: z.string().optional(),
  transferType: z.string().optional(),
  transferAmount: z.number().optional(),
  accumulated: z.number().optional(),
  subAccount: z.string().optional().nullable(),
  referenceCode: z.string().optional(),
  description: z.string().optional(),
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

