import jwt from "jsonwebtoken";
// import StatusCodes from "http-status";
import ApiError from "../utils/ApiError";
import User from "../users/user.model";
import { Request, Response, NextFunction } from "express";
import { HydratedDocument } from 'mongoose';
import { StatusCodes } from 'http-status-codes';

export interface CustomRequest extends Request {
  user?:  HydratedDocument<typeof User> | null;
  token?: string
}

const auth = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
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

        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        next(error);
    }
};

export default auth;
