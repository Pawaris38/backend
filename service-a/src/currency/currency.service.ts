import { Injectable } from '@nestjs/common';

@Injectable()
export class CurrencyService {
  private exchangeRates = {
    THB: 1.0, // Thai Baht
    USD: 34.5, // US Dollar
    EUR: 38.2, // Euro
    JPY: 0.22, // Japanese Yen
    GBP: 44.7, // British Pound
    AUD: 22.5, // Australian Dollar
    CAD: 25.3, // Canadian Dollar
    SGD: 25.1, // Singapore Dollar
    CNY: 4.8, // Chinese Yuan
    HKD: 4.4, // Hong Kong Dollar
  };

  convertToTHB(amount: number, currency: string): number {
    const rate = this.exchangeRates[currency];
    if (!rate) {
      throw new Error('Currency not supported');
    }
    return amount * rate;
  }
}
