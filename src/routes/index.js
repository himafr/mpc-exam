import { Router } from 'express';
import authRoutes from './auth.routes.js';
import studentsRoutes from './students.routes.js';
import coursesRoutes from './courses.routes.js';
import assignmentsRoutes from './assignments.routes.js';

const router = Router();

router.get('/health', (_req, res) => res.status(200).json({ success: true, data: { status: 'ok' } }));

router.use('/', authRoutes);
router.use('/students', studentsRoutes);
router.use('/courses', coursesRoutes);
router.use('/assignments', assignmentsRoutes);

export default router;
