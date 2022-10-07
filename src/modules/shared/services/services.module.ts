import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CoinMarketCapService } from './coinmarketcap/coinmarketcap.service';
import { CoinTickerService } from './cointicker/cointicker.service';
import { CryptoCompareService } from './cryptocompare/crypto-compare.service';
import { TVTicker } from './tv-ticker/tv-ticker.service';


@Module({
	imports: [
		HttpModule
	],
  providers: [
		CryptoCompareService,
		CoinMarketCapService,
    CoinTickerService,
    TVTicker,
  ],
	exports: [
		CryptoCompareService,
		CoinMarketCapService,
    CoinTickerService,
    TVTicker,
	]
})

export class SharedServicesModule {

}
