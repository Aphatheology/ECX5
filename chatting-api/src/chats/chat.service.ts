import Chat from './chat.model';
import Message from './message.model';


export const createChat = async (userId: string, otherUserId: string, isGroup = false, groupName?: string) => {
  let chat = await Chat.findOne({ members: { $all: [userId, otherUserId] } });

  if (!chat) {
    chat = await Chat.create({
      members: [userId, otherUserId],
      isGroup,
      name: groupName || null,
    });
  }
  
  return chat;
};

export const getChats = async () => {
  const chat = await Chat.find();
  
  return chat;
};

export const sendMessage = async (userId: string, chatId: string, content: string) => {
  const message = await Message.create({
    sender: userId,
    chatId,
    content,
    readBy: [userId],
  });

  await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

  return message;
};

export const getMessages = async (chatId: string) => {
  return await Message.find({ chatId }).populate("sender", "username");
};

export const markAsRead = async (messageId: string, userId: string) => {
  await Message.findByIdAndUpdate(messageId, { $addToSet: { readBy: userId } });
};
