import { StatusCodes } from 'http-status-codes';
import { IUser } from 'users/user.model';
import ApiError from '../../utils/ApiError';
import { IApplicant, Applicant, Resume, IResume } from './applicant.model';
import { deleteFile, uploadFile } from '../../utils/cloudinary.service';
import app from 'app';


/**
 * Update applicant profile
 * @param {IUser} user
 * @param {Partial<IApplicant>} applicantDto 
 * @returns {Promise<IApplicant>} 
 */
export const updateApplicantProfile = async (user: IUser | undefined, applicantDto: Partial<IApplicant>): Promise<IApplicant> => {
  const applicant = await Applicant.findOne({ user: user?.id });

  if (!applicant) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update Applicant profile, contact Admin');
  }

  const updatedApplicant = await Applicant.findByIdAndUpdate(
    applicant.id,
    { $set: { ...applicantDto } },
    { new: true, runValidators: true }
  );

  if (!updatedApplicant) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update Applicant profile');
  }

  return updatedApplicant;
};

export const getApplicantProfile = async (user: IUser | undefined): Promise<IApplicant> => {
  const applicant = await Applicant
    .findOne({ user: user?.id })
    .populate({
      path: 'resumes',
      select: '_id url publicId tag createdAt', 
    });

  if (!applicant) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Applicant profile not found");
  }

  return applicant;
};

export const uploadResume = async (user: IUser | undefined, body: { tag: string }, file: Express.Multer.File | undefined): Promise<IResume> => {
  if (!file) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'A file must be provided');
  }

  if (!body.tag) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'A Resume must have a tag name');
  }

  const applicant = await Applicant.findOne({ user: user?.id });
  if (!applicant) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Applicant profile not found');
  }

  const uploadedFile = await uploadFile(file, 'resume');
  const { secure_url, public_id } = uploadedFile;

  const newResume = {
    user: user?.id,
    url: secure_url,
    publicId: public_id,
    tag: body.tag,
  };
  const resume = await Resume.create(newResume);

  applicant.resumes.push(resume._id);
  await applicant.save();

  return resume;
};

export const deleteResume = async (user: IUser | undefined, id: string): Promise<void> => {
  const applicant = await Applicant.findOne({ user: user?.id });
  if (!applicant) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Applicant profile not found');
  }
  const existingResume = await Resume.findOne({ _id: id, user: user?.id });

  if (!existingResume) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Resume not found");
  }

  await deleteFile(existingResume.publicId);
  
  applicant.resumes = applicant.resumes.filter(resume => resume._id != existingResume._id);
  await applicant.save();

  await existingResume.deleteOne();
}

export const getApplicantResumes = async (user: IUser | undefined): Promise<IResume[]> => {
  const resumes = await Resume.find({ user: user?.id });

  return resumes;
}

export const updateResumeTag = async (user: IUser | undefined, id: string, tag: string): Promise<IResume> => {
  const resume = await Resume.findOne({ _id: id, user: user?.id });

  if (!resume) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Resume not found");
  }

  resume.tag = tag;
  resume.save();

  return resume;
}

