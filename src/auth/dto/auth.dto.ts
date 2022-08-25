import { IsNotEmpty, IsString } from 'class-validator';

class AuthLoginDto {

	@IsNotEmpty()
	@IsString()
	username: string;

	@IsNotEmpty()
	@IsString()
	password: string;

}

export {
	AuthLoginDto
}