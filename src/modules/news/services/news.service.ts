import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import Parser = require("rss-parser")

import {
  rssFeeds,
  rssTags, 
  noImageUrl
} from '../news.constants';

type mediaItem = {
  mediaTag: string,
  mediaTagRen: string,
  options: object
}

@Injectable()

export class NewsService {

  parser: Parser<mediaItem> = new Parser({
    customFields: {
      item: [
        ['media:content', 'media', { keepArray: true }],
      ]
    }
  });

  constructor (
    private readonly httpService: HttpService
  ) {}

  async getNews() {
    
    const rssResult = [];

    for(const feed of rssFeeds) {
      const rssData = await firstValueFrom(this.httpService.get(feed.url))
      const rssParsed = await this.parser.parseString(rssData.data);
      const rssMap = rssParsed.items.map(rss => {
        
        const imageUrl = (rssTags.imageUrl[0] in rss) 
          ? rss[rssTags.imageUrl[0]][0].$[rssTags.imageUrl[1]]
          : noImageUrl

        return {
          author: rss[rssTags.author],
          title: rss[rssTags.title],
          description: rss[rssTags.description],
          date: rss[rssTags.date],
          imageUrl: imageUrl,
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
