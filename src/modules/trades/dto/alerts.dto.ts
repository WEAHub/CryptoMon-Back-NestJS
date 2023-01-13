import { IsArray, IsEnum, IsNotEmpty, IsObject, IsString } from "class-validator";
import { EAlerts, IAlertInput } from "../interfaces/alerts.interface";

class AddAlertDTO {
	@IsNotEmpty()
	@IsString()
	tradeId: string;
  
  @IsEnum(EAlerts)
	alertType: EAlerts

  @IsNotEmpty()
  @IsArray()
	data: IAlertInput[]
}

class FinishAlertDTO {
	@IsNotEmpty()
	@IsString()
	tradeId: string;

	@IsNotEmpty()
	@IsString()
	alertId: string;
}

export {
  AddAlertDTO,
  FinishAlertDTO
}