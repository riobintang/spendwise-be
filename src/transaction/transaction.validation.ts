import { z } from "zod";

export const transactionCreateSchema = z.object({
  walletId: z.number(),
  categoryId: z.number(),
  type: z.enum(["income", "expense"]),
  amount: z.number(),
  description: z.string().nullish(),
  date: z.string().min(1),
});

export const transactionUpdateSchema = z.object({
  amount: z.number().optional(),
  description: z.string().nullish(),
});

export const transactionIdParamSchema = z.object({
  id: z.coerce.number(),
});
