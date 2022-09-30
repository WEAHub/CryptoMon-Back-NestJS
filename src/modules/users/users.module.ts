import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose"
import { JwtService } from '@nestjs/jwt';

import { UsersController } from './controller/users.controller';

import { UsersService } from './services/users.service';
import { AuthService } from '../auth/services/auth.service';
import { UserSchema } from "./entities/users.model"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "user", schema: UserSchema }]),
  ],
  providers: [UsersService, AuthService, JwtService],
  controllers: [UsersController]
})

export class UserModule {}