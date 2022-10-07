import { Module } from '@nestjs/common';

import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NewsModule } from './news/news.module';
import { MarketModule } from './market/market.module';
import { TradesModule } from './trades/trades.module';
import { IconModule } from './icon/icon.module';
import { SharedModule } from './shared/shared.module';
import { AlertsModule } from './alerts/alerts.module';

@Module({
  imports: [
    SharedModule,
    AuthModule,
    UserModule, 
    NewsModule,
    MarketModule,
    TradesModule,
    IconModule,
    AlertsModule,
  ]
})

export class AppModules {}