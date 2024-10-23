import {
  Controller,
  Post,
  Body,
  Headers,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDto } from './dto/payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async makePayment(
    @Body() paymentDto: PaymentDto,
    @Headers('authorization') authHeader: string,
  ) {
    const token = authHeader?.split(' ')[1];

    return await this.paymentService.makePayment(paymentDto, token);
  }
}
