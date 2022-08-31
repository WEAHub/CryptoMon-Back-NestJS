import { Module } from '@nestjs/common';

import { AppController } from './controller/app.controller';
import { AppService } from './services/app.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { NewsModule } from '../news/news.module';
import { MarketModule } from '../market/market.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/.env/.dev.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI')
      })
    }), 
    AuthModule,
    UserModule, 
    NewsModule,
    MarketModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {

  constructor(private config: ConfigService) {
    console.log(config.get<string>('MONGODB_URI'))
  }

}
