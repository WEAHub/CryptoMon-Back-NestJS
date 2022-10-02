import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CoinMarketCapService } from '@shared/services/coinmarketcap/coinmarketcap.service';


@Controller('market')
@UseGuards(AuthGuard('jwt'))
export class MarketController {

  constructor(
    private coinMarketService: CoinMarketCapService
  ) {}
    

  @Get('/getMarketLatest')
  async getMarketLatest() {
    return this.coinMarketService.getMarketLatest();
  }

  @Get('/getMarketNew')
  async getMarketNew() {
    return this.coinMarketService.getMarketNewListings();
  }

  @Get('/getMarketSentiment/:asset/') 
  async getMarketSentiment(@Param('asset') asset) {
    return this.coinMarketService.getMarketSentiment(asset)
  }
  
}
