import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NewsModule } from './news/news.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/cryptomon'), 
    UserModule, 
    AuthModule,
    NewsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
