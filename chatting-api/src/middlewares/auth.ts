import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError";
import User, { IUser } from "../users/user.model";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from 'http-status-codes';

export interface CustomRequest extends Request {
  user?: IUser;
  accessToken?: string
}

const auth = (roles?: string[]) => async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  try {
    if (!token) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Please authenticate");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Please authenticate");
    }

    if (roles && roles.length > 0 && !roles.includes(user.role)) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Access denied");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      // throw ApiError(StatusCodes.UNAUTHORIZED, "jwt expired");
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "jwt expired" });
    }
    // if (error instanceof jwt.JsonWebTokenError) {
    //   throw ApiError(StatusCodes.UNAUTHORIZED, "Invalid token");
    // }
    next(error);
  }
};

export default auth;
