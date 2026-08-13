import express from 'express';
const { Request, Response, NextFunction } =express
import { ApiError } from '../utils/ApiError.js';

// 404 handler for unmatched routes
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

// Central error handler - keeps the response shape consistent across the app.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err, req, res, _next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details ? { errors: err.details } : {}),
    });
  }

  // Postgres unique_violation
  if (typeof err === 'object' && err !== null && (err).code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'A record with the same unique field already exists.',
    });
  }

  // Postgres foreign_key_violation
  if (typeof err === 'object' && err !== null && (err).code === '23503') {
    return res.status(400).json({
      success: false,
      message: 'Referenced resource does not exist.',
    });
  }

  // eslint-disable-next-line no-console
  console.error('Unhandled error:', err);

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}
