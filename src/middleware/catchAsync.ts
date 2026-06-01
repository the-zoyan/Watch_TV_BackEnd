
import { Request, Response, NextFunction } from 'express'
import { asyncErrorHandler } from '../utils/errorHandler.js'
type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>

export const catchAsync = (fn: AsyncFunction) => asyncErrorHandler(fn)