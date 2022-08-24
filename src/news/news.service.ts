import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import Parser = require("rss-parser")

type mediaItem = {
	mediaTag: string,
	mediaTagRen: string,
	options: object
}

@Injectable()

export class NewsService {
	
	rssFeeds = [
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

	tags = {
		author: 'creator',
		title: 'title',
		description: 'contentSnippet',
		date: 'pubDate',
		link: 'link',
		imageUrl: ['media', 'url']
	}

	parser: Parser<mediaItem> = new Parser({
		customFields: {
			item: [
				['media:content', 'media', { keepArray: true }],
			]
		}
	});

	constructor (
		private readonly httpService: HttpService) {}

	async getNews() {
		
		const rssResult = [];

		for(const feed of this.rssFeeds) {
			const rssData = await firstValueFrom(this.httpService.get(feed.url))			
			const rssParsed = await this.parser.parseString(rssData.data);
			const rssMap = rssParsed.items.map(rss => {
				return {
					author: rss[this.tags.author],
					title: rss[this.tags.title],
					description: rss[this.tags.description],
					date: rss[this.tags.date],
					imageUrl: rss[this.tags.imageUrl[0]][0].$[this.tags.imageUrl[1]],
					link: rss.link
				}
			})

			rssResult.push({
				name: feed.name,
				web: feed.url,
				logo: feed.logo,
				feed: rssMap
			})
			
		}

		return rssResult;
		
	}
}
