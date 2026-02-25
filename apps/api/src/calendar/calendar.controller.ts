import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('calendar')
@UseGuards(AuthGuard('jwt'))
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  async createEvent(@Request() req, @Body() body: any) {
    return this.calendarService.createEvent(req.user.schoolId, {
        ...body,
        start_date: new Date(body.start_date),
        end_date: new Date(body.end_date)
    });
  }

  @Get()
  async getEvents(
    @Request() req,
    @Query('start') start: string,
    @Query('end') end: string
  ) {
    return this.calendarService.getEvents(
        req.user.schoolId, 
        new Date(start), 
        new Date(end)
    );
  }
}
