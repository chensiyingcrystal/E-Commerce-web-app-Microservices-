//A middleware to extract the JWT payload and set it on req.currentUser
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'; //validate token or extract valid data from it

interface UserPayload {
    id: string;
    email: string;
}
//modify an existing interface and add property to that
declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;//add additional property to this already existing Request type
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
        //decode the jwt
        const payload = jwt.verify(req.session.jwt, 
            process.env.JWT_KEY!) as UserPayload;
        //set the currentuser property
        req.currentUser = payload;
    } catch (err) {
    }

    next();

};