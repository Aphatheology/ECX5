
import { Applicant } from '../users/applicants/applicant.model';
import ApiError from '../utils/ApiError';
import { StatusCodes } from 'http-status-codes';
import Applications, { ApplicationStatus, IApplication } from './application.model';
import Jobs from '../jobs/job.model';
import { Pagination } from '../utils/pagination';

/**
 * Apply for a job
 * @param user
 * @param jobId
 * @param resumeId
 */
export const applyForJob = async (user: any, jobId: string, resumeId: string) => {
  const applicant = await Applicant.findOne({ user: user.id });
  if (!applicant) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Applicant profile not found');
  }

  const ownResume = applicant.resumes.some(resume => resume.toString() === resumeId);
  if (!ownResume) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Resume not matched');
  }

  const job = await Jobs.findById(jobId);
  if (!job) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Job not found');
  }

  const existingApplication = await Applications.findOne({ applicant: applicant.id, job: job.id });
  if (existingApplication) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'You have already applied for this job');
  }

  const application = await Applications.create({
    applicant: applicant.id,
    job: job.id,
    resume: resumeId,
  });

  return application;
};

/**
 * Get applications for a specific job (Employer view)
 * @param user
 * @param jobId
 */
export const getJobApplications = async (user: any, jobId: string, query: Record<string, any>): Promise<{ items: IApplication[]; page: number; totalPages: number; totalItems: number; hasNextPage: boolean }> => {
  const job = await Jobs.findOne({ _id: jobId, employer: user.otherId });
  if (!job) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You are not authorized to view applications for this job');
  }

  const {page, limit, ...filter} = query;
  const modifiedFilter = Applications.buildFilter(filter);
  const pipeline = Pagination<IApplication>(page, limit, modifiedFilter);
  console.log(pipeline)
  pipeline.splice(1, 0, {
    $lookup: {
      from: 'resumes', 
      localField: 'resume', 
      foreignField: '_id', 
      as: 'resume', 
    },
  });
  
  pipeline.splice(2, 0, {
    $unwind: {
      path: '$resume',
      preserveNullAndEmptyArrays: true, 
    },
  });
  
  pipeline.splice(3, 0, {
    $project: {
      _id: 1,
      job: 1,
      status: 1,
      'resume.url': 1, 
      createdAt: 1,
      updatedAt: 1
    },
  });

  const applications = await Applications.aggregate(pipeline);

  return applications[0] || { items: [], page: 1, totalPages: 0, totalItems: 0, hasNextPage: false };
};

/**
 * Get applications by the applicant
 * @param user
 */
export const getMyApplications = async (user: any) => {
  const applicant = await Applicant.findOne({ _id: user.otherId });
  if (!applicant) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Applicant profile not found');
  }

  const applications = await Applications.find({ applicant: applicant.id }).populate([{
    path: 'resume',
    select: 'url',
  }, {
    path: 'job'
  }]);

  return applications;
};

export const updateApplicationStatus = async (applicationId: string, status: ApplicationStatus) => {
  const application = await Applications.findByIdAndUpdate(applicationId, { status }, { new: true });
  if (!application) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Application not found');
  }

  return application;
};
