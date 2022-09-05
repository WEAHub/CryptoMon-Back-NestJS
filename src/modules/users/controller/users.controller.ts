import { Body, Controller, Post, Get, Param, UseGuards, NotAcceptableException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../services/users.service';
import { modifyUserDto } from '../dto/users.dto';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { compare } from 'bcrypt';
import { QueryWithHelpers } from 'mongoose';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) { }

  @Post('/modifyUser')
  async modifyUser(@Body() user: modifyUserDto) {
    
    const _user = await this.usersService.getUser({ username: user.username })
    if (!_user) {
      throw new NotAcceptableException('User does not exist');
    }

    const passwordValid = await compare(user.currentPassword, _user.password)
    if(!passwordValid) {
      throw new NotAcceptableException('Current password wrong!');
    }

    const hashedPassword = user.newPassword 
      ? await this.authService.hashPassword(user.newPassword)
      : _user.password

    const updateDoc = {
      name: user.name,
      password: hashedPassword
    }

    const updateUser = await this.usersService.modifyUser(user.username, updateDoc)

    if(updateUser.found) {

      const message = updateUser.updated
      ? `User ${user.username} modified!`
      : `Nothing to update.`

      return {
        name: user.name,
        message
      }

    }

    throw new NotAcceptableException('Problem ocurred during update user.');

  }

}