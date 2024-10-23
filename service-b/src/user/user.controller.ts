import { Controller, Get, Headers } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getUser(
      @Headers('authorization') authHeader: string,
    ) {
      const token = authHeader?.split(' ')[1];
  
      return await this.userService.getUserData(token);
    }
}




