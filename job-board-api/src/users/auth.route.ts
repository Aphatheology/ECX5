import express, { Router } from "express";
import validate from "../middlewares/validate";
import userController from "./user.controller";
import userValidation from "./user.validation";

const router: Router = express.Router();

router
    .route("/register")
    .post(validate(userValidation.register), userController.register);

router
    .route("/login")
    .post(validate(userValidation.login), userController.login);

export default router;
