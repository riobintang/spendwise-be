import { z } from "zod";

export const transactionCreateSchema = z.object({
  walletId: z.number(),
  categoryId: z.number(),
  type: z.enum(["income", "expense"]),
  amount: z.number(),
  description: z.string().min(1),
  date: z.string().min(1),
});

export const transactionUpdateSchema = z.object({
  amount: z.number().optional(),
  description: z.string().min(1).optional(),
});

export const transactionIdParamSchema = z.object({
  id: z.coerce.number(),
});
