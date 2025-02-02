import { IUser } from '../users/user.model';
import ApiError from '../utils/ApiError';
import { CreateChatDto, SendMessageDto } from './chat.interface';
import Chat, { IChat } from './chat.model';
import Message, { IMessage } from './message.model';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';


export const createChat = async (createChatDto: CreateChatDto): Promise<IChat> => {
  const memberIds = createChatDto.members.map(user => new Types.ObjectId(user)); 

  let chat = await Chat.findOne({
    members: { $all: memberIds, $size: memberIds.length }
  }).populate('members', '_id username');

  if (!chat) {
    chat = await Chat.create({ ...createChatDto, members: memberIds });
    await chat.populate('members', '_id username');
  }

  return chat;
};

export const getChat = async (userId: string, chatId: string): Promise<IChat> => {
  let chat = await Chat.findOne({ _id: chatId, members: userId }).populate('members', '_id username').exec();

  if (!chat) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Chat not found")
  }

  return chat;
};

export const getChats = async (user: IUser | undefined): Promise<IChat[]> => {
  const chat = await Chat.find({ members: user?.id }).populate('members', '_id username').exec();

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
