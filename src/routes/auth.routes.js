import { Router } from 'express';
import { login } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { loginSchema } from '../validators/auth.validator';

const router = Router();

router.post('/login', validate({ body: loginSchema }), login);

export default router;
