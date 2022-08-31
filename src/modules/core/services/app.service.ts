import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  Nothing(): string {
    return 'Nothing here :D';
  }
}
