import { z } from 'zod';

export const walletCreateSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['cash', 'bank', 'e_wallet']),
  currency: z.string().min(1),
});

export const walletUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  balance: z.number().optional(),
  currency: z.string().min(1).optional(),
});

export const getWalletParamsSchema = z.object({
  id: z.coerce.number(),
});

export const getAllWalletQuerySchema = z.object({
  type: z.enum(['cash', 'bank', 'e_wallet']).optional(),
});