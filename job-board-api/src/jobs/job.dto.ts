import { JobTypeEnum } from './job.model';

export interface CreateJobDto {
  title: string;
  description: string;
  location: string;
  salary?: number;
  type: JobTypeEnum;
  employer: string;
}

export type UpdateJobDto = Partial<CreateJobDto>;
