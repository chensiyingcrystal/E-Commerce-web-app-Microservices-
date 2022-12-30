import { Request, Response, NextFunction } from 'express';
import { NotAuthroizedError } from '../errors/not-authorized-error';

export const requireAuth = (
    req: Request, 
    res: Response,
    next: NextFunction
) => {
    if (!req.currentUser) {
        throw new NotAuthroizedError();
    }

    next();
};