import ApiError from "../utils/ApiError";
import jwt from "jsonwebtoken";
import Users, { IUser, RolesEnum } from "./user.model";
import { StatusCodes } from 'http-status-codes';
import config from '../config/config';

const isEmailTaken = async (email: string): Promise<boolean> => {
  const user = await Users.findOne({ email });
  return !!user;
};

export const register = async (userBody: Record<string, any>): Promise<{ user: IUser; accessToken: string; refreshToken: string }> => {
  if (await isEmailTaken(userBody.email)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Email already taken");
  }

  const user = await Users.create(userBody);

  const accessToken = await user.createJWT();
  const refreshToken = await user.createRefreshToken();

  user.refreshToken = refreshToken;
  return { user, accessToken, refreshToken };
};

export const login = async (userBody: { email: string; password: string }): Promise<{ user: IUser; accessToken: string; refreshToken: string }> => {
  const user = await Users.findOne({ email: userBody.email }).select(
    "+password"
  );

  if (
    !user ||
    !(await user.comparePassword(userBody.password, user.password))
  ) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Incorrect email or password"
    );
  }
  
  const accessToken = await user.createJWT();
  const refreshToken = await user.createRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

export const getProfile = async (user: IUser | undefined): Promise<IUser> => {
  const userProfile = await Users.findOne({ _id: user?.id });

  if (!userProfile) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  return userProfile;
};

export const getWithUsername = async (username: string): Promise<Partial<IUser>> => {
  const userProfile = await Users.findOne({ 
    username: { $regex: new RegExp(`^${username}$`, "i") } 
  });
  
  if (!userProfile) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  return {username, _id: userProfile._id};
};

export const refreshToken = async (token: string): Promise<{ accessToken: string; refreshToken: string }> => {
  const decoded = jwt.verify(token, config.jwt.refreshSecret) as { id: string };
  const user = await Users.findById(decoded.id);

  if (!user || user.refreshToken !== token) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
  }

  const newAccessToken = await user.createJWT();
  const newRefreshToken = await user.createRefreshToken();

  user.refreshToken = newRefreshToken;
  await user.save();

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logout = async (userId: string): Promise<void> => {
  const user = await Users.findById(userId);

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  user.refreshToken = null;
  await user.save();
};
