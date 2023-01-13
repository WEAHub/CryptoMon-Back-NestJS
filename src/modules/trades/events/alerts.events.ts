import { IUserToken } from "@modules/auth/interfaces/user.interface";
import { IAsset } from "../interfaces/trades.interface";

interface IAlertFinished {
  trade: IAsset;
  user: IUserToken;
}

export class AlertFinishedEvent {
  trade: IAsset;
  user: IUserToken;

  constructor(data : IAlertFinished) {
    this.trade = data.trade
    this.user = data.user
  }
}