import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { tradeType } from '../interfaces/trades.interface';

type TradeDocument = Trades & Document;

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
  TradeSchema,
  TradesSchema,
  TradeDocument,
  Trades,
  Trade,
}