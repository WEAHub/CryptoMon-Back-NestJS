import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';

import { TradesController } from './controller/trades.controller';

import { TradesService } from './services/trades.service';
import { CryptoCompareService } from './services/crypto-compare.service';

import { TradesSchema } from './models/trades.model';


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
    CryptoCompareService
  ]
})
export class TradesModule {}
