import express from 'express';
const { Request, Response, NextFunction, RequestHandler } = express;

export const asyncHandler =
  (fn) =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };