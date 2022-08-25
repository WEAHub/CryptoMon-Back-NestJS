import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'

import { UserModule } from '../users/users.module';
import { UsersService } from "../users/users.service";
import { UserSchema } from '../users/users.model'

import { AuthService } from "./auth.service"
import { AuthController } from './auth.controller';

import { LocalStrategy } from './auth.local';
import { JwtStrategy } from './jwt.strategy';

import { jwtConstants } from './auth.constants';

@Module({
  imports: [
    UserModule, 
    PassportModule, 
    MongooseModule.forFeature([{ name: "user", schema: UserSchema }]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    })
  ],
  providers: [AuthService, UsersService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }