import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest } from '../models/validate-request';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post('/api/users/signup', [
    body('email').isEmail().withMessage('Email must be valid'), 
    body('password').trim().isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters')
], 
validateRequest,
async (req: Request, res: Response) => {
    //see if someone has registered this email
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email});

    if (existingUser) {
        throw new BadRequestError('Email in use');
    }
    //building user
    const user = User.build({ 
        email, password
    });

    //save user to db
    await user.save();

    //generate JWT
    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_KEY!);
    //the ! above tells typescript that 
    //we can guarantee that we have checked that 
    //jwt key has been defined; 

    //store it on session object of req
    req.session = {
        jwt: userJwt
    };

    res.status(201).send(user);


});

export { router as signupRouter };