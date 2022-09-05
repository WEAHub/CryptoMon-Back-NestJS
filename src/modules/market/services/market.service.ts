import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map, Observable, tap, catchError, of } from 'rxjs';
import { AxiosResponse } from 'axios'
import { jsonData } from '../mock/getMarketLatest'
import * as cheerio from 'cheerio';
import { ConfigService } from '@nestjs/config';
import { ListingLatest, ListingAsset } from '../models/cmc.models'


@Injectable()
export class MarketService {
  
  apiEnv = {
    CMC_API_URL: 'https://pro-api.coinmarketcap.com',
    CMC_API_KEY: this.configService.get<string>('CMC_API_KEY'),
    CMC_API_ROUTE_LATEST: '/v1/cryptocurrency/listings/latest',

    CMC_SCRAP_URL: 'https://coinmarketcap.com',
    CMC_SCRAP_ROUTE_NEW: '/new'
  }

  httpConfig = {
    headers: {
      'X-CMC_PRO_API_KEY': this.apiEnv.CMC_API_KEY
    }
  }

  sparkLinesUrl = 'https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/{id}.svg'
  assetIconUrl = 'https://s2.coinmarketcap.com/static/img/coins/64x64/{id}.png'

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) { }

  requestApi(path: string): Observable<AxiosResponse> {
    const url = `${this.apiEnv.CMC_API_URL}${path}`
    return this.httpService.get(url, this.httpConfig)
      .pipe(
        map(response => response.data),
        catchError(error => of(console.log('ERROR:', error.code))
      ))
  }

  async getMarketLatest() {
    // FREE API PLAN

     return jsonData

    const apiRequest = this.requestApi(this.apiEnv.CMC_API_ROUTE_LATEST)
    const apiData = await firstValueFrom<ListingLatest>(apiRequest)
    const retData = apiData.data.map((json: ListingAsset) => {
      return {
        id: json.id,
        name: json.name,
        symbol: json.symbol,
        sparklinesImgUrl: this.sparkLinesUrl.replace('{id}', json.id.toString()),
        assetIconImgUrl: this.assetIconUrl.replace('{id}', json.id.toString()),
        max_supply: json.max_supply,
        total_supply: json.total_supply,
        price: json.quote.USD.price,
        volume_24h: json.quote.USD.volume_24h,
        volume_change_24h: json.quote.USD.volume_change_24h,
        percent_change_24h: json.quote.USD.percent_change_24h,
        market_cap: json.quote.USD.market_cap,
        market_cap_dominance: json.quote.USD.market_cap_dominance,
      }
    })
    return retData;
    
  }

  async getMarketNewListings() {

    // Problema: La api key es free plan asi que no tengo acceso a esta peticion por api, toca escrapear

    const url = `${this.apiEnv.CMC_SCRAP_URL}${this.apiEnv.CMC_SCRAP_ROUTE_NEW}`
    const htmlData = await firstValueFrom(this.httpService.get(url, this.httpConfig))
    const $ = cheerio.load(htmlData.data)
    const newListings = []

    $('table.cmc-table tbody').find('tr').each(function() {
      const cells = $(this).find('td');
      newListings.push({
        index: $($(cells)[1]).text(),
        imgLogo: $($(cells)[2]).find('.coin-logo').attr('src'),
        link: 'https://coinmarketcap.com' + $($(cells)[2]).find('.cmc-link').attr('href'),
        name: $($($(cells[2])).find('p')[0]).text(),
        symbol: $($($(cells[2])).find('p')[1]).text(),
        price: $($(cells[3])).text(),
        added: $($(cells[9])).text(),

      })
    })

    return newListings
  }

}
