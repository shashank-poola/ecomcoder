/**
 * Central route map — same role as Express `routes/index.ts` that mounts
 * auth, analytics, etc. Nest wires controllers in modules; this file is the
 * single source of path strings so URLs stay easy to grep and refactor.
 */
export { AUTH_ROUTES } from './auth.route';
export { ANALYTICS_ROUTES } from './analytics.route';
