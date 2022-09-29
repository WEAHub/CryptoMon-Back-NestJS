import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

class PairsByExchangeDto {
	@IsNotEmpty()
	@IsString()
	exchangeName: string;
}

class PriceByExchangeTS extends PairsByExchangeDto {
	@IsNotEmpty()
	@IsNumber()
	timeStamp: number;

	@IsNotEmpty()
	@IsString()
	fromSymbol: string;

	@IsNotEmpty()
	@IsString()
	toSymbol: string;
}

enum TradeType {
	BUY = 'buy',
	SELL = 'sell',
}

class TradeAddDto extends PriceByExchangeTS {
	@IsNotEmpty()
	@IsString()
	@IsEnum(TradeType)
	tradeType: TradeType;
	
	@IsNotEmpty()
	@IsNumber()
	quantity: number;

	@IsNotEmpty()
	@IsNumber()
	price: number;
	
}

class TradeDeleteDto extends TradeAddDto {	
	@IsNotEmpty()
	@IsString()
	_id: string;
}

class TradeModifyDto extends TradeAddDto {
	@IsNotEmpty()
	@IsString()
	tradeId: string;
}

export {
	PairsByExchangeDto,
	PriceByExchangeTS,
	TradeAddDto,
	TradeDeleteDto,
	TradeModifyDto,
}