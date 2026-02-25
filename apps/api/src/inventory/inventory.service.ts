import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  // --------------------------------------------------------
  // ASSETS (Long-term property)
  // --------------------------------------------------------

  async createAsset(schoolId: string, data: any) {
    return this.prisma.asset.create({
      data: { ...data, school_id: schoolId }
    });
  }

  async getAssets(schoolId: string) {
    return this.prisma.asset.findMany({
      where: { school_id: schoolId },
      orderBy: { created_at: 'desc' }
    });
  }

  // --------------------------------------------------------
  // STOCK (Consumables)
  // --------------------------------------------------------

  async getStock(schoolId: string) {
    return this.prisma.stockItem.findMany({
      where: { school_id: schoolId },
      orderBy: { name: 'asc' }
    });
  }

  async updateStockQuantity(itemId: string, change: number) {
    const item = await this.prisma.stockItem.findUnique({ where: { id: itemId } });
    if (!item) throw new NotFoundException('Stock item not found');

    const newQuantity = Math.max(0, item.quantity + change);
    
    return this.prisma.stockItem.update({
      where: { id: itemId },
      data: { quantity: newQuantity }
    });
  }

  async createStockItem(schoolId: string, data: any) {
    return this.prisma.stockItem.create({
      data: { ...data, school_id: schoolId }
    });
  }
}
