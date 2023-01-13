
import { 
  SubscribeMessage, 
  WebSocketGateway, 
  OnGatewayInit, 
  OnGatewayConnection, 
  OnGatewayDisconnect, 
  MessageBody,
  ConnectedSocket,
  WsResponse,
  WebSocketServer,
} from '@nestjs/websockets';

import { Bind, UseGuards } from '@nestjs/common';
import { TradingViewTicker } from '@shared/services/tradingview-ticker/tv-ticker.service';
import { AlertsService } from '../services/alerts/alerts.service';
import { IAsset } from '../interfaces/trades.interface';
import { Socket } from 'socket.io';
import { AuthGuard } from '@nestjs/passport';
import { WsAuthGuard } from '@modules/auth/guards/ws-jwt-auth.guard';
// import { CoinTickerService } from '@modules/shared/services/cryptocompare-ticker/cryptocompare-ticker.service';

@UseGuards(WsAuthGuard)
@WebSocketGateway(3001, { 
  namespace: 'wsTrade', 
  transports: ['websocket'],
  cors: true, 
})
export class TradeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() server: any;

  constructor(
    private readonly tvTicker: TradingViewTicker,
    private readonly alertsService: AlertsService
   // private readonly ccTicker: CoinTickerService,
  ) { }

	afterInit() {
		console.log('[TRADES] SOCKET INIT')
	}

	handleConnection(socket: Socket) {
		console.log('[TRADES] SOCKET CONNECTED')
    // this.ccTicker.connect();

	}

	handleDisconnect() {
		console.log('[TRADES] SOCKET DISCONNECTED')
    // this.ccTicker.unsubscribeAllForced();
    // this.ccTicker.disconnect();
	}

  @Bind(MessageBody(), ConnectedSocket())
	@SubscribeMessage('checkTrades')
  async checkTrades(trades: IAsset[], socket: Socket): Promise<WsResponse<any>> {
    const event = 'updateTrades';
    const user = (socket.handshake as any).user
    
    if(!this.tvTicker.sessionRegistred) return
        
    // ! TRADING VIEW TICKER
    this.tvTicker.queueTickers(trades.map(trade => `${trade.exchange}:${trade.fromSymbol}${trade.toSymbol}`))

    const updatedTradesAsync = trades.map(async (trade) =>  {

      const price = await this.tvTicker.getPrice(`${trade.exchange}:${trade.fromSymbol}${trade.toSymbol}`)

      let updated = {
        ...trade,
        price,
      }

      if(trade.alert !== undefined) {
        const status = this.alertsService.checkAlert(updated, user)

        const alert = {
          ...trade.alert,
          status
        }

        updated = {
          ...updated,
          alert
        }

      }

      return updated

    })

    const updatedTrades = await Promise.all(updatedTradesAsync);
    

    // ! CRYPTOCOMPARE TICKER
    /*   
    this.ccTicker.registerTickers(trades);
    const updatedTrades = trades.map(async (trade) => Object.assign({}, {
      ...trade,
      price: this.ccTicker.getTickerPrice(trade)
    })) 
    */
  
    return { event, data: updatedTrades }

  }
  
}
