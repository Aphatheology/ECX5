import mongoose, { Model, Schema, Types } from 'mongoose';

interface IResume {
  url: string;
  publicId: string;
  tag: string;
  createdAt: Date;
}

export interface IApplicant extends Document {
  user: Types.ObjectId;
  headline?: string;
  resumes: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ApplicantSchema = new Schema<IApplicant>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    headline: { type: String},
    resumes: [{ type: Schema.Types.ObjectId, ref: 'Resume' }]
  },
  { timestamps: true }
);

export const Applicant: Model<IApplicant> = mongoose.model<IApplicant>('Applicant', ApplicantSchema);
export const Resume: Model<IResume> = mongoose.model<IResume>('Resume', ResumeSchema);
