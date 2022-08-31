import { Body, Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../services/users.service';
import {
  changeNameDto,
  changePasswordDto 
} from '../dto/users.dto';

@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @UseGuards(AuthGuard('jwt'))
  
  @Post('/changePassword')
  async changePassword(@Body() user: changePasswordDto) {
    
  }

  @Post('/changeName')
  async changeName(@Body() user: changeNameDto) {
    
  }

}