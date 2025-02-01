import express, { Router } from "express";
import validate from "../middlewares/validate";
import * as userValidation from "./user.validation";
import * as userController from "./user.controller";
import auth from '../middlewares/auth';

const router: Router = express.Router();

router
  .route("/")
  .get(auth(), userController.getProfile);

router
  .route("/:username")
  .get(auth(), validate(userValidation.getWithUsername), userController.getWithUsername);

router.route("/logout").post(auth(), userController.logout);

export default router;
