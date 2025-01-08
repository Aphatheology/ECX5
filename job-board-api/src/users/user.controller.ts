import { Request, Response } from "express";
import User from "./user.model";
import userService from "./user.service";
import catchAsync from "../utils/catchAsync";
import { StatusCodes } from 'http-status-codes';

const register = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const user = await userService.register(req.body);
    res.status(StatusCodes.CREATED).send(user);
});

const login = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const user = await userService.login(req.body);
    res.send(user);
});

export default {
    register,
    login,
};
