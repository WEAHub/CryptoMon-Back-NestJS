import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebSocket } from 'ws'
import { IAsset, ISubAsset } from './interfaces/assets.interface';
import * as CCIO from './interfaces/cc-socket-api.interface'
import { capitalize } from '@modules/shared/utils/capitalize.func';

@Injectable()
export class CoinTickerService {

  private ws_host = "wss://streamer.cryptocompare.com/v2"
  private ws_key = this.configService.get<string>('CC_API_KEY')
  private ws_url = `${this.ws_host}?api_key=${this.ws_key}`

  private assets: IAsset[] = []
  private subscribedAssets: ISubAsset[] = []

  private ws!: WebSocket;
  
  constructor(
    private readonly configService: ConfigService
  ) {  
    /* this.ws = new WebSocket(this.ws_url)
    this.ws.on( 'message', this.parseMessage.bind(this))*/
  }
  

  private parseMessage(dataReceived: Buffer | ArrayBuffer | Buffer[], isBinary: boolean) { 
    
    const messageData: CCIO.ICommonStructure = JSON.parse(dataReceived.toString());

    const processMessage = {
      
      [CCIO.EMessageTypes.HEARTBEAT]: () => console.log('[CC] Ping'),
      
      [CCIO.EMessageTypes.STREAMERWELCOME]: () => {
        console.log('[CC] Welcome')
      },

      [CCIO.EMessageTypes.SUBSCRIBECOMPLETE]: (data: CCIO.ISubComplete) => {
        const [ code, exchange, fromSymbol, toSymbol ] = data.SUB.split('~')

        this.subscribedAssets.push({
          exchange,
          fromSymbol,
          toSymbol,
          price: 0,
        });

        console.log(`[CC] Successfully subscribed to ticker ${exchange}:${fromSymbol}${toSymbol}`)
      },

      [CCIO.EMessageTypes.UNSUBSCRIBEALLCOMPLETE]: () => {
        this.subscribedAssets = [];
      },
      
      [CCIO.EMessageTypes.LOADCOMPLETE]: () => {
        console.log('[CC] Load complete')
      },

      [CCIO.EMessageTypes.ERROR]: (data: CCIO.IMessageError) => {
        console.log('[CC] ERROR', data.MESSAGE)
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

        this.updateAsset(subAsset);

        console.log('[CC]', subAsset)
      },

      'DEFAULT': (data: CCIO.ICommonStructure) => {
        console.log(data)
      }
      
    }

    const processFunction = processMessage[messageData.TYPE] || processMessage['DEFAULT']
    processFunction(messageData);

  }

  private updateAsset(subAsset: ISubAsset) {

    const assetIdx = this.getSubIdx(subAsset)

    if(assetIdx !== -1) {
      this.subscribedAssets[assetIdx].price = subAsset.price
    }

  }

  private subscribeAssets() {

    if(!this.assets.length) return

    const subRequestData = JSON.stringify({
      'action': 'SubAdd',
      'subs': this.formatSubscription(this.assets)
    }) 

    this.ws.send(subRequestData)
  }

  unsubscribeAssets() {

    if(!this.assets.length) return

    console.log('[CC] Unsubscribing', this.assets)
    const unSubRequestData = JSON.stringify({
      'action': 'SubRemove',
      'subs': this.formatSubscription(this.assets)
    }) 

    this.ws.send(unSubRequestData)
    
    this.subscribedAssets = [];
    this.assets = []
  }

  private formatSubscription(assets: IAsset[]) {
    return this.assets.map((asset: IAsset) => 
      `2~${capitalize(asset.exchange)}~${asset.fromSymbol.toUpperCase()}~${asset.toSymbol.toUpperCase()}`
    )
  }

  queueAsset(asset: IAsset) {
    if(this.checkAssetQueue(asset)) return
    this.assets.push(asset)
    this.subscribeAssets()
  }

  private getAssetIdx(asset: IAsset) {
    return this.assets.findIndex((v: IAsset) =>
      v.exchange == asset.exchange
      && v.fromSymbol == asset.fromSymbol
      && v.toSymbol == asset.toSymbol
    )
  }

  private getSubIdx(asset: IAsset) {
    return this.subscribedAssets.findIndex((v: IAsset) =>
      v.exchange == asset.exchange
      && v.fromSymbol == asset.fromSymbol
      && v.toSymbol == asset.toSymbol
    )
  }

  private checkAssetQueue(asset: IAsset) {
   return this.getAssetIdx(asset) !== -1
  }
  
  private checkSubQueue(asset: IAsset) {
    return this.getSubIdx(asset) !== -1
  }

  getPrice(asset: IAsset) {
    
    const idxAsset = this.getAssetIdx(asset)
    
    return idxAsset !== -1
    ? this.subscribedAssets[idxAsset]?.price!
    : 0

  }

}