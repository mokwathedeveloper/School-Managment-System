import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AdmissionsModule } from './admissions.module';
import { AdmissionsService } from './admissions.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('admissions')
export class AdmissionsController {
  constructor(private readonly admissionsService: AdmissionsService) {}

  @Post('apply')
  async apply(@Body() body: any) {
    return this.admissionsService.apply(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Request() req) {
    return this.admissionsService.findAll(req.user.schoolId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: { status: string; notes?: string }) {
    return this.admissionsService.updateStatus(id, body.status, body.notes);
  }
}
