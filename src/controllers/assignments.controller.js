import express from 'express';
const { Request, Response } = express;
import { pool } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { resolvePagination, buildMeta } from '../utils/pagination.js';

class AssignmentsController {
// GET /assignments?page=&limit=&search=&courseId=&status=
static getAssignments = asyncHandler(async (req, res) => {
  const { page, limit, search, courseId, status } = req.query 
  const { page: p, limit: l, offset } = resolvePagination({ page, limit });

  const conditions = [];
  const values = [];

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`title ILIKE $${values.length}`);
  }
  if (courseId) {
    values.push(courseId);
    conditions.push(`course_id = $${values.length}`);
  }
  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await pool.query(`SELECT COUNT(*)::int AS count FROM assignments ${where}`, values);
  const total = countResult.rows[0].count ;

  values.push(l, offset);
  const { rows } = await pool.query(
    `SELECT id, course_id, title, description, due_date, status, created_at, updated_at
     FROM assignments ${where}
     ORDER BY id ASC
     LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values
  );

  return sendSuccess(res, 200, rows, buildMeta(p, l, total));
});

// POST /assignments
static  createAssignment = asyncHandler(async (req, res) => {
  const { courseId, title, description, dueDate, status } = req.body ;

  const { rows } = await pool.query(
    `INSERT INTO assignments (course_id, title, description, due_date, status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, course_id, title, description, due_date, status, created_at, updated_at`,
    [courseId, title, description ?? null, dueDate ?? null, status]
  );

  return sendSuccess(res, 201, rows[0]);
});

// PATCH /assignments/:id  (partial update)
static  patchAssignment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = req.body ;

  const fieldMap = {
    courseId: 'course_id',
    title: 'title',
    description: 'description',
    dueDate: 'due_date',
    status: 'status',
  };

  const setClauses = [];
  const values = [];

  for (const [key, column] of Object.entries(fieldMap)) {
    const value = (body)[key];
    if (value !== undefined) {
      values.push(value);
      setClauses.push(`${column} = $${values.length}`);
    }
  }

  setClauses.push('updated_at = NOW()');
  values.push(id);

  const { rows } = await pool.query(
    `UPDATE assignments SET ${setClauses.join(', ')}
     WHERE id = $${values.length}
     RETURNING id, course_id, title, description, due_date, status, created_at, updated_at`,
    values
  );

  if (rows.length === 0) throw ApiError.notFound('Assignment not found');
  return sendSuccess(res, 200, rows[0]);
});
}
export default AssignmentsController