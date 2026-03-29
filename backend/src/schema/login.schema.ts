import { z } from 'zod';

export const loginSchema = z.object({
  storeId: z.string().min(1),
  apiSecret: z.string().min(1),
});

export type LoginDto = z.infer<typeof loginSchema>;
