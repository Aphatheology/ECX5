import { MsgTypeEnum } from './message';
import { IUser } from './user';

export interface IChat {
  _id: string;
  members: IUser[];
  isGroup: boolean;
  name: string;
  lastMessage?: string;
  lastMessageType?: MsgTypeEnum;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
