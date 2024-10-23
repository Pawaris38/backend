import { IsNotEmpty } from 'class-validator';

export class PaymentDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  currency: string;

}
