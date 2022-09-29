import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { MarketService } from 'src/modules/market/services/market.service';
import { CCMapService } from './cc-map/cc-map.service';

@Global()
@Module({
	imports: [
		HttpModule
	],
  providers: [
		CCMapService,
		MarketService,
  ],
	exports: [
		CCMapService
	]
})

export class SharedServicesModule {

}
