import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CoinMarketCapService } from './coinmarketcap/coinmarketcap.service';
import { CoinTickerService } from './cryptocompare-ticker/cryptocompare-ticker.service';
import { CryptoCompareService } from './cryptocompare/crypto-compare.service';
import { TradingViewTicker } from './tradingview-ticker/tv-ticker.service';


@Module({
	imports: [
		HttpModule
	],
  providers: [
		CryptoCompareService,
		CoinMarketCapService,
    CoinTickerService,
    TradingViewTicker,
  ],
	exports: [
		CryptoCompareService,
		CoinMarketCapService,
    CoinTickerService,
    TradingViewTicker,
	]
})

export class SharedServicesModule {

}
