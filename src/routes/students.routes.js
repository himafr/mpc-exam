import { Router } from 'express';
import StudentController from '../controllers/students.controller.js';
import { requireAuth } from '../middlewares/auth.js';
import { idParamSchema, paginationQuerySchema } from '../validators/common.validator.js';
import { createStudentSchema, updateStudentSchema } from '../validators/student.validator.js';
import { validate } from '../middlewares/validate.js';


const router = Router();

router.use(requireAuth);

router.get('/', validate({ query: paginationQuerySchema }),  StudentController.getStudents);
router.get('/:id',validate({ params: idParamSchema }),  StudentController.getStudentById);
router.post('/',validate({ body: createStudentSchema }),   StudentController.createStudent);
router.put('/:id', validate({ params: idParamSchema, body: updateStudentSchema }), StudentController.updateStudent);
router.delete('/:id',validate({ params: idParamSchema }), StudentController.deleteStudent);

export default router;