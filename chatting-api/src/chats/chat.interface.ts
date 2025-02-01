import { MsgTypeEnum } from './message.model';

export interface CreateChatDto {
  members: string[];
  isGroup: boolean;
  name?: string;
  createdBy: string;
}

export interface SendMessageResponse {
  sender: { _id: string; username: string };
  content: string;
  chatId: string;
  readBy: string[];
  typeOfMsg: MsgTypeEnum;
  fileURL?: string;
  fileSize?: number;
  createdAt: Date;
}

export interface SendMessageDto {
  chatId: string;
  content?: string;
  typeOfMsg: MsgTypeEnum;
  fileURL?: string;
  fileSize?: number;
}