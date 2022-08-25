import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.model';
import { hash } from 'bcrypt';
import { SignupDto } from './dto/users.dto';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('/signup')
  async createUser(@Body() user: SignupDto): Promise<User> {
    const saltOrRounds = 10;
    const hashedPassword = await hash(user.password, saltOrRounds);
    const result = await this.usersService.createUser(
      user.username,
      hashedPassword,
      user.name,
    );
    return result;
  }
}