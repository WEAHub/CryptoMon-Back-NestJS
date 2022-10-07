import { Body, Controller, Get, Param, Post, UseGuards, Request, Delete, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PairsByExchangeDto, PriceByExchangeTS, TradeAddDto, TradeDeleteDto, TradeModifyDto } from '../dto/trades.dto';
import { IUserTradesResponse, IUserTrades, } from '../interfaces/trades.interface';
import { Trade, TradeDocument } from '../entities/trades.model';
import { CryptoCompareService } from '@shared/services/cryptocompare/crypto-compare.service';
import { CoinMarketCapService } from '@shared/services/coinmarketcap/coinmarketcap.service';
import { TradesService } from '../services/trades.service';

@Controller('trades')
@UseGuards(AuthGuard('jwt'))
export class TradesController {

  constructor(
    private tradeService: TradesService,
    private cryptoCompareService: CryptoCompareService,
    private coinMarketService: CoinMarketCapService
  ) { }

  @Post('/addTrade')
  async addTrade(@Request() req, @Body() tradeData: TradeAddDto) {
    return this.tradeService.addTrade(req.user, tradeData)
  }

  @Delete('/deleteTrade/:tradeId')
  async deleteTrade(@Request() req, @Param() params: TradeDeleteDto) {
    return this.tradeService.deleteTrade(req.user, params.tradeId)
  }

  @Patch('/modifyTrade')
  async modifyTrade(@Request() req, @Body() tradeData: TradeModifyDto) {
    return this.tradeService.modifyTrade(req.user, tradeData)
  }

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

          const actualPrice = (await this.cryptoCompareService.getPriceByExchangeTS({ 
            ...userTrade, 
            timeStamp: new Date().getTime() 
          })).price;

          const symbolPrice = await this.cryptoCompareService.getPriceBySymbol(userTrade.fromSymbol)

          return {
            ...userTrade,
            actualPrice,
            symbolPrice
          }  
        }
      )
    )

    return {
      userTrades: tradesUser,
    }
  }

}


