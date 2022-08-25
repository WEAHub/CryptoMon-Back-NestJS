import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SignupDto } from './dto/users.dto';
import { UsersService } from 'src/users/users.service';
import { hash } from 'bcrypt';

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService
  ) { }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('/signup')
  async createUser(@Body() user: SignupDto) {

    const saltOrRounds = 10;
    const hashedPassword = await hash(user.password, saltOrRounds);

    const newUser = await this.usersService.createUser(
      user.username,
      hashedPassword,
      user.name,
    );

    return {
      username: newUser.username,
      name: newUser.name,
      token: this.authService.generateToken({
        username: newUser.username,
        sub: newUser._id
       })
    };
  }
}