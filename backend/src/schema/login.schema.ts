import { z } from 'zod';
import { apiSecretBodySchema, storeIdSchema } from './prisma-fields.schema';

export const loginSchema = z.object({
  storeId: storeIdSchema,
  apiSecret: apiSecretBodySchema,
});

export type LoginDto = z.infer<typeof loginSchema>;
