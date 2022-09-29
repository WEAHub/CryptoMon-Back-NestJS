import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { IconController } from './controller/icon.controller';
import { IconService } from './services/icon.service';

@Module({
  imports: [
    HttpModule
  ],
  controllers: [IconController],
  providers: [IconService]
})
export class IconModule {}
