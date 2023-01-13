import { Trade } from "../entities/trades.model"
import { ITradeAlert } from "./alerts.interface";

enum tradeType {
	BUY = 'buy',
	SELL = 'sell'
}

interface IUserTrades extends Trade {
  actualPrice: number;
  symbolPrice: {};
}

interface IUserTradesResponse {
	userTrades: IUserTrades[];
}

interface IAsset {
  exchange: string;
  fromSymbol: string;
  toSymbol: string;  
  id?: string;
  price?: number;
  alert?: ITradeAlert;
  user?: {};
}

export {
	tradeType,
	IUserTrades,
  IAsset,
	IUserTradesResponse
}