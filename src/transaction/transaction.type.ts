import { Decimal } from "@prisma/client/runtime/library";

export interface Transaction {
  id: number;
  walletId: number;
  categoryId: number;
  type: 'income' | 'expense';
  amount: Decimal;
  description?: string | null;
  date: Date; // ISO date format: YYYY-MM-DD
  receiptImage?: string | null;
  createdAt: Date; // ISO datetime
}

export interface TransactionCreateInput {
  walletId: number;
  categoryId: number;
  type: 'income' | 'expense';
  amount: number;
  description?: string | null;
  date: string; // ISO date format: YYYY-MM-DD
  receiptImage?: string | null | undefined;
  userId: number;
}

export interface TransactionUpdateInput {
  walletId?: number;
  categoryId?: number;
  type?: 'income' | 'expense';
  amount?: number;
  description?: string | null;
  date?: string; // ISO date format: YYYY-MM-DD
  receiptImage?: string | null;
}