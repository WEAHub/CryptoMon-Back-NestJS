import { Controller, Get, UseGuards } from '@nestjs/common';
import { NewsService } from './../services/news.service'
import { AuthGuard } from '@nestjs/passport';

@Controller('news')
export class NewsController {
  
  constructor(private newsService: NewsService) {}
  
  @UseGuards(AuthGuard('jwt'))
  @Get('/getNews')
  async getNews() {
    return this.newsService.getNews();
  }

}

