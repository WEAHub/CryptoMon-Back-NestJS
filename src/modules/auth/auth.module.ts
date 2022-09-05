import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'

import { UserModule } from '../users/users.module';
import { UsersService } from "../users/services/users.service";
import { UserSchema } from '../users/models/users.model'

import { AuthService } from "./services/auth.service"
import { AuthController } from './controller/auth.controller';

import { LocalStrategy } from './strategies/auth.local';
import { JwtStrategy } from './strategies/jwt.strategy';

import { jwtConstants } from './auth.constants';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule, 
    PassportModule, 
    MongooseModule.forFeature([{ name: "user", schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }), 
  ],
  providers: [AuthService, UsersService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }