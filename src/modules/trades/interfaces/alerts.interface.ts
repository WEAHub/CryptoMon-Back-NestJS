enum EAlerts {
  PRICEUNDER = 'PRICEUNDER',
  PRICEABOVE = 'PRICEABOVE'
}

enum EAlertStatus {
  RUNNING = 'RUNNING',
  PENDING = 'PENDING',
  FINISHED = 'FINISHED',
}

interface IAlertInput {
  name: string;
  value: string;
}

interface ITradeAlert {
  alertType: string;
  data: IAlertInput[];
  _id: string;
  status?: EAlertStatus;
}

export {
  EAlerts,
  EAlertStatus,
  ITradeAlert,
  IAlertInput
}