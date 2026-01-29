import { Prisma, PrismaClient } from "../../generated/prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import prisma from "../prisma/prisma";
import {
  Transaction,
  TransactionCreateInput,
  TransactionUpdateInput,
} from "./transaction.type";
import { updateBalance } from "../wallet/wallet.service";
import createHttpError from "http-errors";

interface ListTransactionsParams {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  userId: number;
}

interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  byCategory: Record<string, number>;
}

interface ListTransactionsResult {
  transactions: Transaction[];
  summary: TransactionSummary;
}

export async function listTransactions(
  params: ListTransactionsParams,
): Promise<ListTransactionsResult> {
  const { startDate, endDate, categoryId, userId } = params;

  const where: Prisma.TransactionWhereInput = { userId };
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }
  if (categoryId) where.categoryId = parseInt(categoryId);

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { date: "desc" },
  });

  const summary = await calculateSummary(userId, where);

  return { transactions, summary };
}

async function calculateSummary(
  userId: number,
  where: Prisma.TransactionWhereInput,
): Promise<TransactionSummary> {
  const transactions = await prisma.transaction.findMany({ where });

  let totalIncome = new Decimal(0);
  let totalExpense = new Decimal(0);
  const byCategory: Record<string, number> = {};

  for (const tx of transactions) {
    if (tx.type === "income") {
      totalIncome = totalIncome.add(tx.amount);
    } else {
      totalExpense = totalExpense.add(tx.amount);
      const catId = tx.categoryId.toString();
      byCategory[catId] = (byCategory[catId] || 0) + tx.amount.toNumber();
    }
  }

  return {
    totalIncome: totalIncome.toNumber(),
    totalExpense: totalExpense.toNumber(),
    balance: totalIncome.sub(totalExpense).toNumber(),
    byCategory,
  };
}

export async function createTransaction(
  data: TransactionCreateInput,
): Promise<Transaction> {
  // TODO: Replace with Prisma create
  const transaction = await prisma.transaction.create({
    data: {
      walletId: data.walletId,
      categoryId: data.categoryId,
      type: data.type,
      amount: new Decimal(data.amount),
      description: data.description,
      date: data.date,
      userId: data.userId,
    },
  });

  await updateBalance(
    data.walletId,
    data.type === "income"
      ? new Decimal(data.amount)
      : new Decimal(data.amount).negated(),
    data.userId,
  );
  return transaction;
}

export async function updateTransaction(
  id: number,
  data: TransactionUpdateInput,
): Promise<Transaction> {
  const getTransaction = await prisma.transaction.findUnique({
    where: { id },
  });
  if (!getTransaction) {
    throw createHttpError(404, "Transaction not found");
  }

  const updatedTransaction = await prisma.transaction.update({
    where: { id },
    data: {
      categoryId: data.categoryId ?? getTransaction.categoryId,
      type: data.type ?? getTransaction.type,
      amount: data.amount ? new Decimal(data.amount) : getTransaction.amount,
      description: data.description ?? getTransaction.description,
      date: data.date ?? getTransaction.date,
    },
  });

  // Adjust wallet balance if amount or type has changed
  if (data.amount || data.type) {
    const oldAmount =
      getTransaction.type === "income"
        ? getTransaction.amount
        : getTransaction.amount.negated();
    const newAmount =
      (data.type ?? getTransaction.type) === "income"
        ? new Decimal(data.amount ?? getTransaction.amount)
        : new Decimal(data.amount ?? getTransaction.amount).negated();
    const difference = newAmount.sub(oldAmount);

    await updateBalance(
      getTransaction.walletId,
      difference,
      getTransaction.userId,
    );
  }
  return updatedTransaction;
}

export async function deleteTransaction(
  id: number,
  userId: number,
): Promise<void> {
  const transaction = await prisma.transaction.findFirst({
    where: { id, userId: userId },
  });
  if (!transaction) {
    throw createHttpError(404, "Transaction not found");
  }

  await prisma.transaction.delete({
    where: { id },
  });

  await updateBalance(
    transaction.walletId,
    transaction.type === "income"
      ? transaction.amount.negated()
      : transaction.amount,
    userId,
  );
}
