import { EAlertStatus } from "@modules/trades/interfaces/alerts.interface";
import { IAsset } from "@modules/trades/interfaces/trades.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AlertPriceUnder {

  alertName = 'PRICEUNDER'

  requiredParameters = [
    'targetprice',
    'actualprice'
  ]

  constructor() {

  }

  run(trade: IAsset): EAlertStatus {
    const targetPrice = Number(trade.alert.data.find(input => input.name == 'targetprice').value)
    const actualPrice = trade.price
    
    if(actualPrice < targetPrice) {
      return EAlertStatus.PENDING
    }
    
    return actualPrice < targetPrice
    ? EAlertStatus.PENDING
    : EAlertStatus.RUNNING
  }

}