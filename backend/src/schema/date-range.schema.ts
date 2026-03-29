import { z } from 'zod';
import { isoDateStringSchema } from './utils.schema';

export const dateRangeSchema = z.object({
  from: isoDateStringSchema.optional(),
  to: isoDateStringSchema.optional(),
});

export type DateRangeDto = z.infer<typeof dateRangeSchema>;
