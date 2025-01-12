import { Request, Response } from "express";
import User from "./user.model";
import userService from "./user.service";
import catchAsync from "../utils/catchAsync";
import { StatusCodes } from 'http-status-codes';
import { CustomRequest } from 'middlewares/auth';

export const getProfile = catchAsync(async (req: CustomRequest, res: Response): Promise<any> => {
    const user = await userService.getProfile(req.user);
    res.status(StatusCodes.OK).send(user);
});
