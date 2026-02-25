import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { AlumniService } from './alumni.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('alumni')
@UseGuards(AuthGuard('jwt'))
export class AlumniController {
  constructor(private readonly alumniService: AlumniService) {}

  @Get()
  async getAlumni(@Request() req) {
    return this.alumniService.getAlumni(req.user.schoolId);
  }

  @Post()
  async createAlumnus(@Request() req, @Body() body: any) {
    return this.alumniService.createAlumnus(req.user.schoolId, {
      ...body,
      graduation_year: parseInt(body.graduation_year)
    });
  }

  @Patch(':id')
  async updateAlumnus(@Param('id') id: string, @Body() body: any) {
    return this.alumniService.updateAlumnus(id, body);
  }
}
