/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noDataFound = (req: Request, res: Response, next: NextFunction) => {
  return res.status(httpStatus.NOT_FOUND).json({
    success: false,
    statusCode: httpStatus.NOT_FOUND,
    message: 'No Data Found',
  });
};

export default noDataFound;
