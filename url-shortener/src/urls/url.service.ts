import mongoose from 'mongoose';
import Url from './url.model';
import ApiError from '../utils/ApiError';
import { IUrl } from './url.interface';
import { StatusCodes } from 'http-status-codes';
import { IUser } from 'users/user.model';
import {nanoid} from "nanoid";

/**
 * Generate unique short url nanoid
 * @returns {Promise<String>}
 */
const generateUniqueId = async () => {
  let shortUrl = nanoid(8);
  let existingShortUrl = await Url.find({shortUrl});
  while (existingShortUrl) {
    shortUrl = nanoid(8);
    existingShortUrl = await Url.find({shortUrl});
  }
  return shortUrl;
}

/**
 * Create a url
 * @param {IUser} user
 * @param {IUrl} urlBody
 * @returns {Promise<IUrl>}
 */
export const createShortUrl = async (user: IUser | undefined, urlBody: IUrl): Promise<IUrl> => {
  // Can 2 users shorten the same long url?
  // const existingLongUrl = await Url.findOne({longUrl: urlBody.longUrl});
  // if (existingLongUrl) {
  //   return existingLongUrl;
  // }

  const shortUrl = await generateUniqueId();
  urlBody.createdBy = user?.id;
  urlBody.shortUrl = shortUrl;
  const url = await Url.create(urlBody)
  return url;
};

/**
 * @param {IUser} user
 * @returns {Promise<IUrl[]>}
 */
export const getMyUrls = async (user: IUser | undefined): Promise<IUrl[]> => {
  const urls = await Url.find({createdBy: user?.id});
  return urls;
};

/**
 * Get url by id
 * @param {string} shortUrl
 * @returns {Promise<IUrl | null>}
 */
export const getUrl = async (shortUrl: string): Promise<IUrl> => {
  const url = await Url.findOne({shortUrl});
  if (!url) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Url not found");
  }

  url.clicks = url.clicks + 1;
  url.save();
  return url;
}

/**
 * Delete url by id
 * @param {string} shortUrl
 * @returns {Promise<void>}
 */
export const deleteUrl = async (user: IUser | undefined, shortUrl: string): Promise<void> => {
  const url = await Url.findOne({shortUrl, createdBy: user?.id});

  if (!url) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Url not found");
  }
  
  await url.deleteOne();
  return;
};