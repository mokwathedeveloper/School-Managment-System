import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { HealthService } from './health.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('health')
@UseGuards(AuthGuard('jwt'))
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('visits')
  async getSchoolVisits(@Request() req) {
    return this.healthService.getSchoolVisits(req.user.schoolId);
  }

  @Get('student/:studentId')
  async getRecord(@Param('studentId') studentId: string) {
    return this.healthService.getMedicalRecord(studentId);
  }

  @Patch('student/:studentId')
  async updateRecord(@Param('studentId') studentId: string, @Body() body: any) {
    return this.healthService.updateMedicalRecord(studentId, body);
  }

  @Post('visit')
  async recordVisit(@Request() req, @Body() body: any) {
    return this.healthService.recordVisit(req.user.schoolId, req.user.userId, body);
  }
}
