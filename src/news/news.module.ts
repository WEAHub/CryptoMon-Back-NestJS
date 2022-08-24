import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { NewsController } from './news.controller';
import { NewsService } from './news.service';

import { JwtAuthGuard } from './../auth/jwt-auth.guard';

@Module({
  imports: [HttpModule],
  controllers: [NewsController],
  providers: [NewsService, JwtAuthGuard]
})

export class NewsModule {}
