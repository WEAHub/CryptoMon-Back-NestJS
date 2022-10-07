interface IAlert {
  tradeId: string;
  condition: EAlertCondition,
}

enum EAlertCondition {
  PRICEABOVE = 0,
  PRICEUNDER = 1,
  PRICECHANGEDOWN = 2,
  PRICECHANGEUP = 3
}

export {
  IAlert,
  EAlertCondition
}