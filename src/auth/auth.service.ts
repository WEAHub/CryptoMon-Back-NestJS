import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UsersService } from './../users/users.service';

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

    const passwordValid = await compare(password, user.password)
    return  passwordValid ? user : null;

  }

  generateToken(userData) {
    return this.jwtService.sign(userData)
  }

  login(user: any) {
    return {
      username: user.username,
      name: user.name,
      token: this.generateToken({
        username: user.username,
        sub: user._id
      })
    };
  }

}