import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { requireAuth } from '../middlewares/auth.js';
import AssignmentsController from '../controllers/assignments.controller.js';
import { assignmentQuerySchema, createAssignmentSchema, patchAssignmentSchema } from '../validators/assignment.validator.js';
import { idParamSchema } from '../validators/common.validator.js';

const router = Router();

router.use(requireAuth);

router.get('/', validate({ query: assignmentQuerySchema }),AssignmentsController.getAssignments);
router.post('/', validate({ body: createAssignmentSchema }), AssignmentsController.createAssignment);
router.patch('/:id',validate({ params: idParamSchema, body: patchAssignmentSchema }), AssignmentsController.patchAssignment);

export default router;
