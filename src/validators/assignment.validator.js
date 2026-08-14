import { z } from 'zod';

const statusEnum = z.enum(['pending', 'submitted', 'graded']);

export const createAssignmentSchema = z.object({
  courseId: z.number({ required_error: 'courseId is required' }).int().positive(),
  title: z.string({ required_error: 'title is required' }).trim().min(1).max(150),
  description: z.string().trim().max(2000).optional(),
  dueDate: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), 'dueDate must be a valid date (YYYY-MM-DD)')
    .optional(),
  status: statusEnum.optional().default('pending'),
});

// PATCH = partial update, every field optional but at least one required
export const patchAssignmentSchema = z
  .object({
    courseId: z.number().int().positive().optional(),
    title: z.string().trim().min(1).max(150).optional(),
    description: z.string().trim().max(2000).optional(),
    dueDate: z
      .string()
      .refine((v) => !Number.isNaN(Date.parse(v)), 'dueDate must be a valid date (YYYY-MM-DD)')
      .optional(),
    status: statusEnum.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update',
  });

export const assignmentQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().trim().min(1).optional(),
  courseId: z.string().regex(/^\d+$/).transform(Number).optional(),
  status: statusEnum.optional(),
});

