import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Get('my-school')
  @UseGuards(AuthGuard('jwt'))
  async findMySchool(@Request() req: any) {
    return this.schoolsService.findOne(req.user.schoolId);
  }

  @Post()
  create(@Body() createSchoolDto: Prisma.SchoolCreateInput) {
    return this.schoolsService.create(createSchoolDto);
  }

  @Get()
  findAll() {
    return this.schoolsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schoolsService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.schoolsService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateSchoolDto: Prisma.SchoolUpdateInput) {
    return this.schoolsService.update(id, updateSchoolDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.schoolsService.remove(id);
  }
}
