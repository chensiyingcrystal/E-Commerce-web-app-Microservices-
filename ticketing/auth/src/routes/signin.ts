import express from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { Password } from '../services/password';
import { User } from '../models/user';
import { validateRequest } from '@crystaltickets/common';
import { Request, Response } from 'express';
import { BadRequestError } from '@crystaltickets/common';

const router = express.Router();

router.post('/api/users/signin', 
[
    body('email').isEmail().withMessage('Email must be valid'), 
    body('password').trim().notEmpty().withMessage('You must supply a passoword')
], 
validateRequest,
async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new BadRequestError('No such user exists...');

    }

    const passwordsMatch = await Password.compare(
        existingUser.password, password
    );

    if (!passwordsMatch) {
        throw new BadRequestError("Wrong password...");
    }

    //generate JWT
    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    }, process.env.JWT_KEY!);
    //the ! above tells typescript that 
    //we can guarantee that we have checked that 
    //jwt key has been defined; 

    //store it on session object of req
    req.session = {
        jwt: userJwt
    };

    res.status(200).send(existingUser);
});

export { router as signinRouter };