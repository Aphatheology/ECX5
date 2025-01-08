import mongoose, { Schema } from 'mongoose';
import { IUrl } from './url.interface'

const urlSchema = new mongoose.Schema<IUrl>(
  {
    shortUrl: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    longUrl: {
      type: String,
      required: true,
      trim: true,
    },
    clicks: {
      type: Number,
      required: true,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Url = mongoose.model<IUrl>('Url', urlSchema);

export default Url;