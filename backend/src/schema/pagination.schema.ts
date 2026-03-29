import { z } from 'zod';

/** Recent-activity list size (not a Prisma column; API query only). */
export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

export type PaginationDto = z.infer<typeof paginationSchema>;
