import express from "express"
const { Request, Response, NextFunction } =express;
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';



export function requireAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Missing or malformed Authorization header'));
  }

  const token = header.slice('Bearer '.length);

  try {
    const payload = jwt.verify(token, JWT_SECRET) ;
    req.user = { id: payload.id, email: payload.email, role: payload.role };
    return next();
  } catch {
    return next(ApiError.unauthorized('Invalid or expired token'));
  }
}
