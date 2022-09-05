import { IsNotEmpty, IsString } from 'class-validator';

class modifyUserDto {
	
	@IsNotEmpty()
	@IsString()
	username: string;
	
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsString()
	currentPassword: string;
	
	@IsString()
	newPassword: string;
}

export {
	modifyUserDto,
}