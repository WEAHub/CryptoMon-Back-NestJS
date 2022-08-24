import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import Parser = require("rss-parser")

import {rssFeeds, tags} from './news.constants';

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
    private readonly httpService: HttpService) {}

  async getNews() {
    
    const rssResult = [];

    for(const feed of rssFeeds) {
      const rssData = await firstValueFrom(this.httpService.get(feed.url))			
      const rssParsed = await this.parser.parseString(rssData.data);
      const rssMap = rssParsed.items.map(rss => {
        return {
          author: rss[tags.author],
          title: rss[tags.title],
          description: rss[tags.description],
          date: rss[tags.date],
          imageUrl: rss[tags.imageUrl[0]][0].$[tags.imageUrl[1]],
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