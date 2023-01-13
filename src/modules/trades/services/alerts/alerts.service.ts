
import { IUserToken } from "@modules/auth/interfaces/user.interface";
import { AlertFinishedEvent } from "@modules/trades/events/alerts.events";
import { EAlertStatus, ITradeAlert } from "@modules/trades/interfaces/alerts.interface";
import { IAsset } from "@modules/trades/interfaces/trades.interface";
import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import * as availableAlerts from "./alerts-strategies/index"

interface IAlertClass {
  alertName: string;
  requiredParameters: string[];
  run: Function;
}

@Injectable()
export class AlertsService {
  
  alerts: IAlertClass[] = []

  constructor(
    private eventEmitter: EventEmitter2
  ) {
    this.loadAlerts()
  }

  private async loadAlerts() {
    this.alerts = Object.values(availableAlerts)
    .map(alertClass => new alertClass)
  }

  checkAlert(trade: IAsset, user: IUserToken) {
    
    const alertName = trade.alert.alertType
    const alertStatus = trade.alert.status

    if(alertStatus === EAlertStatus.PENDING 
    || alertStatus === EAlertStatus.FINISHED) return

    const alertInstance = this.alerts.find(alert => alert.alertName == alertName)

    if(alertInstance === undefined) return 

    const alertResult = alertInstance.run(trade)

    if(alertResult === EAlertStatus.PENDING) {

      const alertFinished = new AlertFinishedEvent({
        trade,
        user
      });
      
      this.eventEmitter.emit('alert.finished', alertFinished)
    }

    return alertResult
  }

  checkAlertParameters(alert: ITradeAlert) {

  }

}