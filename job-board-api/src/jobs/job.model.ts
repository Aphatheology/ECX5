import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  description: string;
  location: string;
  salary: number;
  jobType: JobTypeEnum;
  status: JobStatus; 
  employer: mongoose.Types.ObjectId; 
  createdAt: Date;
  updatedAt: Date;
}

export enum JobTypeEnum {
  FULL_TIME = "full-time",
  PART_TIME = "part-time",
  FREELANCE = "freelance",
  CONTRACT = "contract",
}

export enum JobStatus {
  APPROVED = "approved",
  DISAPPROVED = "disapproved",
  PENDING = "pending",
  ACTIVE = "active",
  INACTIVE = "inactive",
}

const JobSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: Number },
    type: { type: String, enum: JobTypeEnum, required: true },
    status: { type: String, enum: JobStatus, required: true, default: JobStatus.PENDING },
    employer: { type: Schema.Types.ObjectId, ref: 'Employer', required: true },
  },
  { timestamps: true }
);

const Job = mongoose.model<IJob>('Job', JobSchema);

export default Job;
