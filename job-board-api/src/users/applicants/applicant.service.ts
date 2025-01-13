import { StatusCodes } from 'http-status-codes';
import { IUser } from 'users/user.model';
import ApiError from '../../utils/ApiError';
import Applicant, { IApplicant } from './applicant.model';


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