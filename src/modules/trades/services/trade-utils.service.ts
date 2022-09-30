import { Trade } from "../models/trades.model";
import { tradeType } from '../models/trades.interface';
import { Injectable } from "@nestjs/common";

@Injectable()
export class TradeUtilsService {
	constructor() {

	}

	calcPercentageChange(trade: Trade, actualPrice: number) {

		const tradeDirection = trade.tradeType == tradeType.BUY
		
		const tradePriceAction = tradeDirection 
		? actualPrice > trade.price
		: actualPrice < trade.price
		
		const percentChange = 100 * Math.abs(
			(actualPrice - trade.price) / ((actualPrice + trade.price) / 2)
		)
	
		const minusAdd = (!tradePriceAction ? '-' : '')
	
		return Number(minusAdd + percentChange.toFixed(2));
	
	}
}
