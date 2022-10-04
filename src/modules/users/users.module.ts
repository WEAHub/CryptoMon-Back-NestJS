import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose"
import { JwtService } from '@nestjs/jwt';

import { UsersController } from './controller/users.controller';

import { UsersService } from './services/users.service';
import { AuthService } from '../auth/services/auth.service';
import { UserSchema } from "./entities/users.model"
import { TradesService } from '@modules/trades/services/trades.service';
import { TradesSchema } from '@modules/trades/entities/trades.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "user", schema: UserSchema }]),
    MongooseModule.forFeature([{ name: "trades", schema: TradesSchema }]),
  ],
  providers: [UsersService, AuthService, JwtService, TradesService],
  controllers: [UsersController],
  exports: [UsersService]
})

export class UserModule {}