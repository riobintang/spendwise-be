// import { WalletCreateInput } from "../../generated/prisma/models.js";
import { Wallet, WalletCreateInput, WalletUpdateInput } from "./wallet.type";
import prisma from "../prisma/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import createHttpError from "http-errors";

export async function listWallets(userId: number): Promise<Wallet[]> {
  return await prisma.wallet.findMany({
    where: { userId },
  });
}

export async function createWallet(
  data: WalletCreateInput,
  userId: number
): Promise<Wallet> {
  // TODO: Replace with Prisma create
  return await prisma.wallet.create({
    data: {
      name: data.name,
      type: data.type,

      currency: data.currency,
      userId: userId,
    },
  });
}

export async function updateWallet(
  id: number,
  data: WalletUpdateInput,
  userId: number
): Promise<Wallet> {
  const wallet = await prisma.wallet.findFirst({
    where: { id, userId },
  });
  if (!wallet) {
    throw createHttpError(404, "Wallet not found");
  }

  return await prisma.wallet.update({
    where: { id },
    data: {
      name: data.name,
      type: data.type,
      currency: data.currency,
    },
  });
}

export async function updateBalance(
  id: number,
  amount: Decimal,
  userId: number
): Promise<Wallet> {
  const wallet = await prisma.wallet.findUnique({
    where: { id },
  });
  if (!wallet) {
    throw createHttpError(404, "Wallet not found");
  }
  if (wallet.userId !== userId) {
    throw createHttpError(401, "Unauthorized");
  }

  return await prisma.wallet.update({
    where: { id },
    data: {
      balance: wallet.balance.add(amount),
    },
  });
}

export async function deleteWallet(id: number, userId: number): Promise<void> {
  const wallet = await prisma.wallet.findFirst({
    where: { id, userId },
    select: {
      id: true,
      _count: {
        select: {
          transactions: true,
        },
      },
    },
  });
  if (!wallet) {
    throw createHttpError(404, "Wallet not found");
  }

  if (wallet._count.transactions > 0) {
    throw createHttpError(
      400,
      "Cannot delete wallet with existing transactions"
    );
  }

  await prisma.wallet.delete({
    where: { id },
  });
}
