import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transactions.entity';
import { UsersModule } from '../users/users.module';
import { CurrencyService } from 'src/currency/currency.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), UsersModule],
  providers: [TransactionsService, CurrencyService],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
