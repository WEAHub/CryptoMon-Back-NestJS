import { Body, Controller, Post, Get, Param, UseGuards, NotAcceptableException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { compare } from 'bcrypt';

import { UsersService } from '../services/users.service';
import { AuthService } from 'src/modules/auth/services/auth.service';

import { modifyUserDto, deleteUser } from '../dto/users.dto';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) { }

  @Post('/deleteUser')
  async deleteUser(@Body() user: deleteUser) {
        
    const _user = await this.usersService.getUser({ username: user.username })
    if (!_user) {
      throw new NotAcceptableException('User does not exist');
    }

    const passwordValid = await compare(user.password, _user.password)
    if(!passwordValid) {
      throw new NotAcceptableException('Current password wrong!');
    }

    const deletedUser = this.usersService.deleteUser(user.username)

    if(deletedUser) {
      return {
        name: user.username,
        message: `${user.username} deleted succesfully.`
      }
    }
    
    throw new NotAcceptableException('Problem ocurred trying to delete this user.');
  }

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