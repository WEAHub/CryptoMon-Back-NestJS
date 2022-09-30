import { Body, Controller, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PairsByExchangeDto, PriceByExchangeTS, TradeAddDto, TradeDeleteDto } from '../dto/trades.dto';
import { IUserTradesResponse, tradeType, IUserTrades, } from '../models/trades.interface';
import { Trade, TradeDocument } from '../models/trades.model';
import { CryptoCompareService } from '@shared/services/cryptocompare/crypto-compare.service';

import { TradeUtilsService } from '../services/trade-utils.service';
import { TradesService } from '../services/trades.service';
import { CCMapService } from '@shared/services/coinmarketcap-map/cc-map.service';

@Controller('trades')
@UseGuards(AuthGuard('jwt'))
export class TradesController {

  constructor(
    private tradeService: TradesService,
    private cryptoCompareService: CryptoCompareService,
    private tradeUtilsService: TradeUtilsService,
    private ccMapService: CCMapService
  ) { }

  @Get('/getAllExchanges') 
  async getAllExchanges() {
    return {
      exchanges: await this.ccMapService.getExchanges()
    }
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

  @Get('/getTrades')
  async getTrades(@Request() req): Promise<IUserTradesResponse> {

    const tradesUserExists: TradeDocument = await this.tradeService.getTrades(req.user)

    if(!tradesUserExists) {
      return {
        userTrades: []
      }
    }

    const tradesUser: IUserTrades[] = await Promise.all(
      tradesUserExists.toObject().trades.map(
        async (userTrade: Trade) => {

          const ccMapId = await this.ccMapService.getAssetIDBySymbol(userTrade.fromSymbol)
          const ccMapExchangeId = await this.ccMapService.getExchangeIDByName(userTrade.exchangeName)

          const actualPrice = (await this.cryptoCompareService.getPriceByExchangeTS({ 
            ...userTrade,
            timeStamp: new Date().getTime()
          })).price;

          const percentChange = this.tradeUtilsService.calcPercentageChange(userTrade, actualPrice)
          
          const quantityValue = userTrade.price * userTrade.quantity
          
          const quantityActualValue = actualPrice * userTrade.quantity
          
          const profitLoss = Math.abs(quantityActualValue - quantityValue)

          return {
            ...userTrade,
            ccMapId,
            ccMapExchangeId,
            actualPrice,
            percentChange,
            quantityValue,
            quantityActualValue,
            profitLoss,
          }  
        }
      )
    )

    return {
      userTrades: tradesUser
    }
  }

  @Post('/deleteTrade')
  async deleteTrade(@Request() req, @Body() tradeData: TradeDeleteDto) {
    return this.tradeService.deleteTrade(req.user, tradeData._id)
  }

}


