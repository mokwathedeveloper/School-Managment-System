import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { StudentsService } from './students.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('students')
@UseGuards(AuthGuard('jwt'))
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  async create(@Request() req, @Body() body: any) {
    return this.studentsService.create(req.user.schoolId, body);
  }

  @Post('bulk-import')
  async bulkImport(@Request() req, @Body() body: { students: any[] }) {
    return this.studentsService.bulkImport(req.user.schoolId, body.students);
  }

  @Get()
  async findAll(
    @Request() req,
    @Query('search') search?: string,
    @Query('classId') classId?: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.studentsService.findAll(req.user.schoolId, {
      search,
      classId,
      skip: skip ? +skip : 0,
      take: take ? +take : 10,
    });
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.studentsService.findOne(req.user.schoolId, id);
  }
}
