import { z } from 'zod';

export const dateRangeSchema = z.object({
  from: z.string().date().optional(),
  to: z.string().date().optional(),
});

export type DateRangeDto = z.infer<typeof dateRangeSchema>;
