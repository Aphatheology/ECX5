import { Server, Socket } from "socket.io";
import * as ChatService from './chats/chat.service';
import mongoose from 'mongoose';
import { sendMessage } from './chats/chat.validation';
import Joi from 'joi';
import { MsgTypeEnum } from './chats/message.model';
import { objectId } from './utils/custom.validation';

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'An unknown error occurred';

const sendMessageSchema = Joi.object({
  chatId: Joi.string().required().custom(objectId),
  content: Joi.string().optional().allow(''),
  typeOfMsg: Joi.string().valid(...Object.values(MsgTypeEnum)).required(),
  fileURL: Joi.string().when('typeOfMsg', {
    is: Joi.string().valid('text'),
    then: Joi.optional().allow(''), 
    otherwise: Joi.required().not(''),
  }),
  fileSize: Joi.number().optional(),
});

const socketHandler = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("error", (error) => {
      console.error(`Socket error (${socket.id}):`, error);
      socket.emit('error', 'Socket connection error');
    });

    socket.on("join_chat", (chatId) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(chatId)) {
          console.log(chatId)
          throw new Error('Invalid chat ID format');
        }

        socket.join(chatId);
        console.log(`User joined chat: ${chatId}`);
      } catch (error) {
        console.error('Join chat error:', error);
        // socket.emit('error', error.message || 'Failed to join chat');
        socket.emit('error', getErrorMessage(error));
      }
    });

    socket.on('leave room', (roomId) => {
      socket.leave(roomId);
      console.log(`User ${socket.id} left room ${roomId}`);
    });

    socket.on("message", async (userId, message) => {
      try {
        console.log(message);
        const { error } = sendMessage.body.validate(message); 

        if (error) {
          throw new Error(error.details[0].message); 
        }

        const newMessage = await ChatService.sendMessage(userId, message);

        io.to(message.chatId).emit("receive_message", newMessage);
      } catch (error) {
        console.error('Message handling error:', error);
        // socket.emit('error', error.message || 'Failed to send message');
        socket.emit('error', getErrorMessage(error));
      }
    });

    socket.on("mark_as_read", async (messageId, userId) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(messageId)) {
          throw new Error('Invalid message ID format');
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          throw new Error('Invalid user ID format');
        }

        await ChatService.markAsRead(messageId, userId);
        io.emit("message_read", { messageId, userId });
      } catch (error) {
        console.error('Mark as read error:', error);
        // socket.emit('error', error.message || 'Failed to mark message as read');
        socket.emit('error', getErrorMessage(error));
      }
    });

    socket.on("typing", (chatId, userId) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(chatId)) {
          throw new Error('Invalid chat ID format');
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          throw new Error('Invalid user ID format');
        }

        socket.to(chatId).emit("user_typing", userId);
      } catch (error) {
        console.error('Typing indicator error:', error);
        socket.emit('error', getErrorMessage(error));
      }
    });

    socket.on("stop_typing", (chatId, userId) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(chatId)) {
          throw new Error('Invalid chat ID format');
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          throw new Error('Invalid user ID format');
        }

        socket.to(chatId).emit("user_stopped_typing", userId);
      } catch (error) {
        console.error('Stop typing error:', error);
        // socket.emit('error', error.message || 'Failed to send stop typing indicator');
        socket.emit('error', getErrorMessage(error));
      }
    });

    socket.on("disconnect", () => {
      try {
        console.log("User disconnected:", socket.id);
      } catch (error) {
        console.error('Disconnect handling error:', error);
      }
    });
  });
};

export default socketHandler;