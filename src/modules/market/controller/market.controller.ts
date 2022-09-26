import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MarketService } from '../services/market.service';

@Controller('market')
@UseGuards(AuthGuard('jwt'))
export class MarketController {

	constructor(
		private marketService: MarketService
	) {}
		

	@Get('/getMarketLatest')
  async getMarketLatest() {
		return this.marketService.getMarketLatest();
  }

	@Get('/getMarketNew')
  async getMarketNew() {
		return this.marketService.getMarketNewListings();
  }

	@Get('/getMarketSentiment/:asset/') 
	async getMarketSentiment(@Param('asset') asset) {
		return this.marketService.getMarketSentiment(asset)
	}
	
}
