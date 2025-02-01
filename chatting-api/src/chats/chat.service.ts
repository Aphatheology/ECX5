import { IUser } from '../users/user.model';
import ApiError from '../utils/ApiError';
import { CreateChatDto, SendMessageDto, SendMessageResponse } from './chat.interface';
import Chat, { IChat } from './chat.model';
import Message, { IMessage, MsgTypeEnum } from './message.model';
import { StatusCodes } from 'http-status-codes';
import { ObjectId, Types } from 'mongoose';


export const createChat = async (createChatDto: CreateChatDto): Promise<IChat> => {
  let chat = await Chat.findOne({ members: { $all: [...createChatDto.members] } });

  if (!chat) {
    chat = await Chat.create({...createChatDto, members: createChatDto.members.map(user => new Types.ObjectId(user))});
  }

  return chat;
};

export const getChat = async (chatId: string): Promise<IChat> => {
  let chat = await Chat.findOne({ _id: chatId });

  if (!chat) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Chat not found")
  }

  return chat;
};

export const getChats = async (user: IUser | undefined): Promise<IChat[]> => {
  const chat = await Chat.find({members: user?.id});

  return chat;
};

export const sendMessage = async (
  userId: string,
  sendMessageDTO: SendMessageDto
): Promise<IMessage> => {
  const { chatId, content, typeOfMsg, fileURL, fileSize } = sendMessageDTO;

  let messageData: Partial<IMessage> = {
    sender: userId,
    chatId,
    content: content || '', 
    readBy: [userId],
    typeOfMsg,
    fileURL: fileURL || undefined,
    fileSize: fileSize || undefined 
  };

  const message = await Message.create(messageData);

  await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

  const populatedMessage = await Message.findById(message._id)
    .populate('sender', '_id username')
    .exec();

  return populatedMessage || message;
};

export const getMessages = async (userId: string, chatId: string): Promise<IMessage[]> => {
  const chat = await Chat.findById(chatId);

  if (!chat || !chat.members.includes(userId)) {
    throw new ApiError(StatusCodes.FORBIDDEN, "User is not a member of this chat");
  }

  return await Message.find({ chatId })
    .populate("sender", "_id username");
};

export const markAsRead = async (messageId: string, userId: string) => {
  await Message.findByIdAndUpdate(messageId, { $addToSet: { readBy: userId } });
};
