import express, { Router } from "express";
import auth from '../middlewares/auth';
import * as chatController from './chat.controller';
import * as chatValidation from "./chat.validation";
import validate from '../middlewares/validate';

const router: Router = express.Router();

router
  .route("/")
  .post(auth(), validate(chatValidation.createChat), chatController.createChat)
  .get(auth(), chatController.getChats);

router
  .route("/send")
  .post(auth(), validate(chatValidation.sendMessage), chatController.sendMessage);

router
  .route("/:chatId")
  .get(auth(), validate(chatValidation.getWithId), chatController.getChat);

router
  .route("/:chatId/messages")
  .get(auth(), validate(chatValidation.getWithId), chatController.getMessages);

router
  .route("/mark-as-read")
  .post(auth(), chatController.markAsRead);

export default router;
