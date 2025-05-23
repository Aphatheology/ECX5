import mongoose, { Schema } from 'mongoose';
import { MsgTypeEnum } from './message.model';

export interface IChat extends Document {
  members: (string | { _id: string; username: string })[];
  isGroup: boolean;
  name: string;
  lastMessage?: string;
  lastMessageType?: MsgTypeEnum;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema: Schema = new Schema(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isGroup: { type: Boolean, default: false },
    name: { type: String },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    lastMessageType: { type: String, enum: MsgTypeEnum },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Chat = mongoose.model<IChat>("Chat", ChatSchema);
export default Chat;
