import { Request, Response } from "express";
import * as chatService from "./chat.service";
import catchAsync from "../utils/catchAsync";
import { CustomRequest } from "../middlewares/auth";

export const createChat = catchAsync(async (req: CustomRequest, res: Response) => {
  const { userId, otherUserId, isGroup, groupName } = req.body;
  const chat = await chatService.createChat(userId, otherUserId, isGroup, groupName);
  res.status(201).json(chat);
});

export const sendMessage = catchAsync(async (req: CustomRequest, res: Response) => {
  const { chatId, content } = req.body;
  const message = await chatService.sendMessage(req.user?.id, chatId, content);
  res.status(201).json(message);
});

export const getMessages = catchAsync(async (req: CustomRequest, res: Response) => {
  const { chatId } = req.params;
  const messages = await chatService.getMessages(chatId);
  res.status(200).json(messages);
});

export const markAsRead = catchAsync(async (req: CustomRequest, res: Response) => {
  const { messageId } = req.body;
  await chatService.markAsRead(messageId, req.user?.id);
  res.status(200).json({ message: "Message marked as read" });
});
