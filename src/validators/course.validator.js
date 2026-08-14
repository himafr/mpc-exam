import { z } from 'zod';

export const createCourseSchema = z.object({
  code: z
    .string({ required_error: 'code is required' })
    .trim()
    .min(2)
    .max(20)
    .toUpperCase(),
  title: z.string({ required_error: 'title is required' }).trim().min(1).max(150),
  description: z.string().trim().max(2000).optional(),
  credits: z
    .number({ invalid_type_error: 'credits must be a number' })
    .int()
    .min(1)
    .max(12)
    .optional()
    .default(3),
});

