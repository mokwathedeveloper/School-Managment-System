import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// Simple Roles Guard for Super Admin
@UseGuards(AuthGuard('jwt'))
@Controller('super-admin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Get('stats')
  async getStats() {
    return this.superAdminService.getPlatformStats();
  }

  @Get('schools')
  async getSchools() {
    return this.superAdminService.getAllSchools();
  }

  @Post('schools')
  async createSchool(@Body() body: any) {
    return this.superAdminService.createSchool(body);
  }
}
