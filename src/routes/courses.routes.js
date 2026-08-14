import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { createCourseSchema } from '../validators/course.validator.js';
import { idParamSchema, paginationQuerySchema } from '../validators/common.validator.js';
import CoursesController from '../controllers/courses.controller.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.use(requireAuth);

router.get('/',validate({ query: paginationQuerySchema }), CoursesController.getCourses);
router.get('/:id', validate({ params: idParamSchema }), CoursesController.getCourseById);
router.post('/',validate({ body: createCourseSchema }),  CoursesController.createCourse);

export default router;
