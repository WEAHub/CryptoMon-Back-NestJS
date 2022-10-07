import { IUserToken } from '@modules/auth/interfaces/user.interface';
import { Injectable } from '@nestjs/common';
import { EAlertCondition } from '../interfaces/alerts.interface';

@Injectable()
export class AlertsService {
 
  constructor(

  ) { }

  getAlerts(user: IUserToken) {

    const mockedAlerts = [
      {
        tradeId: '6339b1ddf4b0054d4968e2da',
        exchange: 'Bitstamp',
        fromSymbol: 'COMP',
        toSymbol: 'EUR',
        condition: EAlertCondition.PRICEABOVE
      }
    ]

    return mockedAlerts
  }

}
