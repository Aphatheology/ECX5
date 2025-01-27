import mongoose, { Schema, Document, FilterQuery, Model } from 'mongoose';
import { toRegexFilter, toInFilter } from '../utils/generic-filters';

export interface IApplication extends Document {
  job: Schema.Types.ObjectId;
  applicant: Schema.Types.ObjectId;
  resume: Schema.Types.ObjectId;
  status: ApplicationStatus;
}

export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  INTERVIEW = 'interview',
  REJECTED = 'rejected',
  OFFERED = 'offered',
}

interface IApplicationModel extends Model<IApplication> {
  buildFilter(filter: Record<string, any>): FilterQuery<IApplication>;
}

const ApplicationSchema: Schema = new Schema(
  {
    job: { type: Schema.Types.ObjectId, ref: 'Jobs', required: true },
    applicant: { type: Schema.Types.ObjectId, ref: 'Applicant', required: true },
    resume: { type: Schema.Types.ObjectId, ref: 'Resume', required: true },
    status: { type: String, enum: ApplicationStatus, default: ApplicationStatus.PENDING },
  },
  { timestamps: true }
);

ApplicationSchema.statics.buildFilter = function (filter: Record<string, any>): FilterQuery<IApplication> {
  const modifiedFilter: FilterQuery<IApplication> = {};

  if(filter.status) modifiedFilter.status = toInFilter(filter.status);

  return modifiedFilter;
}

const Applications = mongoose.model<IApplication, IApplicationModel>('Applications', ApplicationSchema);

export default Applications;