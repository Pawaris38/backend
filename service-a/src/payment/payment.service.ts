import { Injectable, BadRequestException } from '@nestjs/common';
import { CurrencyService } from '../currency/currency.service';
import { UsersService } from '../users/users.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import { TransactionType } from 'src/transactions/transactions.entity';

@Injectable()
export class PaymentService {
  constructor(
      private readonly usersService: UsersService,
      private readonly transactionsService: TransactionsService,
      private readonly currencyService: CurrencyService,
  ) {}

  async processPayment(userId: number, amount: number, currency: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const amountInTHB = this.currencyService.convertToTHB(amount, currency);

    if (user.balance < amountInTHB) {
      throw new BadRequestException('Insufficient balance');
    }

    user.balance -= amountInTHB;
    await this.usersService.updateUserBalance(userId, user.balance);
    await this.transactionsService.createTransaction({
        userId,
        amount: amount, 
        currency: currency,
        type: TransactionType.PAYMENT,
      });
   
    return { success: true, newBalance: user.balance };
  }

  
}
