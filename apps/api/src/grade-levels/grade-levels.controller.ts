import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { GradeLevelsService } from './grade-levels.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('grade-levels')
@UseGuards(AuthGuard('jwt'))
export class GradeLevelsController {
  constructor(private readonly gradeLevelsService: GradeLevelsService) {}

  @Post()
  async create(@Request() req, @Body() body: { name: string; level: number }) {
    return this.gradeLevelsService.create(req.user.schoolId, body);
  }

  @Get()
  async findAll(@Request() req) {
    return this.gradeLevelsService.findAll(req.user.schoolId);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.gradeLevelsService.findOne(req.user.schoolId, id);
  }
}
