import express, { Router } from "express";
import auth from '../middlewares/auth';
import * as chatController from './chat.controller';
// import * as chatValidation from "./chat.validation";

const router: Router = express.Router();

router.post("/", auth(), chatController.createChat);
router.post("/send", auth(), chatController.sendMessage);
router.get("/:chatId/messages", auth(), chatController.getMessages);
router.post("/mark-as-read", auth(), chatController.markAsRead);

export default router;
