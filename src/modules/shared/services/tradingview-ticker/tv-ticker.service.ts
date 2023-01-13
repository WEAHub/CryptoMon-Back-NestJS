import { Injectable } from "@nestjs/common";
import WebSocket from "ws";
import * as IO from "./utils/IOProtocol";

type TMessageBuffer = Buffer | ArrayBuffer | Buffer[];

enum PacketTypes {
  KEEPALIVE = '~protocol~keepalive~'
}

interface ITicker {
  name: string;
  price: number;
}

@Injectable()
export class TradingViewTicker {

  private wsUrl = 'wss://data.tradingview.com/socket.io/websocket'
  private wsHeader = { origin: 'https://data.tradingview.com' }
  private ws!: WebSocket;

  private session: string;
  public sessionRegistred: boolean = false

  private tickers: Array<ITicker> = []

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    this.sessionRegistred = false
    this.session = IO.generateSession()
    this.ws = new WebSocket(this.wsUrl, this.wsHeader)
    this.ws.on('message', this.processMessage.bind(this))
    this.ws.on('open', this.onConnect.bind(this))    
    this.ws.on('disconnect', this.onDisconnect.bind(this))
  }

  private processMessage(dataReceived: TMessageBuffer, isBinary: boolean) {
    const packets = IO.parseMessages(dataReceived.toString())

    packets.forEach((packet) => {
      if(packet[PacketTypes.KEEPALIVE]) {
        const response = `~h~${packet[PacketTypes.KEEPALIVE]}`
        this.sendRawMessage(response)
      }
      else if (packet.session_id) {

        this.sendMessage("set_auth_token", ["unauthorized_user_token"]);
        this.sendMessage("quote_create_session", [this.session]);
        this.sendMessage("quote_set_fields", [this.session, "lp"])

        this.sessionRegistred = true
        this.log('Session registred success with id: ' + this.session)

      }
      else if(
        packet.m
        && packet.p[0] === this.session
      ) {
        
        const packetType = packet.m
        
        if(packetType === 'qsd') {
          
          const ticker = {
            name: packet.p[1].n,
            status: packet.p[1].s,
            update: packet.p[1].v
          }
  
          if(ticker.status === 'error') {
            this.log('ERROR: Bad ticker name => ' +  ticker.name)
            this.tickerError(ticker.name)
          }
          else {
            const lastPrice = ticker.update.lp
            this.log(ticker.name + ' => ' + lastPrice)

            this.updateTicker({
              name: ticker.name,
              price: lastPrice
            })

          }

        }
        else if (packetType === 'quote_completed') {
          const tickerRegistered = packet.p[1]
          this.log('Ticker registered success => ' + tickerRegistered)
        }

      }
    
    })

  }

  private getTicker(tickerName: string): ITicker | Boolean {
    const tickerId = this.getTickerId(tickerName)
    return tickerId !== -1 ? this.tickers[tickerId] : false
  }

  private getTickerId(tickerName: string): any {
    return this.tickers.findIndex(t => t.name == tickerName)
  }

  private registerTicker(ticker: string) {
    this.sendMessage('quote_add_symbols', [
      this.session,
      ticker,
      { flags: ["force_permission"] }
    ])
  }

  private unregisterTicker(ticker: string) {
    this.sendMessage('quote_remove_symbols', [
      this.session,
      ticker
    ])
  }

  private addTicker(ticker: string) {
    if(this.getTickerId(ticker) !== -1) return
    
    this.tickers.push(<ITicker>{
      name: ticker,
      price: -1,
    })

    this.registerTicker(ticker)

  }

  private removeTicker(ticker: string) {
    const tickerId = this.getTickerId(ticker)
    
    if(tickerId !== -1) {
      this.unregisterTicker(ticker)
      this.tickers.splice(tickerId, 1)
    }
  }

  private tickerError(ticker: string) {
    const tickerId = this.getTickerId(ticker)
    this.tickers[tickerId].price = -1
  }

  private updateTicker(ticker: ITicker) {
    const tickerId = this.getTickerId(ticker.name)
    this.tickers[tickerId].price = ticker.price
  }

  private sendRawMessage(message: string) {
    this.send(IO.prependHeader(message));
  }

  private sendMessage(func: string, args: IO.MessageArguments) {
    this.send(IO.createMessage(func, args));
  }

  private send(data: any) {
    if(this.ws.readyState === 1) {
      this.ws.send(data)
    }
    else {
      setTimeout(() => this.send(data), 1000)
    }
  }

  private onConnect() {
    this.log('Connected')
    if(this.tickers.length) {
      this.queueTickers(this.tickers.map(t => t.name))
    }
  }

  private onDisconnect() {
    this.log('Disconnected')
    this.sessionRegistred = false
    this.initializeSocket();
  }

  private log(text: string) {
    //console.log(`[TVS] ${text}`)
  }

  getPrice(tickerName: string) {
    const ticker = this.getTicker(tickerName)
    return ticker && this.sessionRegistred
    ? (ticker as ITicker).price
    : -1
  }

  queueTickers(tickers: string[]) {
    
    if(this.ws.readyState !== 1) {
      this.initializeSocket()
    }

    // Register new tickers
    tickers.filter(ticker => this.getTickerId(ticker) === -1)
      .forEach(ticker => this.addTicker(ticker))
    
    // Unregister tickets that are not in trades anymore
    this.tickers.filter(ticker => !tickers.includes(ticker.name))
      .forEach(ticker => this.removeTicker(ticker.name))

    //this.log('[TVS] TICKERS QUEUE => ', this.tickers, 'State', this.ws.readyState)
  }

}