import { StatusCodes } from 'http-status-codes';
import { IUser } from 'users/user.model';
import ApiError from '../../utils/ApiError';
import { IApplicant, Applicant, Resume } from './applicant.model';
import { deleteFile, uploadFile } from '../../utils/cloudinary.service';


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

export const uploadResume = async (user: IUser | undefined, body: { tag: string }, file: Express.Multer.File | undefined): Promise<IApplicant> => {
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

  const uploadedFile = await uploadFile(file, 'test');
  const {secure_url, public_id} = uploadedFile;

  const resume = await Resume.create({url: secure_url, publicId: public_id, tag: body.tag});

  applicant.resumes.push(resume._id); 
  await applicant.save();

  return applicant;
};

export const deleteResume = async(user: IUser | undefined, publicId: string): Promise<void> => {
  await deleteFile(publicId);
}

