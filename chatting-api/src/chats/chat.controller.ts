import { Request, Response } from "express";
import * as chatService from "./chat.service";
import catchAsync from "../utils/catchAsync";
import { CustomRequest } from "../middlewares/auth";
import { StatusCodes } from 'http-status-codes';

export const createChat = catchAsync(async (req: CustomRequest, res: Response) => {
  const chat = await chatService.createChat(req.body);
  res.status(StatusCodes.CREATED).send(chat);
});

export const getChats = catchAsync(async (req: CustomRequest, res: Response) => {
  const chats = await chatService.getChats(req.user);
  res.status(StatusCodes.OK).send(chats);
});

export const getChat = catchAsync(async (req: CustomRequest, res: Response) => {
  const chat = await chatService.getChat(req.params.chatId);
  res.status(StatusCodes.OK).send(chat);
});

export const sendMessage = catchAsync(async (req: CustomRequest, res: Response) => {
  const message = await chatService.sendMessage(req.user?.id, req.body);
  res.status(StatusCodes.CREATED).send(message);
});

export const getMessages = catchAsync(async (req: CustomRequest, res: Response) => {
  const { chatId } = req.params;
  const messages = await chatService.getMessages(req.user?.id, chatId);
  res.status(StatusCodes.OK).send(messages);
});

export const markAsRead = catchAsync(async (req: CustomRequest, res: Response) => {
  const { messageId } = req.body;
  await chatService.markAsRead(messageId, req.user?.id);
  res.status(200).json({ message: "Message marked as read" });
});
