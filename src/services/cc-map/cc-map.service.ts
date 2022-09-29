import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { createReadStream, createWriteStream, existsSync, mkdirSync } from 'fs';
import { finished } from 'stream';

import { MarketService } from 'src/modules/market/services/market.service';
import { EMapType, IMapAsset, IMapExchange } from './models/map.interface';
import { dirname, join,  } from 'path';

@Injectable()
export class CCMapService {
  
	private ccAssetMap: IMapAsset[] = []
	private ccExchangeMap: IMapExchange[] = []

	private assetJsonPath = this.configService.get('CC_ASSET_MAP_JSON')
	private assetPath = this.configService.get('CC_ASSET_ICON_FOLDER')

	private exchangeJsonPath = this.configService.get('CC_EXCHANGE_MAP_JSON')
	private exchangePath = this.configService.get('CC_EXCHANGE_ICON_FOLDER')

  constructor(
		private marketService: MarketService,
		private configService: ConfigService
  ) {
		this.preloadMap()
	}

	private async	preloadMap() {
		this.ccAssetMap = await this.loadMap(this.assetPath, this.assetJsonPath, EMapType.ASSET)
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
			? await this.marketService.getIDMap()
			: await this.marketService.getIDExchangeMap()

			const mapWriter = createWriteStream(outPath)	
			mapWriter.end(JSON.stringify(mapData))

			finished(mapWriter, (err) => {
				if(err) {
					console.log('[CC] Error finishing the Map Building', err)
					reject(err)
				}
				resolve(mapData)
			});
			
			console.log('[CC] JSON MAP Loaded!')
		})
	}

	async getAssetIDBySymbol(symbol: string, retrying: boolean = false) {
		const assetItem = this.ccAssetMap.filter((value: IMapAsset) => value.symbol.toLowerCase() == symbol.toLowerCase())
		if(!assetItem.length && !retrying) {
			this.ccAssetMap = await this.buildMap(EMapType.ASSET, this.assetJsonPath)
			this.getAssetIDBySymbol(symbol, true)
		}
		return assetItem.length ? assetItem[0].id : -1
	}

	async getExchangeIDByName(name: string, retrying: boolean = false) {
		const exchangeItem = this.ccExchangeMap.filter((value: IMapExchange) => value.slug.toLowerCase() == name.toLowerCase())
		if(!exchangeItem.length && !retrying) {
			this.ccExchangeMap = await this.buildMap(EMapType.EXCHANGE, this.exchangeJsonPath)
			this.getExchangeIDByName(name, true)
		}
		return exchangeItem.length ? exchangeItem[0].id : -1
	}

	async getExchanges() {
		return this.ccExchangeMap.map((exchange: IMapExchange) => {
			return {
				id: exchange.id,
				name: exchange.name,				
			}
		})
	}

}