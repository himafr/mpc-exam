import { z } from 'zod';

export const createStudentSchema = z.object({
  firstName: z.string({ required_error: 'firstName is required' }).trim().min(1).max(100),
  lastName: z.string({ required_error: 'lastName is required' }).trim().min(1).max(100),
  email: z.string({ required_error: 'email is required' }).email('email must be valid'),
  yearLevel: z
    .number({ invalid_type_error: 'yearLevel must be a number' })
    .int()
    .min(1)
    .max(8)
    .optional()
    .default(1),
});

export const updateStudentSchema = createStudentSchema;

