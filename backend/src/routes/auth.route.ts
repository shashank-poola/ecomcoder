/**
 * Auth route segments (under global prefix /api/v1 unless noted).
 * Mirrors a small Express router: e.g. mainRouter.use("/auth", authRouter).
 */
export const AUTH_ROUTES = {
  BASE: 'auth',
  LOGIN: 'login',
} as const;
