import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TradeDocument } from '../entities/trades.model';
import { TradeAddDto, TradeModifyDto } from '../dto/trades.dto';
import { IUserToken } from '@modules/auth/interfaces/user.interface';
import { IResponse, EResponses } from '@shared/models/common-responses.interface';

@Injectable()
export class TradesService {

  constructor(
    @InjectModel('trades') private readonly tradesModel: Model<TradeDocument>,
  ) { }
  
  async addTrade(user: IUserToken, tradeData: TradeAddDto): Promise<IResponse> {
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

}
