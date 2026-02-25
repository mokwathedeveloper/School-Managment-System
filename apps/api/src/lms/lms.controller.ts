import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { LMSService } from './lms.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('lms')
@UseGuards(AuthGuard('jwt'))
export class LMSController {
  constructor(private readonly lmsService: LMSService) {}

  @Post('assignments')
  async createAssignment(@Request() req, @Body() body: any) {
    return this.lmsService.createAssignment(req.user.schoolId, {
        ...body,
        due_date: new Date(body.due_date)
    });
  }

  @Get('assignments/class/:classId')
  async getAssignments(@Param('classId') classId: string) {
    return this.lmsService.getClassAssignments(classId);
  }

  @Post('resources')
  async uploadResource(@Request() req, @Body() body: any) {
    return this.lmsService.uploadResource(req.user.schoolId, body);
  }

  @Get('resources')
  async getResources(@Request() req, @Query('subjectId') subjectId?: string) {
    return this.lmsService.getResources(req.user.schoolId, subjectId);
  }
}
