import { Decimal } from "@prisma/client/runtime/library";
import prisma from "../prisma/prisma";
import { TransactionSummary, MonthlySummary } from "./summary.type";

export async function getSummary(userId: number): Promise<{
  current: TransactionSummary;
  monthly: MonthlySummary[];
}> {
  const getTransaction = await prisma.transaction.findMany({
    where: { userId },
    include: {
      category: true,
    },
  });

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const allCategory = await prisma.category.findMany({
    where: { userId },
  });
  const currentSummary: TransactionSummary = {
    balance: new Decimal(0),
    totalIncome: new Decimal(0),
    totalExpense: new Decimal(0),
    byCategory: {
      ...allCategory.reduce((acc, category) => {
        acc[category.name] = new Decimal(0);
        return acc;
      }, {}),
    },
  };

  const monthlySummaryMap: Map<string, MonthlySummary> = new Map();

  getTransaction.forEach((transaction) => {
    const date = new Date(transaction.date);
    const month = date.getMonth();
    const year = date.getFullYear();
    const key = `${year}-${month}`;

    if (year === currentYear && month === currentMonth) {
      if (transaction.type === "income") {
        currentSummary.totalIncome = currentSummary.totalIncome.add(
          transaction.amount
        );
      } else {
        currentSummary.totalExpense = currentSummary.totalExpense.add(
          transaction.amount
        );
      }
    }

    if (!monthlySummaryMap.has(key)) {
      monthlySummaryMap.set(key, {
        month: month + 1,
        balance: new Decimal(0),
        income: new Decimal(0),
        expense: new Decimal(0),
      });
    }

    const summary = monthlySummaryMap.get(key)!;
    if (transaction.type === "income") {
      summary.income = summary.income.add(transaction.amount);
    } else {
      summary.expense = summary.expense.add(transaction.amount);
    }
  });

  return {
    current: currentSummary,
    monthly: Array.from(monthlySummaryMap.values()).sort((a, b) => {
      if (a.month === b.month) {
        return 0;
      }
      return a.month > b.month ? -1 : 1;
    }),
  };
}
