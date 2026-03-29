import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

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
