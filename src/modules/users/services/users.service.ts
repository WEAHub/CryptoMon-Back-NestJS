import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/users.model';

@Injectable()
export class UsersService {
  
  constructor(
    @InjectModel('user') private readonly userModel: Model<UserDocument>
  ) { }
  
  async createUser(username: string, password: string, name: string): Promise<any> {
    const userExists = await this.userModel.findOne({ username });

    if(userExists) {
      throw new NotAcceptableException('This user already exists');
    }

    const user = this.userModel.create({
      name,
      username,
      password,
    });

    return user;
  }
  
  async getUser(query: Object): Promise<User> {
    return this.userModel.findOne(query);
  }

  async modifyUser(username: string, data: Object) {
    const update = await this.userModel.updateOne({ username }, data)
    return {
      found: update.matchedCount,
      updated: update.modifiedCount
    }
  }

}