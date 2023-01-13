import { Body, Controller, Get, Param, Post, UseGuards, Request, Delete, Patch, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PairsByExchangeDto, PriceByExchangeTS, TradeAddDto, TradeDeleteDto, TradeModifyDto } from '../dto/trades.dto';
import { AddAlertDTO, FinishAlertDTO } from '../dto/alerts.dto';

import { IUserTradesResponse, IUserTrades, } from '../interfaces/trades.interface';
import { Trade, TradeDocument, Trades } from '../entities/trades.model';
import { CryptoCompareService } from '@shared/services/cryptocompare/crypto-compare.service';
import { CoinMarketCapService } from '@shared/services/coinmarketcap/coinmarketcap.service';
import { TradesService } from '../services/trades.service';

import { alertList } from '../constants/alerts.constants';

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

    const pricesOnAdd = await this.cryptoCompareService.getPriceBySymbol(tradeData.fromSymbol)
    const trade = {
      ...tradeData,
      pricesOnAdd
    }
    return this.tradeService.addTrade(req.user, trade)
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
    return await this.cryptoCompareService.getAllExchanges()
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

    const tradesUserExists = await this.tradeService.getTrades(req.user)

    if(!tradesUserExists) {
      return {
        userTrades: [],
      }
    }

    const tradesObj: Trades = tradesUserExists.toObject();

    const tradesUser: IUserTrades[] = await Promise.all(

      tradesObj.trades.map(async (userTrade: Trade) => {

        const actualPrice = (
          await this.cryptoCompareService.getPriceByExchangeTS({ 
            ...userTrade, 
            timeStamp: new Date().getTime() 
          })
        ).price;

        const symbolPrice = await this.cryptoCompareService.getPriceBySymbol(userTrade.fromSymbol)

        return {
          ...userTrade,
          actualPrice,
          symbolPrice
        }  
      })

    )

    return {
      userTrades: tradesUser,
    }
  }

  @Get('/getAlertsList')
  async getAlertsList() {
    return {
      alertList
    }
  }

  
  @Put('/addAlert')
  async addAlerts(@Request() req, @Body() alert: AddAlertDTO) {
    const message = await this.tradeService.addAlert(req.user, alert)
    return message
  }

  @Patch('/finishAlert')
  async finishAlert(@Request() req, @Body() trade: FinishAlertDTO) {
    console.log('Finished alert', trade);
    
    const message = await this.tradeService.deleteAlert(req.user, trade.tradeId, trade.alertId)
    return message
  }

}


