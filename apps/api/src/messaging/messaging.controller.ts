import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('messaging')
@UseGuards(AuthGuard('jwt'))
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post('announcements')
  async sendAnnouncement(@Request() req, @Body() body: any) {
    return this.messagingService.sendAnnouncement(req.user.schoolId, body);
  }
}
