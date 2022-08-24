import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UsersService } from './../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { userInfo } from 'os';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {

    const user = await this.usersService.getUser({ username });

    if (!user) {
      throw new NotAcceptableException('User does not exist');
    }

    const passwordValid = await bcrypt.compare(password, user.password)
    return  passwordValid ? user : null;

  }

  login(user: any) {
    console.log(user)
    return {
      username: user.username,
      name: user.name,
      token: this.jwtService.sign({
        username: user.username,
        sub: user._id
      }),
    };
  }

}