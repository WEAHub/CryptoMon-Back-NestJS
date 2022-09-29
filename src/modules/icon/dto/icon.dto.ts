import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { EIconType } from '../constants/icon.constants';

class getIcoDto {
	@IsNotEmpty()
	iconId: Number;

	@IsString()
	@IsNotEmpty()
	iconType: EIconType
}



export {
	getIcoDto
}