import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MarketController } from './controller/market.controller';
import { MarketService } from './services/market.service';

@Module({
  imports: [
    HttpModule,
  ],
  controllers: [MarketController],
  providers: [MarketService]
})
export class MarketModule {}
