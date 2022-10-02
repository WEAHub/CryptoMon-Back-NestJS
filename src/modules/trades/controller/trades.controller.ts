import { Body, Controller, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PairsByExchangeDto, PriceByExchangeTS, TradeAddDto, TradeDeleteDto, TradeModifyDto } from '../dto/trades.dto';
import { IUserTradesResponse, tradeType, IUserTrades, } from '../interfaces/trades.interface';
import { Trade, TradeDocument } from '../entities/trades.model';
import { CryptoCompareService } from '@shared/services/cryptocompare/crypto-compare.service';
import { CoinMarketCapService } from '@shared/services/coinmarketcap/coinmarketcap.service';
import { TradeUtilsService } from '../services/trade-utils.service';
import { TradesService } from '../services/trades.service';

@Controller('trades')
@UseGuards(AuthGuard('jwt'))
export class TradesController {

  constructor(
    private tradeService: TradesService,
    private cryptoCompareService: CryptoCompareService,
    private tradeUtilsService: TradeUtilsService,
    private coinMarketService: CoinMarketCapService
  ) { }

  @Get('/getAllExchanges') 
  async getAllExchanges() {
    return {
      exchanges: await this.coinMarketService.getExchanges()
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

          // const ccMapId = await this.coinMarketService.getAssetIDBySymbol(userTrade.fromSymbol)
          // const ccMapExchangeId = await this.coinMarketService.getExchangeIDByName(userTrade.exchangeName)

          const actualPrice = (await this.cryptoCompareService.getPriceByExchangeTS({ 
            ...userTrade,
            timeStamp: new Date().getTime()
          })).price;

          const symbolPrice = await this.cryptoCompareService.getPriceBySymbol(userTrade.fromSymbol)

          const percentChange = this.tradeUtilsService.calcPercentageChange(userTrade, actualPrice)
          
          const quantityValue = userTrade.price * userTrade.quantity
          
          const quantityActualValue = actualPrice * userTrade.quantity
          
          const profitLoss = Math.abs(quantityActualValue - quantityValue)

          return {
            ...userTrade,
           //  ccMapId,
           //  ccMapExchangeId,
            actualPrice,
            percentChange,
            quantityValue,
            quantityActualValue,
            profitLoss,
            symbolPrice
          }  
        }
      )
    )

    return {
      userTrades: tradesUser,
    }
  }

  @Post('/deleteTrade')
  async deleteTrade(@Request() req, @Body() tradeData: TradeDeleteDto) {
    return this.tradeService.deleteTrade(req.user, tradeData._id)
  }

  @Post('/modifyTrade')
  async modifyTrade(@Request() req, @Body() tradeData: TradeModifyDto) {
    return this.tradeService.modifyTrade(req.user, tradeData)
  }


}


