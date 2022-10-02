import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, map } from 'rxjs';
import { CC_API_ROUTES } from './constants/crypto-compare.routes';
import { PriceByExchangeTS } from '@modules/trades/dto/trades.dto';
import { IAllExchanges, IExchange, IPairs, IPrices, IPriceSingle } from './interfaces/cc-api.models';

@Injectable()
export class CryptoCompareService {

  httpConfig = {
    headers: {
      'authorization': 'Apikey ' + this.configService.get<string>('CC_API_KEY'),
    }
  }
	
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) { }

	ccApiGet(url: string) {
    return this.httpService.get(url, this.httpConfig)
      .pipe(
        map(response => response.data),
        catchError(error => {
					throw new InternalServerErrorException(error)
				})
      )
	}

	async getAllExchanges() {
		const request = this.ccApiGet(CC_API_ROUTES.ALL_EXCHANGES)
    const data: IAllExchanges = await firstValueFrom<IAllExchanges>(request)
		return {
			exchanges : Object.values(data.Data).map((exchange: IExchange) => {
				return {
					id: exchange.Id,
					name: exchange.Name,
					logo: `https://cryptocompare.com${exchange.LogoUrl}`				
				}
			})
		}
	}

	async getPairsByExchange(exchange: string) {
		const request = this.ccApiGet(CC_API_ROUTES.ALL_PAIRS_BY_EXCHANGE + exchange.toLowerCase())
    const data: IPairs = await firstValueFrom<IPairs>(request)
		return {
			pairs : data.Data.current
		}
	}

	async getPriceByExchangeTS(pairData: PriceByExchangeTS) {
		const ccTs = (pairData.timeStamp) / 1000
		const url = `${CC_API_ROUTES.PRICE_BY_EXCHANGE_TS}` +
			[
				`toTs=${ccTs}`,
				`e=${pairData.exchangeName}`,
				`fsym=${pairData.fromSymbol}`,
				`tsym=${pairData.toSymbol}`,
				'limit=1'
			].join('&');

		const request = this.ccApiGet(url)		
    const data: IPrices = await firstValueFrom<IPrices>(request)
		return {
			price: data.Data.Data.at(-1).close,
			toSymbol: pairData.toSymbol
		}

	}

  async getPriceBySymbol(symbol: string) {
    const url = `${CC_API_ROUTES.PRICE_BY_SYMBOL}${symbol}`
		const request = this.ccApiGet(url)		
    const data: IPriceSingle = await firstValueFrom<IPriceSingle>(request)
		return data
  }

}
