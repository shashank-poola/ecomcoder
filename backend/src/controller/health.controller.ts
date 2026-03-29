import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

/**
 * Root health check (same idea as Express app.get("/health", ...)).
 * Registered outside /api/v1 via global prefix exclude.
 */
@Controller('health')
export class HealthController {
  @Get()
  @HttpCode(HttpStatus.CREATED)
  health() {
    return {
      success: true,
      data: 'Server is running fine',
      error: null,
    };
  }
}
