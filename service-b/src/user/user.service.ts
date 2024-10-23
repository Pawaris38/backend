import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { Cache } from 'cache-manager';
@Injectable()
export class UserService {
  private readonly serviceAUrl = 'http://localhost:3000/users';
  @Inject('CACHE_MANAGER') private cacheManager: Cache
  async getUserData(token: string): Promise<any> {
    const cacheData = await this.cacheManager.get('user_data');
    if (cacheData) {
      return cacheData
    }

    try {
      const response = await axios.get(this.serviceAUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await this.cacheManager.set('user_data', response.data, 60*1000)
      return response.data;
    } catch (error) {
     console.log("🚀 ~ UserService ~ getUserData ~ error:", error)
    }
  }
}
