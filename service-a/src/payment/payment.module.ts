import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

import { CurrencyService } from 'src/currency/currency.service';
import { UsersModule } from 'src/users/users.module';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [TransactionsModule, UsersModule],
  providers: [PaymentService, CurrencyService],
  controllers: [PaymentController],
})
export class PaymentModule {}
