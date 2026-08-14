import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';

/**
 * Validates req.body / req.params / req.query against the given Zod schemas.
 * Usage: validate({ body: createStudentSchema, params: idParamSchema })
 */
export const validate =
  (schemas) =>
  (req, _res, next) => {
    try {
       if (!schemas) {
        return next();
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }
      if (schemas.query) {
        const validatedQuery = schemas.query.parse(req.query);
        Object.assign(req.query, validatedQuery);
      }
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        return next(ApiError.badRequest('Validation failed', details));
      }
      return next(err);
    }
  };