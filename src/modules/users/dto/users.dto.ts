import { IsNotEmpty, IsString } from 'class-validator';

class changePasswordDto {
	
	@IsNotEmpty()
	@IsString()
	username: string;
	
	@IsNotEmpty()
	@IsString()
	oldPassword: string;
	
	@IsNotEmpty()
	@IsString()
	newPassword: string;
}

class changeNameDto {
	@IsNotEmpty()
	@IsString()
	newName: string;

	@IsNotEmpty()
	@IsString()
	password: string;
}


export {
	changePasswordDto,
	changeNameDto
}