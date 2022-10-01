  
const API_ROUTES = {
  CMC_API_URL: 'https://pro-api.coinmarketcap.com',
  CMC_API_ROUTE_LATEST: '/v1/cryptocurrency/listings/latest',
  CMC_API_MAP: '/v1/cryptocurrency/map',
  CMC_EXCHANGE_MAP: '/v1/exchange/map',

  CMC_SCRAP_URL: 'https://coinmarketcap.com',
  CMC_SCRAP_ROUTE_NEW: '/new'
}

const sparkLinesUrl = 'https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/{id}.svg'
const assetIconUrl = 'https://s2.coinmarketcap.com/static/img/coins/64x64/{id}.png'

export {
  assetIconUrl,
  sparkLinesUrl,
  API_ROUTES
}