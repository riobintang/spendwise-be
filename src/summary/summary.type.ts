import { Decimal } from "@prisma/client/runtime/library";

export interface TransactionSummary {
  totalIncome: Decimal;
  totalExpense: Decimal;
  balance: Decimal;
  byCategory: Record<string, Decimal>;
}

export interface MonthlySummary {
  month: number; 
  income: Decimal;
  expense: Decimal;
  balance: Decimal;
}
