import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.model';

@Injectable()
export class UsersService {
	constructor(@InjectModel('user') private readonly userModel: Model<UserDocument>) { }
	async createUser(username: string, password: string, name: string): Promise<User> {

		const userExists = await this.userModel.findOne({ username });

		if(userExists) {;
			throw new NotAcceptableException('this user already exists');
		}

		return this.userModel.create({
			name,
			username,
			password,
		});
	}
	
	async getUser(query: object ): Promise<User> {
		return this.userModel.findOne(query);
	}
}