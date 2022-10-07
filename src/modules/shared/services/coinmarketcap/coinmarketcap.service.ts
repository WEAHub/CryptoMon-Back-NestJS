import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios'
import { firstValueFrom, map, Observable, catchError, of } from 'rxjs';
import * as cheerio from 'cheerio';

import { jsonData } from './mock/getMarketLatest'
import { marketSentimentJson } from './mock/getMarketSentimentRequest';

import { ListingLatest, ListingAsset } from './interfaces/cmc.interface'
import { ITradingViewSentimentRequest } from './interfaces/tv.interface'
import { EMapType, IMapAsset, IMapExchange } from './interfaces/map.interface';
import { API_ROUTES, sparkLinesUrl } from './constants/coinmarketcap.constants';
import { createReadStream, createWriteStream, existsSync, mkdirSync } from 'fs';
import { finished } from 'stream';

@Injectable()
export class CoinMarketCapService {

	private ccAssetMap: IMapAsset[] = []
	private ccExchangeMap: IMapExchange[] = []

	private assetJsonPath = this.configService.get('CC_ASSET_MAP_JSON')
	private assetPath = this.configService.get('CC_ASSET_ICON_FOLDER')

	private exchangeJsonPath = this.configService.get('CC_EXCHANGE_MAP_JSON')
	private exchangePath = this.configService.get('CC_EXCHANGE_ICON_FOLDER')
  
  private httpConfig = {
    headers: {
      'X-CMC_PRO_API_KEY': this.configService.get<string>('CMC_API_KEY'),
    }
  }

  lastAssetBuild!: Date
  lastExchangeBuild!: Date;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    
		this.buildDB()
	}

  /*
   * CoinMarketCap Service
   * JSON MAP DB
   */

	private async	buildDB() {
		await this.buildAssetMap()
		await this.buildExchangemap()
	}

  checkDates(buildDate: Date): boolean {
    return buildDate === undefined 
    ? false 
    : buildDate.getDate() === new Date().getDate()
  }

  private async buildAssetMap() {
    if(this.checkDates(this.lastAssetBuild)) return
    this.lastAssetBuild = new Date()
    this.ccAssetMap = await this.loadMap(this.assetPath, this.assetJsonPath, EMapType.ASSET)
  }

  private async buildExchangemap() {
    if(this.checkDates(this.lastExchangeBuild)) return
    this.lastExchangeBuild = new Date()
    this.ccExchangeMap = await this.loadMap(this.exchangePath, this.exchangeJsonPath, EMapType.EXCHANGE)
  }

	private checkFolderStructure(path: string) {
		if(!existsSync(path)) {
			mkdirSync(path, { recursive: true })
		}
	}

	private async loadMap(path: string, jsonPath: string, mapType: EMapType) {
		console.log(`[CC] Loading ${mapType.toUpperCase()} JSON MAP`);
		this.checkFolderStructure(path);
		return !existsSync(jsonPath)
		? await this.buildMap(mapType, jsonPath)
		: await this.readMap(jsonPath)
	}

	async readMap(mapPath: string): Promise<any> {
		return new Promise(function (resolve, reject) {
			
			let dataBuffer = ''
			const mapReader = createReadStream(mapPath)

			mapReader.on('data', (chunk) => {
				dataBuffer += chunk
			});
	
			mapReader.on('end', async () => {
				resolve(JSON.parse(dataBuffer))
				console.log('[CC] JSON MAP Loaded');
	
			})
			
			mapReader.on('error', async (error) => {
				reject(error)
			})

		})

	}

	private async buildMap(iconType: EMapType, outPath: string): Promise<any> {
		return new Promise(async (resolve, reject) => {
			const mapData = iconType == EMapType.ASSET
			? await this.getIDMap()
			: await this.getIDExchangeMap()

			const mapWriter = createWriteStream(outPath)	
			mapWriter.end(JSON.stringify(mapData))

			await finished(mapWriter, (err) => {
				if(err) {
					console.log('[CC] Error finishing the Map Building', err)
					reject(err)
				}
				resolve(mapData)
			});
			
			console.log('[CC] JSON MAP Loaded!')
		})
	}

	async getAssetIDBySymbol(symbol: string, retrying: boolean = false): Promise<number> {
		const assetItem = this.ccAssetMap.filter((value: IMapAsset) => value.symbol.toLowerCase() == symbol.toLowerCase())
		if(!assetItem.length && !retrying) {
      console.log('[CC] Icon ' + symbol + ' Not found, REBUILDING...')
			this.buildAssetMap()
			return this.getAssetIDBySymbol(symbol, true)
		}
		return assetItem.length ? assetItem[0].id : -1
	}

	async getExchangeIDByName(name: string, retrying: boolean = false): Promise<number> {
		const exchangeItem = this.ccExchangeMap.filter((value: IMapExchange) => value.name.toLowerCase() == name.toLowerCase())
		if(!exchangeItem.length && !retrying) {
      console.log('[CC] Exchange ' + name + ' Not found, REBUILDING...')
			this.buildExchangemap()
      return this.getExchangeIDByName(name, true)
		}
		return exchangeItem.length ? exchangeItem[0].id : -1
	}

  /*
   * CoinMarketCap Service
   * HTTP Requests
   */
  async getIDMap() {
    const mapRequest = this.requestApi(API_ROUTES.CMC_API_MAP)
    const mapData = await firstValueFrom(mapRequest)
    return mapData.data;
  }

  async getIDExchangeMap() {
    const mapRequest = this.requestApi(API_ROUTES.CMC_EXCHANGE_MAP)
    const mapData = await firstValueFrom(mapRequest)
    return mapData.data;
  }

	async getExchanges() {
		return this.ccExchangeMap.map((exchange: IMapExchange) => {
			return {
				id: exchange.id,
				name: exchange.name,
			}
		})
	}


  requestApi(path: string): Observable<AxiosResponse> {
    const url = `${API_ROUTES.CMC_API_URL}${path}`
    return this.httpService.get(url, this.httpConfig)
      .pipe(
        map(response => response.data),
        catchError(error => of(console.log('ERROR:', error.code))
      ))
  }

  async getMarketLatest() {
    // FREE API PLAN

    const apiRequest = this.requestApi(API_ROUTES.CMC_API_ROUTE_LATEST)
    const apiData = await firstValueFrom<ListingLatest>(apiRequest)
    const retData = apiData.data.map((json: ListingAsset) => {
      return {
        id: json.id,
        name: json.name,
        symbol: json.symbol,
        sparklinesImgUrl: sparkLinesUrl.replace('{id}', json.id.toString()),
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
    const url = `${API_ROUTES.CMC_SCRAP_URL}${API_ROUTES.CMC_SCRAP_ROUTE_NEW}`
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
}
