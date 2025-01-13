import mongoose, { Model, Schema, Types } from 'mongoose';

interface IResume {
  url: string;
  name: string;
}

export interface IApplicant extends Document {
  user: Types.ObjectId;
  headline?: string;
  resumes: IResume[];
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    url: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
          return urlRegex.test(value);
        },
        message: (props: any) => `${props.value} is not a valid URL!`,
      },
    },
    name: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const ApplicantSchema = new Schema<IApplicant>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    headline: { type: String},
    resumes: [ResumeSchema],
  },
  { timestamps: true }
);

const Applicant: Model<IApplicant> = mongoose.model<IApplicant>('Applicant', ApplicantSchema);
export default Applicant;
