
const rssFeeds = [
	{
		name: 'Coin Telegraph',
		url: 'https://cointelegraph.com/rss',
		logo: 'https://www.veritic.com/static/media/cointelegraph.e009399f.png',
	},
	{
		name: 'CoinDesk',
		url: 'https://www.coindesk.com/arc/outboundfeeds/rss/?outputType=xml',
		logo: 'https://thecryptocurrencypost.net/wp-content/uploads/2018/11/ibm-the-blockchain-can-be-useful-to-open-scientific-research.png',
	},
	{
		name: 'Crypto Potato',
		url: 'https://cryptopotato.com/feed/',
		logo: 'https://cryptopotato.com/wp-content/uploads/2022/06/cplogo3.png'
	}
]

const noImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'

const rssTags = {
	author: 'creator',
	title: 'title',
	description: 'contentSnippet',
	date: 'pubDate',
	link: 'link',
	imageUrl: ['media', 'url']
}

export {
	rssFeeds,
	rssTags,
	noImageUrl
}
