import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TimetableService } from './timetable.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('timetable')
@UseGuards(AuthGuard('jwt'))
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Post('rooms')
  async createRoom(@Request() req, @Body() body: any) {
    return this.timetableService.createRoom(req.user.schoolId, body);
  }

  @Get('rooms')
  async getRooms(@Request() req) {
    return this.timetableService.getRooms(req.user.schoolId);
  }

  @Post('slots')
  async createSlot(@Request() req, @Body() body: any) {
    return this.timetableService.createSlot(req.user.schoolId, body);
  }

  @Get('class/:classId')
  async getClassTimetable(@Param('classId') classId: string) {
    return this.timetableService.getClassTimetable(classId);
  }
}
