import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { UsersService } from './../../../modules/users/services/users.service';
import { SignupDto } from './../dto/auth.dto';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
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
  
  async register(user: SignupDto) {
    
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
      token: this.generateToken({
        username: newUser.username,
        sub: newUser._id
       })
    };
  }
}