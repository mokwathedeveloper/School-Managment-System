import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { GateService } from './gate.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('gate')
@UseGuards(AuthGuard('jwt'))
export class GateController {
  constructor(private readonly gateService: GateService) {}

  @Get('visitors')
  async getVisitors(@Request() req) {
    return this.gateService.getVisitors(req.user.schoolId);
  }

  @Post('visitors')
  async register(@Request() req, @Body() body: any) {
    return this.gateService.registerVisitor(req.user.schoolId, body);
  }

  @Get('active')
  async getActive(@Request() req) {
    return this.gateService.getActiveVisitors(req.user.schoolId);
  }

  @Post('check-in/:visitorId')
  async checkIn(@Request() req, @Param('visitorId') visitorId: string, @Body() body: any) {
    return this.gateService.checkIn(req.user.schoolId, visitorId, body);
  }

  @Patch('check-out/:visitId')
  async checkOut(@Param('visitId') visitId: string) {
    return this.gateService.checkOut(visitId);
  }
}
