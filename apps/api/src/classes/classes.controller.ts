import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('classes')
@UseGuards(AuthGuard('jwt'))
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  async create(@Request() req, @Body() body: any) {
    return this.classesService.create(req.user.schoolId, body);
  }

  @Get()
  async findAll(@Request() req) {
    return this.classesService.findAll(req.user.schoolId);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.classesService.findOne(req.user.schoolId, id);
  }
}
