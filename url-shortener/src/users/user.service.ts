import { HydratedDocument } from 'mongoose';
import ApiError from "../utils/ApiError";
import Users, { IUser } from "./user.model";
import { StatusCodes } from 'http-status-codes';

const isEmailTaken = async (email: string): Promise<boolean> => {
  const user = await Users.findOne({ email });
  return !!user;
};

const register = async (userBody: Record<string, any>): Promise<{ user: IUser; token: string }> => {
  if (await isEmailTaken(userBody.email)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Email already taken");
  }

  const user = await Users.create(userBody);
  const token = user.createJWT();
  return { user, token };
};

const login = async (userBody: { email: string; password: string }): Promise<{ user: IUser; token: string }> => {
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
  const token = user.createJWT();

  return { user, token };
};

export default {
  register,
  login,
};
