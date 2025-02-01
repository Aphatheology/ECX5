import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  sender: string;
  content: string;
  chatId: string;
  readBy: string[];
  typeOfMsg: MsgTypeEnum;
  fileURL?: string;
  fileSize?: number;
  createdAt: Date;
}

export enum MsgTypeEnum {
	TEXT = 'text',
	IMG = 'img',
	OTHERS = 'others'
}

const MessageSchema: Schema = new Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    typeOfMsg: { type: String, enum: MsgTypeEnum, required: true },
    fileURL: { type: String },
    fileSize: { type: Number }
  },
  { timestamps: true }
);

const Message = mongoose.model<IMessage>("Message", MessageSchema);
export default Message;
