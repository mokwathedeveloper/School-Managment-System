import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { DisciplineService } from './discipline.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('discipline')
@UseGuards(AuthGuard('jwt'))
export class DisciplineController {
  constructor(private readonly disciplineService: DisciplineService) {}

  @Post()
  async createRecord(@Request() req, @Body() body: any) {
    return this.disciplineService.createRecord(req.user.schoolId, {
      ...body,
      incident_date: new Date(body.incident_date),
      reported_by_id: req.user.staffId, // Assumes staffId is in JWT
    });
  }

  @Get()
  async getSchoolRecords(@Request() req) {
    return this.disciplineService.getSchoolRecords(req.user.schoolId);
  }

  @Get('student/:studentId')
  async getStudentRecords(@Param('studentId') studentId: string) {
    return this.disciplineService.getStudentRecords(studentId);
  }
}
