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
    createJWT: () => string;
    comparePassword: (candidatePassword: string, userPassword: string) => Promise<boolean>;
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

userSchema.methods.createJWT = function (): string {
    const payload = {
        id: this._id,
        email: this.email,
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
