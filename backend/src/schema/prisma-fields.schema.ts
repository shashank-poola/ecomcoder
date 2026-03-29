import { z } from 'zod';

/**
 * Zod shapes aligned with Prisma models (only fields used by the API).
 * @see database/prisma/schema.prisma
 */

/** Store.id — String @id @default(cuid()) */
export const storeIdSchema = z.string().min(1);

/** Store.apiSecret — String? in DB; required on login */
export const apiSecretBodySchema = z.string().min(1);

/** Event.eventType — String in DB, fixed set in app */
export const eventTypeSchema = z.enum([
  'page_view',
  'add_to_cart',
  'remove_from_cart',
  'checkout_started',
  'purchase',
]);

/** Calendar-day bounds for queries (matches Date @db day usage) */
export const isoDateStringSchema = z.string().date();
