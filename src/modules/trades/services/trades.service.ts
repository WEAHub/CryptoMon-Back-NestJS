import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TradeDocument, Trades } from '../entities/trades.model';
import { TradeAddDto, TradeModifyDto } from '../dto/trades.dto';
import { IUserToken } from '@modules/auth/interfaces/user.interface';
import { IResponse, EResponses } from '@shared/models/common-responses.interface';
import { AddAlertDTO, FinishAlertDTO } from '../dto/alerts.dto';
import { EAlerts, EAlertStatus } from '../interfaces/alerts.interface';
import { IAsset } from '../interfaces/trades.interface';

@Injectable()
export class TradesService {

  constructor(
    @InjectModel('trades') private readonly tradesModel: Model<TradeDocument>,
  ) { }
  
  async addTrade(user: IUserToken, tradeData: any): Promise<IResponse> {
    const tradesUserExists = await this.tradesModel.findOne(user);

    if(!tradesUserExists) {
      await this.tradesModel.create({
        ...user,
        trades: []
      })
    }

    const addTrade = await this.tradesModel.findOneAndUpdate(
      user,
      { $push: {
        'trades': {
          ...tradeData,
          timeStampAdded: new Date().getTime()
        }
      }}
    );

    if(!addTrade) {
      throw new NotAcceptableException('Something happened during adding new trade...');
    }

    return {
      message: EResponses.SUCCESS
    }
  }

  async getTrades(user: IUserToken): Promise<TradeDocument> {
    return await this.tradesModel.findOne(user);
  }

  async deleteTrade(user: IUserToken, tradeId: string) {
    
    const tradeExists = await this.tradesModel.findOneAndUpdate({
      ...user,
      }, {
        $pull: {
          trades: {
            _id: tradeId
          }
        }
      }
    )

    if(!tradeExists) {
      throw new NotAcceptableException('Trade not found...');
    }

    return {
      message: EResponses.SUCCESS
    }

  }

  async modifyTrade(user: IUserToken, tradeData: TradeModifyDto) {
     
    const tradeExists = await this.tradesModel.findOneAndUpdate({
      ...user,
      'trades': {
        '$elemMatch': {
          '_id': tradeData.id
        }
      }
      }, {
        $set: {
          'trades.$[trade]': tradeData
        }
      }, {
        arrayFilters: [
          {
            'trade._id': tradeData.id
          }
        ]
      }
    )
    
    if(!tradeExists) {
      throw new NotAcceptableException('Trade not found...');
    }

    return {
      message: EResponses.SUCCESS
    }
    
  }

  async tradesCount(user: IUserToken): Promise<number>{
    const tradesUserExists = await this.tradesModel.findOne(user);

    return tradesUserExists
    ? tradesUserExists.trades.length
    : 0

  }

/*   async getAlerts(user: IUserToken) {
    const userTrades: Trades = await this.tradesModel.findOne(user);
    const alerts = userTrades.trades
      .filter(trade => trade.alert)
      .map(trade => trade.alert)

    return {
      alerts
    }
  } */

  async addAlert(user: IUserToken, alert: AddAlertDTO): Promise<IResponse>  {

    const newAlert = {
      alertType: alert.alertType,
      data: alert.data,
      status: EAlertStatus.RUNNING
    }

    const alertExists = await this.tradesModel.findOneAndUpdate({
      ...user,
      'trades': {
        '$elemMatch': {
          '_id': alert.tradeId
        }
      }
      }, {
        $set: {
          'trades.$[trade].alert': newAlert
        }
      }, {
        arrayFilters: [
          {
            'trade._id': alert.tradeId
          }
        ]
      }
    )
    
    if(!alertExists) {
      throw new NotAcceptableException('Alert add error...');
    }

    return {
      message: EResponses.SUCCESS
    }
    
  }

  async modifyAlert(user: IUserToken, trade: IAsset, status: EAlertStatus): Promise<IResponse> {
    const alertExists = await this.tradesModel.findOneAndUpdate({
      ...user,
      'trades': {
        '$elemMatch': {
          '_id': trade.id
        }
      }
      }, {
        $set: {
          'trades.$[trade].alert.status': status
        }
      }, {
        arrayFilters: [
          {
            'trade._id': trade.id,
            'trade.alert._id': trade.alert._id
          }
        ]
      }
    )

    if(!alertExists) {
      throw new NotAcceptableException('Alert add error...');
    }

    return {
      message: EResponses.SUCCESS
    }
  }

 async deleteAlert(user: IUserToken, tradeId: string, alertId: string): Promise<IResponse> {
    const alertExists = await this.tradesModel.findOneAndUpdate({
      ...user,
      'trades': {
        '$elemMatch': {
          '_id': tradeId
        }
      }
    },
    { 
      $unset: { 
        "trades.$[].alert": {
          _id: alertId
        }
      }
    })
    
    if(!alertExists) {
      throw new NotAcceptableException('Alert finish error...');  
    }

    return {
      message: EResponses.SUCCESS
    }

  }

}
