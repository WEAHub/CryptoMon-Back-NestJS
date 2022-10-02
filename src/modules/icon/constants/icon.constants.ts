const assetUrl = 'https://s2.coinmarketcap.com/static/img/coins/64x64/{id}.png';
const exchangeUrl = 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/{id}.png'
const noImage = 'src/static/images/no-image.png';

enum EIconType {
	EXCHANGE = 'exchange',
	ASSET = 'asset'
}

export {
	assetUrl,
	exchangeUrl,
  noImage,
	EIconType
}