
import { 
  SubscribeMessage, 
  WebSocketGateway, 
  OnGatewayInit, 
  OnGatewayConnection, 
  OnGatewayDisconnect, 
  MessageBody, 
  WebSocketServer, 
  ConnectedSocket,
  WsResponse
} from '@nestjs/websockets';

import { ITrade } from '@modules/shared/services/cointicker/interfaces/assets.interface';
import { TVTicker } from '@modules/shared/services/tv-ticker/tv-ticker.service';
import { Bind } from '@nestjs/common';

@WebSocketGateway(3001, { namespace: 'wsTrade' })
export class TradeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private readonly tvTicker: TVTicker
  ) { }

	afterInit(server: WebSocket) {
		console.log('TRADES SOCKET INIT')
	}

	handleConnection(server: WebSocket) {
		console.log('TRADES SOCKET CONNECTED')
	}

	handleDisconnect(server: WebSocket) {
		console.log('TRADES SOCKET DISCONNECTED')
	}
  
  @Bind(MessageBody(), ConnectedSocket())
	@SubscribeMessage('checkTrades')
  async checkTrades(trades: ITrade[], client): Promise<WsResponse<any>> {
    const event = 'updateTrades';

    const updatedTradesAsync = trades.map(async (trade) => Object.assign({}, {
      ...trade,
      price: await this.tvTicker.getPrice(`${trade.exchange}:${trade.fromSymbol}${trade.toSymbol}`)
    }))

    const updatedTrades = await Promise.all(updatedTradesAsync);

    return { event, data: updatedTrades }

  }
  
}
