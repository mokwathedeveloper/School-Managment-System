import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AdmissionsService } from './admissions.service';
import { AuthGuard } from '@nestjs/passport';
import { AdmissionStatus } from '@prisma/client';

@Controller('admissions')
export class AdmissionsController {
  constructor(private readonly admissionsService: AdmissionsService) {}

  @Post('apply')
  async apply(@Body() body: any) {
    // Public endpoint (logic to determine schoolId via slug or body)
    return this.admissionsService.createApplication(body.school_id, body);
  }

  @Get('applications')
  @UseGuards(AuthGuard('jwt'))
  async getApplications(@Request() req, @Query('status') status?: AdmissionStatus) {
    return this.admissionsService.getApplications(req.user.schoolId, status);
  }

  @Patch('applications/:id/status')
  @UseGuards(AuthGuard('jwt'))
  async updateStatus(@Param('id') id: string, @Body() body: { status: AdmissionStatus, notes?: string }) {
    return this.admissionsService.updateStatus(id, body.status, body.notes);
  }
}
