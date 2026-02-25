import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { TransportService } from './transport.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('transport')
@UseGuards(AuthGuard('jwt'))
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Get('routes')
  async getRoutes(@Request() req) {
    return this.transportService.getRoutes(req.user.schoolId);
  }

  @Post('routes')
  async createRoute(@Request() req, @Body() body: any) {
    return this.transportService.createRoute(req.user.schoolId, body);
  }

  @Get('vehicles')
  async getVehicles(@Request() req) {
    return this.transportService.getVehicles(req.user.schoolId);
  }

  @Post('vehicles')
  async addVehicle(@Request() req, @Body() body: any) {
    return this.transportService.addVehicle(req.user.schoolId, body);
  }

  @Patch('assign/:studentId')
  async assignStudent(@Param('studentId') studentId: string, @Body() body: { routeId: string }) {
    return this.transportService.assignStudentToRoute(studentId, body.routeId);
  }
}
