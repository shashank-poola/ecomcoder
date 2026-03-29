import { z } from 'zod';

/**
 * Zod shapes aligned with Prisma models (only fields used by the API).
 * @see database/prisma/schema.prisma
 */

export const storeIdSchema = z.string().min(1);

export const apiSecretBodySchema = z.string().min(1);

export const eventTypeSchema = z.enum([
  'page_view',
  'add_to_cart',
  'remove_from_cart',
  'checkout_started',
  'purchase',
]);

export const isoDateStringSchema = z.string().date();
