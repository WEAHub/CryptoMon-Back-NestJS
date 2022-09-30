import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  name: string;
}


export const UserSchema = SchemaFactory.createForClass(User);