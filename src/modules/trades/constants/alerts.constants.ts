import { EAlerts } from "../interfaces/alerts.interface"

const alertList = [
  {
    name: EAlerts.PRICEABOVE,
    description: 'The price has passed above the target price',
    inputs: [
      {
        title: 'Target Price',
        name: 'targetprice',
        type: 'number',
        value: 'actualPrice'
      }
    ]
  },
  {
    name: EAlerts.PRICEUNDER,
    description: 'The price has passed under the target price',
    inputs: [
      {
        title: 'Target Price',
        name: 'targetprice',
        type: 'number',
        value: 'actualPrice'
      }
    ]
  }
]


export {
  alertList,
}