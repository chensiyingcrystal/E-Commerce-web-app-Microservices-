import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
    id: string;
    email: string;
}
//modify an existing interface and add property to that
declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}


export const currentUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.session?.jwt) {
        //move on to our next middleware in the chain
        return next();
    }

    try {
        const payload = jwt.verify(req.session.jwt, 
            process.env.JWT_KEY!) as UserPayload;

        req.currentUser = payload;
    } catch (err) {
    }

    next();

};