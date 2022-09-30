const CC_API_HOST = 'https://min-api.cryptocompare.com'

const CC_API_ROUTES = {
	ALL_EXCHANGES: `${CC_API_HOST}/data/exchanges/general`,
	ALL_PAIRS_BY_EXCHANGE: `${CC_API_HOST}/data/v2/pair/mapping/exchange?e=`,
	PRICE_BY_EXCHANGE_TS: `${CC_API_HOST}/data/v2/histohour?`
}

export {
	CC_API_HOST,
	CC_API_ROUTES
}