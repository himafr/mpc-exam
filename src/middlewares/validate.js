import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';

/**
 * Validates req.body / req.params / req.query against the given Zod schemas.
 * Schemas are typed as ZodTypeAny (not just ZodObject) so this also accepts
 * schemas built with .refine()/.transform(), which return ZodEffects.
 * Usage: validate({ body: createStudentSchema, params: idParamSchema })
 */
export const validate =
  (schemas) =>
  (req, _res, next) => {
    try {
      if (schemas.params) req.params = schemas.params.parse(req.params);
      if (schemas.query) req.query = schemas.query.parse(req.query);
      if (schemas.body) req.body = schemas.body.parse(req.body);
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        return next(ApiError.badRequest('Validation failed', details));
      }
      return next(err);
    }
  };