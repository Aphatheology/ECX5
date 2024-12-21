import { Document } from 'mongoose';
import { IUser } from 'users/user.model';

export interface IUrl extends Document {
  shortUrl: string;
  longUrl: string;
  clicks: number;
  createdBy: IUser;
}

export type UpdateUrlBody = Partial<IUrl>;