import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { SkipThrottle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('transactions')
@UseGuards(ThrottlerGuard)
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('deposit')
  deposit(@Body() body: { amount: number; currency: string }, @Req() request: any) {
    return this.transactionsService.deposit(request.user.id, body.amount, body.currency);
  }

  @UseGuards(JwtAuthGuard)
  @Post('withdraw')
  withdraw(@Body() body: { amount: number; currency: string }, @Req() request: any) {
    return this.transactionsService.withdraw(request.user.id, body.amount, body.currency);
  }

  @SkipThrottle() 
  @UseGuards(JwtAuthGuard)
  @Get('')
  getAllTransactions(@Req() request: any) {
    return this.transactionsService.getAllTransactions(request.user.id);
  }
  
}
