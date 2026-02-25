import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ParentsService } from './parents.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('parents')
@UseGuards(AuthGuard('jwt'))
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Get('my-children')
  async getMyChildren(@Request() req) {
    return this.parentsService.getChildren(req.user.userId);
  }

  @Get('profile')
  async getProfile(@Request() req) {
    return this.parentsService.getParentProfile(req.user.userId);
  }
}
