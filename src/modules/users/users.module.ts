import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controller/users.controller';
import { MongooseModule } from "@nestjs/mongoose"
import { UserSchema } from "./models/users.model"
import { AuthService } from '../auth/services/auth.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "user", schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }), 
  ],
  providers: [UsersService, AuthService, JwtStrategy],
  controllers: [UsersController],
})

export class UserModule {}