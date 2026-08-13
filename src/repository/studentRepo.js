import { pool } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { resolvePagination, buildMeta } from "../utils/pagination.js";

class StudentRepo {
  static getStudents = async (page, limit, search) => {
    const { page: p, limit: l, offset } = resolvePagination({ page, limit });

    const values = [];
    let where = "";
    if (search) {
      values.push(`%${search}%`);
      where = `WHERE first_name ILIKE $${values.length} OR last_name ILIKE $${values.length} OR email ILIKE $${values.length}`;
    }

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS count FROM students ${where}`,
      values,
    );
    const total = countResult.rows[0].count;

    values.push(l, offset);
    const { rows } = await pool.query(
      `SELECT id, first_name, last_name, email, year_level, created_at, updated_at
       FROM students ${where}
       ORDER BY id ASC
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );

    return { rows, meta: buildMeta(p, l, total) };
  };

  static getStudentById = async (id) => {
    const { rows } = await pool.query(
      "SELECT id, first_name, last_name, email, year_level, created_at, updated_at FROM students WHERE id = $1",
      [id],
    );
    return { rows };
  };

  static createStudent = async (body) => {
    const { firstName, lastName, email, yearLevel } = body;

    const { rows } = await pool.query(
      `INSERT INTO students (first_name, last_name, email, year_level)
       VALUES ($1, $2, $3, $4)
       RETURNING id, first_name, last_name, email, year_level, created_at, updated_at`,
      [firstName, lastName, email, yearLevel],
    );
    return { rows };
  };

  static updateStudent = async (id, body) => {
    const { firstName, lastName, email, yearLevel } = body;

    const { rows } = await pool.query(
      `UPDATE students
       SET first_name = $1, last_name = $2, email = $3, year_level = $4, updated_at = NOW()
       WHERE id = $5
       RETURNING id, first_name, last_name, email, year_level, created_at, updated_at`,
      [firstName, lastName, email, yearLevel, id],
    );

    return { rows };
  };

  static deleteStudent = async (id) => {
    const { rows } = await pool.query(
      "DELETE FROM students WHERE id = $1 RETURNING id",
      [id],
    );
    return {rows}
  };
}

export default StudentRepo;
