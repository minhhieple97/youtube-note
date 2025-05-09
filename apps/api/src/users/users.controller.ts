import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../common/decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getProfile(@User() user) {
    return user;
  }
}
