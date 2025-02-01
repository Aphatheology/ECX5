import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { StatusCodes } from 'http-status-codes';
import { CustomRequest } from 'middlewares/auth';
import * as userService from './user.service';

export const register = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const user = await userService.register(req.body);
  res.status(StatusCodes.CREATED).send(user);
});

export const login = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const user = await userService.login(req.body);
  res.status(StatusCodes.OK).send(user);
});

export const getProfile = catchAsync(async (req: CustomRequest, res: Response): Promise<any> => {
    const user = await userService.getProfile(req.user);
    res.status(StatusCodes.OK).send(user);
});

export const getWithUsername = catchAsync(async (req: CustomRequest, res: Response): Promise<any> => {
  const user = await userService.getWithUsername(req.params.username);
  res.status(StatusCodes.OK).send(user);
});

export const refreshAccessToken = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const tokens = await userService.refreshToken(req.body.token);
  res.status(StatusCodes.OK).send(tokens);
});

export const logout = catchAsync(async (req: CustomRequest, res: Response): Promise<void> => {
  await userService.logout(req.user?.id);
  res.status(StatusCodes.OK).send({ message: "Logged out successfully" });
});