import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import * as urlService from './url.service';
import { StatusCodes } from 'http-status-codes';
import { CustomRequest } from 'middlewares/auth';

export const createShortUrl = catchAsync(async (req: CustomRequest, res: Response) => {
  const url = await urlService.createShortUrl(req.user, req.body);
  res.status(StatusCodes.CREATED).send(url);
});

export const getMyUrls = catchAsync(async (req: CustomRequest, res: Response) => {
  const result = await urlService.getMyUrls(req.user);
  res.send(result);
});

export const getUrl = catchAsync(async (req: CustomRequest, res: Response) => {
  const url = await urlService.getUrl(req.params.shortUrl);
  res.redirect(url.longUrl);
});

export const deleteUrl = catchAsync(async (req: CustomRequest, res: Response) => {
  await urlService.deleteUrl(req.user, req.params.shortUrl);
  res.send();
});