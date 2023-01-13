import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EAlerts, EAlertStatus, IAlertInput } from '../interfaces/alerts.interface';
import { tradeType } from '../interfaces/trades.interface';

type TradeDocument = Trades & Document;

@Schema({versionKey: false})
class Alert {
  
  @Prop({type: String, required: true, enum: EAlerts})
  alertType: string;
  
  @Prop({type: Array<IAlertInput>, required: true})
  data: {}

  @Prop({type: String, required: true, enum: EAlertStatus})
  status: string

}

const AlertSchema = SchemaFactory.createForClass(Alert);

@Schema({versionKey: false})
class Prices {
  
  @Prop({type: Number, required: true})
  USD: number;

  @Prop({type: Number, required: true})
  EUR: number;

  @Prop({type: Number, required: true})
  JPY: number;
}

const PricesSchema = SchemaFactory.createForClass(Prices);

@Schema({versionKey: false})
class Trade {
  
  @Prop({type: String, required: true})
  exchangeName: string;

  @Prop({type: Number, required: true})
  quantity: number;

  @Prop({type: String, required: true})
  fromSymbol: string

  @Prop({type: String, required: true})
  toSymbol: string;

  @Prop({type: String, enum: tradeType})
  tradeType: string;

  @Prop({type: Number, required: true})
  price: number

  @Prop({type: Number, required: true})
  timeStamp: number

  @Prop({type: Number, required: true})
  timeStampAdded: number

  @Prop({type: AlertSchema, required: false})
  alert: Alert;

  @Prop({type: PricesSchema, required: true})
  pricesOnAdd: Prices
}

const TradeSchema = SchemaFactory.createForClass(Trade);

@Schema()
class Trades {
  @Prop({type: String, required: true})
  username: string;
  
  @Prop({type: String, required: true})
  userId: string;

  @Prop([{type: TradeSchema, required: true}])
  trades: Trade[];

}

const TradesSchema = SchemaFactory.createForClass(Trades);


export {
  Trades,
  TradesSchema,
  Trade,
  TradeSchema,
  Alert,
  AlertSchema,
  Prices,
  PricesSchema,
  TradeDocument,
}