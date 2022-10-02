import { Controller, Get, Header, Param, Res, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream, existsSync } from 'fs';
import { getIcoDto } from '../dto/icon.dto';
import { IconService } from '../services/icon.service';
import type { Response } from 'express'
import { EIconType, noImage } from '../constants/icon.constants';
import { CoinMarketCapService } from '@modules/shared/services/coinmarketcap/coinmarketcap.service';

@Controller('icon')
export class IconController {

	private assetFolder = this.configService.get('CC_ASSET_ICON_FOLDER')
	private exchangeFolder = this.configService.get('CC_EXCHANGE_ICON_FOLDER')

	constructor(
		private configService: ConfigService,
    private coinMarketService: CoinMarketCapService,
		private iconService: IconService
	) {}

	@Get('/getIcon/:iconType/:iconName')
  async getIconAsset(@Param() params: getIcoDto, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {

    const iconName = params.iconType === EIconType.ASSET 
    ? params.iconName.replace('DOWN', '').replace('UP', '')
    : params.iconName;

    const iconId = params.iconType === EIconType.ASSET 
    ? await this.coinMarketService.getAssetIDBySymbol(iconName)
    : await this.coinMarketService.getExchangeIDByName(iconName)

		const localPath = iconId === -1
    ? noImage
    : (params.iconType === EIconType.ASSET 
			? this.assetFolder
			: this.exchangeFolder
    )	+ `${iconId}.png`

		if(iconId && !existsSync(localPath)) {
			await	this.iconService.downloadIcon(params.iconType, iconId, localPath)
		}

		res.set({
			'Content-Type': 'image/png'
		})

		const iconFile = createReadStream(localPath)
		return new StreamableFile(iconFile)
	}

}
