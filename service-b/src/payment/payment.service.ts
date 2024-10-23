import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaymentDto } from './dto/payment.dto';
import axios from 'axios';

@Injectable()
export class PaymentService {
  private readonly serviceAUrl = 'http://localhost:3000/payment';

  async makePayment(paymentDto: PaymentDto, token: string): Promise<any> {
    try {
      const response = await axios.post(this.serviceAUrl, paymentDto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; 
    } catch (error) {
     
      if (error.response) {
        if (error.response.data.statusCode === 400) {
          throw new HttpException(error.response.data.message, HttpStatus.BAD_REQUEST);
        } else if (error.response.data.statusCode === 429) {
          throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
        }
        throw new HttpException(error.response.data.message || 'Too many requests', error.response.status);

      }
    
      throw new HttpException('Service A is unavailable', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
