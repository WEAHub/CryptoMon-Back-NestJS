import { Controller, Get, Header, Param, Res, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream, existsSync } from 'fs';
import { getIcoDto } from '../dto/icon.dto';
import { IconService } from '../services/icon.service';
import type { Response } from 'express'
import { EIconType } from '../constants/icon.constants';

@Controller('icon')
export class IconController {

	private assetFolder = this.configService.get('CC_ASSET_ICON_FOLDER')
	private exchangeFolder = this.configService.get('CC_EXCHANGE_ICON_FOLDER')

	constructor(
		private configService: ConfigService,
		private iconService: IconService
	) {}

	@Get('/getIcon/:iconType/:iconId')
  async getIconAsset(@Param() params: getIcoDto, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {

		const localPath = ( params.iconType === EIconType.ASSET 
			? this.assetFolder
			: this.exchangeFolder
		)	+ `${params.iconId.toString()}.png`

		if(!existsSync(localPath)) {
			await	this.iconService.downloadIcon(params.iconType, params.iconId, localPath)
		}

		res.set({
			'Content-Type': 'image/png'
		})

		const iconFile = createReadStream(localPath)
		return new StreamableFile(iconFile)
	}

}
