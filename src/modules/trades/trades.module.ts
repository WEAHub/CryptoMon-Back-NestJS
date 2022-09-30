import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';

import { TradesController } from './controller/trades.controller';

import { TradesService } from './services/trades.service';

import { TradesSchema } from './models/trades.model';
import { TradeUtilsService } from './services/trade-utils.service';


@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: "trades", schema: TradesSchema }]),
  ],
  controllers: [
    TradesController
  ],
  providers: [
    TradesService, 
    TradeUtilsService,
  ]
})
export class TradesModule {}
