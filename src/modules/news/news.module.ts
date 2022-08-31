import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { NewsController } from './controller/news.controller';
import { NewsService } from './services/news.service';

@Module({
  imports: [HttpModule],
  controllers: [NewsController],
  providers: [NewsService]
})

export class NewsModule {}
