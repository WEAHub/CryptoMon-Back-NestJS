import { Injectable } from "@nestjs/common";
import { TradingViewAPI } from 'tradingview-scraper'


@Injectable()
export class TVTicker {

  tvSocket = new TradingViewAPI()

  constructor() {

  }

  async getPrice(asset: string) {
    const tvData = await this.tvSocket.getTicker(asset);
    return tvData.lp;
  }


}