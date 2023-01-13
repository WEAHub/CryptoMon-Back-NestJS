import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AlertFinishedEvent } from '../events/alerts.events';
import { EAlertStatus } from '../interfaces/alerts.interface';
import { TradesService } from '../services/trades.service';

@Injectable()
export class AlertListener {

  constructor(
    private tradesService: TradesService
  ) {

  }

  @OnEvent('alert.finished')
  async handleAlertFinishedEvent(event: AlertFinishedEvent) {
    await this.tradesService.modifyAlert(
      event.user, 
      event.trade,
      EAlertStatus.PENDING
    )
  }
}