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


export {
	LoginDto,
	SignupDto,
}