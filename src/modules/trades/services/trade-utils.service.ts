import { Trade } from "../entities/trades.model";
import { tradeType } from '../interfaces/trades.interface';
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
