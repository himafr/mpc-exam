import { pool } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { resolvePagination, buildMeta } from '../utils/pagination.js';
import StudentService from '../services/student.service.js';

class StudentController {
  // GET /students?page=&limit=&search=
  static getStudents = asyncHandler(async (req, res) => {

    const { page, limit, search } = req.query;
    const {meta,rows}=await StudentService.getStudents(page,limit,search)

    return sendSuccess(res, 200, rows,meta);
  });

  // GET /students/:id
  static getStudentById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rows } = await StudentService.getStudentById(id);
    return sendSuccess(res, 200, rows);
  });

  // POST /students
  static createStudent = asyncHandler(async (req, res) => {
    const body = req.body;

    const { rows } = await StudentService.createStudent(body)

    return sendSuccess(res, 201, rows);
  });

  static updateStudent = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const body = req.body;

    const { rows } = await StudentService.updateStudent(id,body)
    return sendSuccess(res, 200, rows);
  });

  // DELETE /students/:id
  static deleteStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;

    await StudentService.deleteStudent(id)
    return res.status(204).send();
  });
}

export default StudentController;