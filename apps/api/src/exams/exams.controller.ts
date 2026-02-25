import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('exams')
@UseGuards(AuthGuard('jwt'))
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  async createExam(@Request() req, @Body() body: any) {
    return this.examsService.createExam(req.user.schoolId, {
        ...body,
        date: new Date(body.date)
    });
  }

  @Get()
  async findAll(@Request() req) {
    return this.examsService.findAll(req.user.schoolId);
  }

  @Post('grading-systems')
  async createGradingSystem(@Request() req, @Body() body: any) {
    return this.examsService.createGradingSystem(req.user.schoolId, body);
  }

  @Get('grading-systems')
  async getGradingSystems(@Request() req) {
    return this.examsService.getGradingSystems(req.user.schoolId);
  }

  @Post(':id/results')
  async enterResults(@Request() req, @Param('id') id: string, @Body() body: { records: any[] }) {
    return this.examsService.enterResults(req.user.schoolId, id, body.records);
  }

  @Get(':id/results')
  async getResults(@Param('id') id: string) {
    return this.examsService.getExamResults(id);
  }
}
