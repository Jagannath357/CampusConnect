import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // assign parsed values
      if (parsed.body) req.body = parsed.body;
      if (parsed.query) req.query = parsed.query as any;
      if (parsed.params) req.params = parsed.params as any;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.slice(1).join('.'),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          message: errorMessages[0]?.message || 'Validation failed',
          errors: errorMessages,
        });
        return;
      }
      next(error);
    }
  };
};
