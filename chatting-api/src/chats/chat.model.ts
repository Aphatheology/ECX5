import mongoose, { Schema } from 'mongoose';

export interface IChat extends Document {
  members: string[];
  isGroup: boolean;
  name?: string;
  lastMessage?: string;
  admin?: string;
}

const ChatSchema: Schema = new Schema(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isGroup: { type: Boolean, default: false },
    name: { type: String },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Chat = mongoose.model<IChat>("Chat", ChatSchema);
export default Chat;
