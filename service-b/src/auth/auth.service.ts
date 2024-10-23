import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import axios from 'axios';

@Injectable()
export class AuthService {
  private readonly serviceAUrl = 'http://localhost:3000/auth/login'; 
  async login(loginDto: LoginDto): Promise<any> {
    try {
      const response = await axios.post(this.serviceAUrl, loginDto);
      return response.data; 
    } catch (error) {
      throw new Error(`Login failed: ${error.response?.data?.message || error.message}`);
    }
  }
}
