import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from '../services/auth.service';

import { SignupDto } from './../dto/auth.dto';


@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
  ) { }


  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('/signup')
  async createUser(@Body() user: SignupDto) {
    return this.authService.register(user)
  }
  
}