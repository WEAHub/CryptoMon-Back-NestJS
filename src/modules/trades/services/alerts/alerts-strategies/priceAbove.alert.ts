import { EAlertStatus } from "@modules/trades/interfaces/alerts.interface";
import { IAsset } from "@modules/trades/interfaces/trades.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AlertPriceAbove {

  alertName = 'PRICEABOVE'

  requiredParameters = [
    'targetPrice',
    'actualPrice'
  ]

  constructor() {

  }

  run(trade: IAsset) {
    const targetPrice = Number(trade.alert.data.find(input => input.name == 'targetprice').value)
    const actualPrice = trade.price
    
    if(actualPrice > targetPrice) {
      return EAlertStatus.PENDING
    }
    
    return actualPrice < targetPrice
    ? EAlertStatus.PENDING
    : EAlertStatus.RUNNING
  }
}