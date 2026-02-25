import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { HostelService } from './hostel.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('hostels')
@UseGuards(AuthGuard('jwt'))
export class HostelController {
  constructor(private readonly hostelService: HostelService) {}

  @Get()
  async getHostels(@Request() req) {
    return this.hostelService.getHostels(req.user.schoolId);
  }

  @Post()
  async createHostel(@Request() req, @Body() body: any) {
    return this.hostelService.createHostel(req.user.schoolId, body);
  }

  @Get(':id/rooms')
  async getRooms(@Param('id') id: string) {
    return this.hostelService.getHostelRooms(id);
  }

  @Post(':id/rooms')
  async createRoom(@Param('id') id: string, @Body() body: any) {
    return this.hostelService.createRoom(id, body);
  }

  @Patch('assign/:studentId')
  async assignStudent(@Param('studentId') studentId: string, @Body() body: { roomId: string }) {
    return this.hostelService.assignStudentToRoom(studentId, body.roomId);
  }
}
