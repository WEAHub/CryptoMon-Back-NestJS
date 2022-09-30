import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MarketService } from '@modules/market/services/market.service';
import { CCMapService } from './coinmarketcap-map/cc-map.service';
import { CoinMarketCapService } from './coinmarketcap/coinmarketcap.service';
import { CryptoCompareService } from './cryptocompare/crypto-compare.service';


@Module({
	imports: [
		HttpModule
	],
  providers: [
		CCMapService,
		CryptoCompareService,
		CoinMarketCapService
  ],
	exports: [
		CCMapService,
		CryptoCompareService,
		CoinMarketCapService
	]
})

export class SharedServicesModule {

}
