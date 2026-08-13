import { z } from 'zod';

export const LoginInput = z.object({
  email: z.string({ required_error: 'email is required' }).email('email must be valid'),
  password: z
    .string({ required_error: 'password is required' })
    .min(6, 'password must be at least 6 characters'),
});

// No need for LoginInput type in JS - just use the schema directly
// In your code, you can access the inferred type via JSDoc if needed:
// /**
//  * @typedef {import('zod').infer<typeof loginSchema>} LoginInput
//  */