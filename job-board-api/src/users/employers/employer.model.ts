import mongoose, { Model, Schema, Types, Document } from 'mongoose';

export interface IEmployer extends Document {
  user: Types.ObjectId;
  companyName?: string;
  companyWebsite?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmployerSchema = new Schema<IEmployer>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String },
    companyWebsite: { type: String },
  },
  { timestamps: true }
);

const Employer: Model<IEmployer> = mongoose.model<IEmployer>('Employer', EmployerSchema);
export default Employer;
