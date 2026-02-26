import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('attendance')
@UseGuards(AuthGuard('jwt'))
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  async markAttendance(@Request() req, @Body() body: any) {
    return this.attendanceService.markAttendance({
      school_id: req.user.schoolId,
      ...body,
      date: new Date(body.date),
    });
  }

  @Get()
  async getAttendance(
    @Request() req,
    @Query('date') date: string,
    @Query('classId') classId: string,
  ) {
    return this.attendanceService.getAttendance(req.user.schoolId, classId, new Date(date));
  }
}
