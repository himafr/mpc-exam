import { Response } from "express";

//  Meta data
//   page : number;
//   limit : number;
//   total : number;
//   totalPages : number;

export function sendSuccess(res, statusCode, data, meta) {
  return res.status(statusCode).json({
    success: true,
    data,
    ...(meta ? { meta } : {}),
  });
}
