import { Router } from 'express';
import StudentController from '../controllers/students.controller.js';
// import { validate } from '../middlewares/validate.js';
import { requireAuth } from '../middlewares/auth.js';
// import { createStudentSchema, updateStudentSchema } from '../validators/student.validator.js';
// import { idParamSchema, paginationQuerySchema } from '../validators/common.validator.js';

const router = Router();

router.use(requireAuth);

router.get('/',  StudentController.getStudents);
router.get('/:id', StudentController.getStudentById);
router.post('/',  StudentController.createStudent);
router.put('/:id', StudentController.updateStudent);
router.delete('/:id', StudentController.deleteStudent);

export default router;