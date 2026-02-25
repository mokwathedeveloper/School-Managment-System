import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { LibraryService } from './library.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('library')
@UseGuards(AuthGuard('jwt'))
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get('catalog')
  async getCatalog(@Request() req) {
    return this.libraryService.getCatalog(req.user.schoolId);
  }

  @Post('books')
  async createBook(@Request() req, @Body() body: any) {
    return this.libraryService.createBook(req.user.schoolId, body);
  }

  @Get('borrows/active')
  async getActiveBorrows(@Request() req) {
    return this.libraryService.getActiveBorrows(req.user.schoolId);
  }

  @Post('borrow')
  async borrowBook(@Request() req, @Body() body: any) {
    return this.libraryService.borrowBook(req.user.schoolId, {
        ...body,
        dueDate: new Date(body.dueDate)
    });
  }

  @Patch('return/:copyId')
  async returnBook(@Request() req, @Param('copyId') copyId: string) {
    return this.libraryService.returnBook(req.user.schoolId, copyId);
  }
}
