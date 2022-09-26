import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { UserDto } from 'src/modules/auth/dto/auth.dto';
import { TradeAddDto, TradeModifyDto } from '../dto/trades.dto';
import { Trades, TradeDocument } from '../models/trades.model';

@Injectable()
export class TradesService {

	constructor(
    @InjectModel('trades') private readonly tradesModel: Model<TradeDocument>
	) { }

	async addTrade(user: UserDto, tradeData: TradeAddDto) {

		const userData = {
			username: user.username,
			userId: user.sub,
		}

		const tradesUserExists = await this.tradesModel.findOne(userData);

		if(!tradesUserExists) {
			await this.tradesModel.create({
				...userData,
				trades: []
			})
		}

		const addTrade = await this.tradesModel.findOneAndUpdate(
			userData,
			{ $push: {
				'trades': {
					...tradeData
				}
			}}
		);

		if(!addTrade) {
      throw new NotAcceptableException('Something happened during adding new trade...');
    }

		return addTrade
	}

	async modifyTrade(tradeData: TradeModifyDto) {
		
	}
}
