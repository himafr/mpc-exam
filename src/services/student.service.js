import { pool } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { resolvePagination, buildMeta } from "../utils/pagination.js";
import StudentRepo from "../repository/studentRepo.js";

class StudentService {
  static getStudents = async (page, limit, search) => {
    const { meta, rows } = await StudentRepo.getStudents(page, limit, search);
    return { rows, meta };
  };

  static getStudentById = async (id) => {
    const { rows } = await StudentRepo.getStudentById(id);
    if (rows.length === 0) throw ApiError.notFound("Student not found");
    return { rows: rows[0] };
  };

  static createStudent = async (body) => {
    const { rows } = await StudentRepo.createStudent(body);
    return { rows: rows[0] };
  };

  // PUT /students/:id (full replace)
  static updateStudent = async (id, body) => {
const {rows}=await StudentRepo.updateStudent(id,body)
    if (rows.length === 0) throw ApiError.notFound("Student not found");
    return { rows: rows[0] };
  };

  static deleteStudent = async (id) => {
    const { rows } = await StudentRepo.deleteStudent(id)
    if (rows.length === 0) throw ApiError.notFound("Student not found");
  };
}

export default StudentService;
