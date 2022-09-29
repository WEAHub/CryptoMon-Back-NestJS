import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { createWriteStream, readFile, readFileSync, writeFileSync } from 'fs';
import { firstValueFrom, map } from 'rxjs';
import { assetUrl, EIconType, exchangeUrl } from '../constants/icon.constants';

@Injectable()
export class IconService {

  constructor(
    private httpService: HttpService,
  ) {}

  async downloadIcon(iconType: EIconType, iconId: Number, localPath: string) {		
    
    const logoUrl = iconType == EIconType.ASSET 
    ? assetUrl.replace('{id}', iconId.toString())
    : exchangeUrl.replace('{id}', iconId.toString())

    const logoWriter = createWriteStream(localPath);

    const response: AxiosResponse<any> = await this.httpService.axiosRef({
        url: logoUrl,
        method: 'GET',
        responseType: 'stream',
    });

    response.data.pipe(logoWriter);

    return new Promise((resolve, reject) => {
      logoWriter.on('finish', resolve);
      logoWriter.on('error', reject);
    });
      
  }

}
