import { StatusCodes } from 'http-status-codes';
import { IUser } from 'users/user.model';
import ApiError from '../../utils/ApiError';
import Employer, { IEmployer } from './employer.model';


/**
 * Update employer profile
 * @param {IUser} user
 * @param {Partial<IEmployer>} employerDto 
 * @returns {Promise<IEmployer>} 
 */
export const updateEmployerProfile = async (user: IUser | undefined, employerDto: Partial<IEmployer>): Promise<IEmployer> => {
  const employer = await Employer.findOne({ user: user?.id });

  if (!employer) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update Employer profile, contact Admin');
  }
  
  const updatedEmployer = await Employer.findByIdAndUpdate(
    employer.id,
    { $set: { ...employerDto } },
    { new: true, runValidators: true }
  );

  if (!updatedEmployer) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update Employer profile');
  }

  return updatedEmployer;
};