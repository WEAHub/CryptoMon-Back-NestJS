import { IsNotEmpty, IsString } from 'class-validator';

class SignupDto {
	
	@IsNotEmpty()
	@IsString()
	username: string;
	
	@IsNotEmpty()
	@IsString()
	password: string;
	
	@IsNotEmpty()
	@IsString()
	name: string;
}

export {
	SignupDto
}