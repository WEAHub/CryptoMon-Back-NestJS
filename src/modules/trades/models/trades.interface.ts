import { Trade } from "./trades.model"

enum tradeType {
	BUY = 'buy',
	SELL = 'sell'
}

interface IUserTrades extends Trade {
	percentChange: string;
	actualPrice: number;
	logoUrl: string;
}

interface IUserTradesResponse {
	userTrades: IUserTrades[];
}

export {
	tradeType,
	IUserTrades,
	IUserTradesResponse
}