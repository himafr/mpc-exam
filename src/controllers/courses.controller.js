import express from "express";
const { Request, Response } = express;
import { pool } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { resolvePagination, buildMeta } from "../utils/pagination.js";

class CoursesController {
  // GET /courses?page=&limit=&search=
  static getCourses = asyncHandler(async (req, res) => {
    const { page, limit, search } = req.query;
    const { page: p, limit: l, offset } = resolvePagination({ page, limit });

    const values = [];
    let where = "";
    if (search) {
      values.push(`%${search}%`);
      where = `WHERE title ILIKE $${values.length} OR code ILIKE $${values.length}`;
    }

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS count FROM courses ${where}`,
      values,
    );
    const total = countResult.rows[0].count;

    values.push(l, offset);
    const { rows } = await pool.query(
      `SELECT id, code, title, description, credits, created_at, updated_at
     FROM courses ${where}
     ORDER BY id ASC
     LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );

    return sendSuccess(res, 200, rows, buildMeta(p, l, total));
  });

  // GET /courses/:id
  static getCourseById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { rows } = await pool.query(
      "SELECT id, code, title, description, credits, created_at, updated_at FROM courses WHERE id = $1",
      [id],
    );

    if (rows.length === 0) throw ApiError.notFound("Course not found");
    return sendSuccess(res, 200, rows[0]);
  });

  // POST /courses
  static createCourse = asyncHandler(async (req, res) => {
    const { code, title, description, credits } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO courses (code, title, description, credits)
     VALUES ($1, $2, $3, $4)
     RETURNING id, code, title, description, credits, created_at, updated_at`,
      [code, title, description ?? null, credits],
    );

    return sendSuccess(res, 201, rows[0]);
  });
}
export default CoursesController;
