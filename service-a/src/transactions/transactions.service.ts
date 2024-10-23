import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from './transactions.entity';
import { User } from '../users/user.entity';
import { UsersService } from 'src/users/users.service';
import { CurrencyService } from 'src/currency/currency.service';
import { Cache } from 'cache-manager';
@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private usersService: UsersService,
    private readonly currencyService: CurrencyService,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
  ) {}

  async deposit(
    userId: number,
    amount: number,
    currency: string,
  ): Promise<Transaction> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (currency !== 'THB') {
      const convertedAmount = await this.currencyService.convertToTHB(
        amount,
        currency,
      );
      user.balance = parseFloat(user.balance.toString()) + convertedAmount;
    } else {
      user.balance = parseFloat(user.balance.toString()) + amount;
    }
    await this.usersRepository.save(user);

    const transaction = this.transactionsRepository.create({
      userId,
      amount,
      currency,
      type: TransactionType.DEPOSIT,
    });
    return this.transactionsRepository.save(transaction);
  }

  async withdraw(
    userId: number,
    amount: number,
    currency: string,
  ): Promise<Transaction> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (currency !== 'THB') {
      const convertedAmount = await this.currencyService.convertToTHB(
        amount,
        currency,
      );
      if (user.balance < convertedAmount) {
        throw new BadRequestException('Insufficient balance');
      }
      user.balance = parseFloat(user.balance.toString()) - convertedAmount;
    } else {
      if (user.balance < amount) {
        throw new BadRequestException('Insufficient balance');
      }
      user.balance = parseFloat(user.balance.toString()) - amount;
    }
    await this.usersRepository.save(user);

    const transaction = this.transactionsRepository.create({
      userId,
      amount: amount,
      currency,
      type: TransactionType.WITHDRAW,
    });
    return this.transactionsRepository.save(transaction);
  }

  async createTransaction(data: {
    userId: number;
    amount: number;
    currency: string;
    type: TransactionType;
  }): Promise<Transaction> {
    const { userId, amount, currency, type } = data;

    const transaction = this.transactionsRepository.create({
      userId,
      amount,
      currency,
      type,
    });

    return this.transactionsRepository.save(transaction);
  }

  async getAllTransactions(userId: number): Promise<Transaction[]> {
    const cacheData = await this.cacheManager.get('transaction');
    if (cacheData) {
      return cacheData;
    }
    const result = await this.transactionsRepository.find({
      where: { userId },
      order: { created_at: 'DESC' }, 
    });
    await this.cacheManager.set('transaction', result, 60 * 1000)
    return result
  }
}
