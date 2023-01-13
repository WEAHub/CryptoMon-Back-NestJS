import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUserToken } from '../interfaces/user.interface';

import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, "wsjwt") {
  constructor(
    configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('authorization'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      signOptions: {
         expiresIn: configService.get<string>('JWT_EXPIRY')
      },
    });
  }

  async validate(payload: IUserToken): Promise<IUserToken> {
    try {  
      return {
        userId: payload.userId,
        username: payload.username
      }
    }
    catch(error) {
      throw new WsException('Unauthorized access')
    }
  }
}