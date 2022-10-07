import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';

import { TradesController } from './controller/trades.controller';

import { TradesService } from './services/trades.service';

import { TradesSchema } from './entities/trades.model';
import { TradeGateway } from './gateway/trades.gateway';


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
    TradeGateway
  ],
  exports: [
    TradesService
  ]
})
export class TradesModule {}
