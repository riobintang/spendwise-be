import { z } from "zod";

export const categoryCreateSchema = z.object({
  name: z.string().min(1),
  // icon: z.string().min(1),
  color: z.string().min(1),
  type: z.enum(["income", "expense"]),
});

export const getCategoryParamsSchema = z.object({
  id: z.coerce.number(),
});

export const getAllCategoryQuerySchema = z.object({
  type: z.enum(["income", "expense"]).optional(),
});
export const categoryUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  icon: z.string().min(1).optional(),
  color: z.string().min(1).optional(),
  type: z.enum(["income", "expense"]).optional(),
});
