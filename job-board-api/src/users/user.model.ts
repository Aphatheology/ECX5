import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import moment from "moment";
import jwt from "jsonwebtoken";
import config from "../config/config";
import dotenv from "dotenv";
import Applicant from '../users/applicants/applicant.model';
import Employer from '../users/employers/employer.model';

dotenv.config();

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  role: RolesEnum;
  otherId?: string;
  createJWT: () => string;
  comparePassword: (candidatePassword: string, userPassword: string) => Promise<boolean>;
}

export enum RolesEnum {
  EMPLOYER = "employer",
  APPLICANT = "applicant"
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
      default: RolesEnum.APPLICANT
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.createJWT = async function (): Promise<string> {
  let otherId = null;
  if (this.role === "applicant") {
    const applicant = await Applicant.findOne({ user: this._id });
    if (applicant) {
      otherId = applicant.id;
    }
  } else if (this.role === "employer") {
    const employer = await Employer.findOne({ user: this._id });
    if (employer) {
      otherId = employer.id;
    }
  }

  const payload = {
    id: this._id,
    email: this.email,
    role: this.role,
    otherId: otherId,
    iat: moment().unix(),
    exp: moment().add(config.jwt.expireInMinute, "minutes").unix(),
  };

  return jwt.sign(payload, config.jwt.secret);
};

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
