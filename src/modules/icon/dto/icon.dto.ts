import { IsNotEmpty, IsString } from 'class-validator';
import { EIconType } from '../constants/icon.constants';

class getIcoDto {
	@IsString()
	@IsNotEmpty()
	iconName: string;

	@IsString()
	@IsNotEmpty()
	iconType: EIconType
}



export {
	getIcoDto
}