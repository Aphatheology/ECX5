import { IUser } from './user';

export enum MsgTypeEnum {
	TEXT = 'text',
	IMG = 'img',
	OTHERS = 'others'
}

export interface IMessage {
  _id: string;
  sender: IUser;
  content: string;
  chatId: string;
  readBy: string[];
  typeOfMsg: MsgTypeEnum;
  fileURL?: string;
  fileSize?: number;
  createdAt: Date;
}
