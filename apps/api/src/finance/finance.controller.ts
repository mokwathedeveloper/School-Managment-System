import { Controller, Get, Post, Body, Param, UseGuards, Request, HttpCode } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post('invoices')
  @UseGuards(AuthGuard('jwt'))
  async createInvoice(@Body() body: any) {
    return this.financeService.createInvoice(body);
  }

  @Get('invoices/student/:studentId')
  @UseGuards(AuthGuard('jwt'))
  async getStudentInvoices(@Param('studentId') studentId: string) {
    return this.financeService.getInvoicesByStudent(studentId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllInvoices(@Request() req: any) {
    return this.financeService.findAll(req.user.schoolId);
  }

  @Post('fee-structures')
  @UseGuards(AuthGuard('jwt'))
  async createFeeStructure(@Request() req: any, @Body() body: any) {
    return this.financeService.createFeeStructure(req.user.schoolId, body);
  }

  @Get('fee-structures')
  @UseGuards(AuthGuard('jwt'))
  async getFeeStructures(@Request() req: any) {
    return this.financeService.getFeeStructures(req.user.schoolId);
  }

  @Post('generate-bulk-invoices')
  @UseGuards(AuthGuard('jwt'))
  async generateBulkInvoices(@Request() req: any, @Body() body: { grade_id: string; term_id: string }) {
    return this.financeService.generateBulkInvoices(req.user.schoolId, body.grade_id, body.term_id);
  }

  @Get('expenses')
  @UseGuards(AuthGuard('jwt'))
  async getExpenses(@Request() req: any) {
    return this.financeService.getExpenses(req.user.schoolId);
  }

  @Post('expenses')
  @UseGuards(AuthGuard('jwt'))
  async recordExpense(@Request() req: any, @Body() body: any) {
    return this.financeService.recordExpense(req.user.schoolId, req.user.userId, body);
  }

  @Post('mpesa/stkpush')
  @UseGuards(AuthGuard('jwt'))
  async initiateStkPush(@Body() body: { invoice_id: string; phone_number: string }) {
    return this.financeService.initiateStkPush(body.invoice_id, body.phone_number);
  }

  @Post('mpesa/callback/:paymentId')
  @HttpCode(200)
  async handleMpesaCallback(
    @Param('paymentId') paymentId: string,
    @Body() callbackData: any
  ) {
    return this.financeService.handleMpesaCallback(paymentId, callbackData);
  }
}
