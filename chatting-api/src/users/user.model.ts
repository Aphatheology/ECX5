import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import moment from "moment";
import jwt from "jsonwebtoken";
import config from "../config/config";
import dotenv from "dotenv";

dotenv.config();

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  role: RolesEnum;
  refreshToken?: string | null;
  createJWT: () => string;
  createRefreshToken: () => string;
  comparePassword: (candidatePassword: string, userPassword: string) => Promise<boolean>;
}

export enum RolesEnum {
  ADMIN = "admin",
  USER = "user"
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: RolesEnum,
      required: true,
      default: RolesEnum.USER
    },
    refreshToken: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        return ret;
      },
    },
  }
);

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.refreshToken;
    return ret;
  },
});

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.createJWT = async function (): Promise<string> {
  const payload = {
    id: this._id,
    email: this.email,
    username: this.username,
    role: this.role,
    iat: moment().unix(),
    exp: moment().add(config.jwt.expireInMinute, "minutes").unix(),
  };

  return jwt.sign(payload, config.jwt.secret);
};

userSchema.methods.createRefreshToken = async function (): Promise<string> {
  return jwt.sign({ id: this._id }, config.jwt.refreshSecret, {
    expiresIn: moment().add(config.jwt.refreshExpireInMinute, "minutes").unix(),
  });
};

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
