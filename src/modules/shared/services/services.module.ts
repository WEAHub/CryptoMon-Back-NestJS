import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MarketService } from '@modules/market/services/market.service';
import { CoinMarketCapService } from './coinmarketcap/coinmarketcap.service';
import { CryptoCompareService } from './cryptocompare/crypto-compare.service';


@Module({
	imports: [
		HttpModule
	],
  providers: [
		CryptoCompareService,
		CoinMarketCapService
  ],
	exports: [
		CryptoCompareService,
		CoinMarketCapService
	]
})

export class SharedServicesModule {

}
