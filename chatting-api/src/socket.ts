import { Server, Socket } from "socket.io";
import * as ChatService from './chats/chat.service';
import { sendMessage } from './chats/chat.validation';
import logger from './config/logger';

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'An unknown error occurred';

const userSockets = new Map<string, string>(); // <socketId, username>

const socketHandler = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    logger.info(`User connected: ${socket.id}`);

    socket.on("authenticate", (username: string) => {
      userSockets.set(socket.id, username);
    });

    socket.on("error", (error) => {
      logger.error(`Socket error (${socket.id}):`, error);
      socket.emit('error', 'Socket connection error');
    });

    socket.on("join_chat", (chatId) => {
      try {

        socket.join(chatId);
        logger.info(`User joined chat: ${chatId}`);
      } catch (error) {
        logger.error('Join chat error:', error);
        socket.emit('error', getErrorMessage(error));
      }
    });

    socket.on("leave_chat", (chatId) => {
      socket.leave(chatId);
      logger.info(`User ${socket.id} left chat ${chatId}`);
      socket.to(chatId).emit("user_left", socket.id);
    });

    socket.on("message", async (userId, message) => {
      try {
        const { error } = sendMessage.body.validate(message); 
        if (error) throw new Error(error.details[0].message);

        const newMessage = await ChatService.sendMessage(userId, message);
        io.to(message.chatId).emit("receive_message", newMessage);
      } catch (error) {
        logger.error("Message handling error:", error);
        socket.emit("error", getErrorMessage(error));
      }
    });

    socket.on("typing", (chatId, username) => {
      try {
        socket.to(chatId).emit("user_typing", username);
      } catch (error) {
        logger.error("Typing indicator error:", error);
        socket.emit("error", getErrorMessage(error));
      }
    });

    socket.on("stop_typing", (chatId, username) => {
      try {
        socket.to(chatId).emit("user_stopped_typing", username);
      } catch (error) {
        logger.error("Stop typing error:", error);
        socket.emit("error", getErrorMessage(error));
      }
    });

    socket.on("disconnect", () => {
      try {
        logger.info("User disconnected:", socket.id);
        
        const rooms = Array.from(socket.rooms);
        logger.info(rooms);
        rooms.forEach((room) => {
          if (room !== socket.id) {
            socket.to(room).emit("user_left", socket.id); 
            socket.leave(room);
            logger.info(`User ${socket.id} left room ${room}`);
          }
        });
    
        userSockets.delete(socket.id);
        socket.removeAllListeners();
      } catch (error) {
        logger.error("Disconnect handling error:", error);
      }
    });
    
  });
};

export default socketHandler;
