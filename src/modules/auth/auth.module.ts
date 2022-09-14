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
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRY') },
      }),
    }), 
  ],
  providers: [AuthService, UsersService, LocalStrategy, JwtStrategy, ConfigService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule]
})

export class AuthModule {}