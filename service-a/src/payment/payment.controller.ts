import { Controller, Post, Body, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { PaymentService } from './payment.service';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('payment')
@UseGuards(ThrottlerGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async makePayment(
    @Request() req, 
    @Body() paymentDto: { amount: number; currency: string }, 
  ) {
    const userId = req.user.id; 
   
    const { amount, currency } = paymentDto;

    try {
      return await this.paymentService.processPayment(userId, amount, currency);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
