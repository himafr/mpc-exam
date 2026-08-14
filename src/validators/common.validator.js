import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'id must be a positive integer').transform(Number),
});

// Shared pagination + search query params (bonus feature: pagination, filtering, search)
export const paginationQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine((v) => v >= 1, 'page must be >= 1')
    .optional(),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine((v) => v >= 1 && v <= 100, 'limit must be between 1 and 100')
    .optional(),
  search: z.string().trim().min(1).optional(),
});
