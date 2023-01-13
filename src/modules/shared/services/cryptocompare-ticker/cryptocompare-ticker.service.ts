import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebSocket } from 'ws'
import * as CCIO from './interfaces/cc-socket-api.interface'
import { capitalize } from '@modules/shared/utils/capitalize.func';

interface IAsset {
  exchange: string;
  fromSymbol: string;
  toSymbol: string;  
  id?: string;
  price?: number;
}

@Injectable()
export class CoinTickerService {

  private ws_host = "wss://streamer.cryptocompare.com/v2"
  private ws_key = this.configService.get<string>('CC_API_KEY')
  private ws_url = `${this.ws_host}?api_key=${this.ws_key}`

  private tickers: IAsset[] = []

  private ws: WebSocket = new WebSocket(this.ws_url)

  constructor(
    private readonly configService: ConfigService
  ) {
    //this.connect();
  }
  

  public connect() {
    console.log('[CC] SOCKET CONNECTING')
    this.ws = new WebSocket(this.ws_url)
    this.ws.on('message', this.parseMessage.bind(this))
    this.ws.on('disconnect', this.onDisconnect.bind(this))
    this.ws.on('open', this.onConnect.bind(this))
  }

  public disconnect() {
    console.log('[CC] SOCKET DISCONNECTING')
    this.ws.close()
  }

  private onConnect() {
    console.log('[CC] SOCKET CONNECTED', this.ws.readyState)
  }

  private onDisconnect() {
    console.log('[CC] SOCKET DISCONNECTED')
  }

  private send(data: any) {
    this.waitForSocketConnection(this.ws, () => this.ws.send(data))
  }


  private waitForSocketConnection(ws: WebSocket, callback: CCIO.ICallback, timeout: number = 5) {
    console.log('[CC] Waiting socket...', ws.readyState)
    setTimeout(
      () => {
        if(typeof ws === "undefined" || ws.readyState !== ws.OPEN) {
          if(ws.readyState == ws.CLOSED) {
            return
          }
          this.waitForSocketConnection(ws, callback, 2000);
        }
        else {
          console.log('[CC] SOCKET SENDING ' + ws.readyState)
          callback();
        }

      }, timeout
    );
  }


  private parseMessage(dataReceived: Buffer | ArrayBuffer | Buffer[], isBinary: boolean) { 
    
    const messageData: CCIO.ICommonStructure = JSON.parse(dataReceived.toString());

    const processMessage = {
      
      [CCIO.EMessageTypes.HEARTBEAT]: () => {
        //console.log('[CC] Ping'),
      },
      
      [CCIO.EMessageTypes.STREAMERWELCOME]: () => {
        //console.log('[CC] Welcome')
      },


      [CCIO.EMessageTypes.UNSUBSCRIBEALLCOMPLETE]: () => {
        //console.log('[CC] Unsubscribed complete')
      },
      
      [CCIO.EMessageTypes.LOADCOMPLETE]: () => {
        //console.log('[CC] Load complete')
      },

      [CCIO.EMessageTypes.ERROR]: (data: CCIO.IMessageError) => {
        //console.log('[CC] ERROR', data.MESSAGE)
      },

      [CCIO.EMessageTypes.SUBSCRIBECOMPLETE]: (data: CCIO.ISubComplete) => {
        const [ code, exchange, fromSymbol, toSymbol ] = data.SUB.split('~')
        console.log(`[CC] Successfully subscribed to ticker ${exchange}:${fromSymbol}${toSymbol}`)
      },

      [CCIO.EMessageTypes.SUBMESSAGE]: (data: CCIO.ISubMessage ) => {
        const subData: CCIO.ISubMessage = data

        if(subData.PRICE === undefined) return

        const subAsset = {
          exchange: subData.MARKET,
          fromSymbol: subData.FROMSYMBOL,
          toSymbol: subData.TOSYMBOL,
          price: subData.PRICE
        }

        this.updateTicker(subAsset)

      },

      [CCIO.EMessageTypes.MAXSOCKETS]: () => {
        console.log('[CC] MAX SOCKETS CONNECTED')
        this.tickers = [];
        this.ws.close();
      },
      
      'DEFAULT': (data: CCIO.ICommonStructure) => {
        console.log(data)
      }
      
    }

    const processFunction = processMessage[messageData.TYPE] || processMessage['DEFAULT']
    processFunction(messageData);

  }


  subscribeAssets(assets: IAsset[]) {
    if(!assets.length) return

    const newTickers = assets.filter(asset => 
      this.tickers.findIndex(t => t.id === asset.id) === -1
    )
    
    if(!newTickers.length) return

    console.log('[CC] Subscribing', newTickers.map(t => t.fromSymbol + t.toSymbol))
    const subRequestData = JSON.stringify({
      'action': 'SubAdd',
      'subs': this.formatSubscription(newTickers)
    })

    this.tickers.push(...newTickers)

    this.send(subRequestData)
  }

  unsubscribeAssets(assets: IAsset[]) {


    const deletedTickers = this.tickers.filter(
      ticker => assets.findIndex(a => a.id === ticker.id) === -1
    )

    if(!deletedTickers.length) return

    deletedTickers.forEach(dTicker => 
      this.tickers.splice(this.getTickerId(dTicker), 1)
    )

    console.log('[CC] Unsubscribing', deletedTickers.map(t => t.fromSymbol + t.toSymbol))

    const unSubRequestData = JSON.stringify({
      'action': 'SubRemove',
      'subs': this.formatSubscription(deletedTickers)
    }) 

    this.send(unSubRequestData)
    
  }

  private formatSubscription(assets: IAsset[]) {
    return assets.map((asset: IAsset) => 
      `2~${capitalize(asset.exchange)}~${asset.fromSymbol.toUpperCase()}~${asset.toSymbol.toUpperCase()}`
    )
  }

  private getTickerId(asset: IAsset): number {
    return this.tickers.findIndex(ticker => 
      ticker.exchange == asset.exchange
      && ticker.fromSymbol == asset.fromSymbol
      && ticker.toSymbol == asset.toSymbol
    )
  }

  updateTicker(asset: IAsset): void {
    const tickerId = this.getTickerId(asset);
    if(tickerId === -1) return 
    this.tickers[tickerId].price = asset.price
  }

  getTickerPrice(asset: IAsset): number {
    const tickerId = this.getTickerId(asset)
    const price = this.tickers[tickerId].price ?? -1
    return price
  }

  async registerTickers(assets: IAsset[]) {
    this.unsubscribeAssets(assets);
    this.subscribeAssets(assets);
  }

  unsubscribeAllForced() {
    this.unsubscribeAssets([])
  }

}