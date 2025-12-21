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
}

export async function listTransactions(
  params: ListTransactionsParams
): Promise<any> {
  // TODO: Replace with Prisma query
  return {
    transactions: [
      {
        id: "1",
        walletId: "default",
        categoryId: "food",
        type: "expense",
        amount: 45.5,
        description: "Lunch at restaurant",
        date: "2024-01-15",
        createdAt: "2024-01-15T12:30:00Z",
      },
    ],
    summary: {
      totalIncome: 5000,
      totalExpense: 500,
      balance: 4500,
      byCategory: {
        food: -150,
        transport: -50,
      },
    },
  };
}

export async function createTransaction(
  data: TransactionCreateInput
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
    data.userId
  );
  return transaction;
}

export async function updateTransaction(
  id: number,
  data: TransactionUpdateInput
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
      getTransaction.userId
    );
  }
  return updatedTransaction;
}

export async function deleteTransaction(
  id: number,
  userId: number
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
    userId
  );
}
