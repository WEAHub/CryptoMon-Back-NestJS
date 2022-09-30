import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios'
import { firstValueFrom, map, Observable, catchError, of } from 'rxjs';
import * as cheerio from 'cheerio';

import { jsonData } from './mock/getMarketLatest'
import { marketSentimentJson } from './mock/getMarketSentimentRequest';

import { ListingLatest, ListingAsset } from './models/cmc.models'
import { ITradingViewSentimentRequest } from './models/tv.models'

@Injectable()
export class CoinMarketCapService {
  
  apiEnv = {
    CMC_API_URL: 'https://pro-api.coinmarketcap.com',
    CMC_API_KEY: this.configService.get<string>('CMC_API_KEY'),
    CMC_API_ROUTE_LATEST: '/v1/cryptocurrency/listings/latest',
    CMC_API_MAP: '/v1/cryptocurrency/map',
    CMC_EXCHANGE_MAP: '/v1/exchange/map',

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

  async getMarketSentiment(asset: string) {

    const postData = Object.assign({}, marketSentimentJson)
    postData.symbols.tickers.push(`BITSTAMP:${asset.toUpperCase()}`)

    const tvURL = 'https://scanner.tradingview.com/crypto/scan'
    const tvRequestHeaders = {
      headers: {
        'accept-encoding': 'gzip, deflate, br',
        'content-type': 'application/x-www-form-urlencoded'
      }
    }

    const tvRequest = this.httpService.post(tvURL, postData, tvRequestHeaders)
    const marketData = await firstValueFrom<ITradingViewSentimentRequest>(tvRequest)
    const dataObject = marketData.data.data[0].d.reduce(function(r,v,i) {
      r[postData.columns[i]] = v
      return r
    }, {})

    return dataObject
  }

  async getIDMap() {
    const mapRequest = this.requestApi(this.apiEnv.CMC_API_MAP)
    const mapData = await firstValueFrom(mapRequest)
    return mapData.data;
  }

  async getIDExchangeMap() {
    const mapRequest = this.requestApi(this.apiEnv.CMC_EXCHANGE_MAP)
    const mapData = await firstValueFrom(mapRequest)
    return mapData.data;
  }
}
