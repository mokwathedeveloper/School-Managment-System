import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { HRService } from './hr.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('hr')
@UseGuards(AuthGuard('jwt'))
export class HRController {
  constructor(private readonly hrService: HRService) {}

  @Get('directory')
  async getDirectory(@Request() req) {
    return this.hrService.getStaffDirectory(req.user.schoolId);
  }

  @Get('staff/:id')
  async getStaffDetail(@Request() req, @Param('id') id: string) {
    return this.hrService.getStaffDetail(req.user.schoolId, id);
  }

  @Post('payroll/process')
  async processPayroll(@Request() req, @Body() body: { month: number, year: number }) {
    return this.hrService.processPayroll(req.user.schoolId, body.month, body.year);
  }
}
