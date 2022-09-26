import { IsNotEmpty, IsString } from 'class-validator';


class LoginDto {
	
	@IsNotEmpty()
	@IsString()
	username: string;
	
	@IsNotEmpty()
	@IsString()
	password: string;

}

class SignupDto extends LoginDto {
	@IsNotEmpty()
	@IsString()
	name: string;
}

class UserDto {
	@IsNotEmpty()
	@IsString()
	username: string;

	@IsNotEmpty()
	@IsString()
	sub: string;
}

export {
	LoginDto,
	SignupDto,
	UserDto
}