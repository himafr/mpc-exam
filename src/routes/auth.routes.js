import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';
import { LoginInput } from '../validators/auth.validator.js';

const router = Router();

router.post('/login', validate({ body: LoginInput }), login);

export default router;
