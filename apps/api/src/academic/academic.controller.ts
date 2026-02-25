import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AcademicService } from './academic.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('academic')
@UseGuards(AuthGuard('jwt'))
export class AcademicController {
  constructor(private readonly academicService: AcademicService) {}

  @Get('report/:studentId')
  async getReport(
    @Param('studentId') studentId: string,
    @Query('termId') termId: string
  ) {
    return this.academicService.getStudentReport(studentId, termId);
  }
}
