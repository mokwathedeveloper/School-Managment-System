import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AuthGuard } from '@nestjs/passport';
import { AttendanceStatus } from '@prisma/client';

@Controller('attendance')
@UseGuards(AuthGuard('jwt'))
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('mark')
  async markAttendance(
    @Body() body: {
      school_id: string;
      class_id: string;
      date: string;
      records: { student_id: string; status: AttendanceStatus; remarks?: string }[];
    }
  ) {
    return this.attendanceService.markAttendance({
      ...body,
      date: new Date(body.date),
    });
  }

  @Get('class/:classId')
  async getClassAttendance(
    @Param('classId') classId: string,
    @Query('date') date: string
  ) {
    return this.attendanceService.getClassAttendance(classId, new Date(date));
  }

  @Get('student/:studentId/summary')
  async getStudentSummary(
    @Param('studentId') studentId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.attendanceService.getStudentAttendanceSummary(
      studentId,
      new Date(startDate),
      new Date(endDate)
    );
  }
}
