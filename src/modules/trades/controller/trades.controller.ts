import { Body, Controller, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from 'src/modules/auth/dto/auth.dto';
import { PairsByExchangeDto, PriceByExchangeTS, TradeAddDto } from '../dto/trades.dto';
import { CryptoCompareService } from '../services/crypto-compare.service';
import { TradesService } from '../services/trades.service';

@Controller('trades')
@UseGuards(AuthGuard('jwt'))
export class TradesController {

	constructor(
		private tradeService: TradesService,
		private cryptoCompareService: CryptoCompareService
	) { }

	@Get('/getAllExchanges') 
	async getAllExchanges() {
		return this.cryptoCompareService.getAllExchanges()
	}

	@Get('/getPairsByExchange/:exchangeName')
	async getParisByExchange(@Param() params: PairsByExchangeDto) {
		return this.cryptoCompareService.getPairsByExchange(params.exchangeName)
	}

	@Post('/getPriceByExchangeTS')
	async getPriceByExchangeTS(@Body() coinData: PriceByExchangeTS) {
		return this.cryptoCompareService.getPriceByExchangeTS(coinData)
	}

	@Post('/addTrade')
	async addTrade(@Request() req, @Body() tradeData: TradeAddDto) {
		return this.tradeService.addTrade(req.user, tradeData)
	}
}


