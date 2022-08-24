import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.model';
import { hash } from 'bcrypt';

@Controller('auth')
export class UsersController {
	constructor(private readonly usersService: UsersService) { }

	@Post('/signup')
	async createUser(
		@Body('password') password: string,
		@Body('username') username: string,
		@Body('name') name: string,
	): Promise<User> {
		const saltOrRounds = 10;
		const hashedPassword = await hash(password, saltOrRounds);
		const result = await this.usersService.createUser(
			username,
			hashedPassword,
			name,
		);
		return result;
	}
}