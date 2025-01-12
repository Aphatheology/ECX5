import { JobTypeEnum } from './job.model';

export interface CreateJobDto {
  title: string;
  description: string;
  location: string;
  salary?: number;
  jobType: JobTypeEnum;
  employerId: string;
}

export type UpdateJobDto = Partial<CreateJobDto>;
