import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('inventory')
@UseGuards(AuthGuard('jwt'))
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('assets')
  async getAssets(@Request() req) {
    return this.inventoryService.getAssets(req.user.schoolId);
  }

  @Post('assets')
  async createAsset(@Request() req, @Body() body: any) {
    return this.inventoryService.createAsset(req.user.schoolId, body);
  }

  @Get('stock')
  async getStock(@Request() req) {
    return this.inventoryService.getStock(req.user.schoolId);
  }

  @Post('stock')
  async createStock(@Request() req, @Body() body: any) {
    return this.inventoryService.createStockItem(req.user.schoolId, body);
  }

  @Patch('stock/:id/quantity')
  async updateQuantity(@Param('id') id: string, @Body() body: { change: number }) {
    return this.inventoryService.updateStockQuantity(id, body.change);
  }
}
