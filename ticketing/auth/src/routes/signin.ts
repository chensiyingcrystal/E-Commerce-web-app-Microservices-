import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../models/validate-request';
import { Request, Response } from 'express';

const router = express.Router();

router.post('/api/users/signin', 
[
    body('email').isEmail().withMessage('Email must be valid'), 
    body('password').trim().notEmpty().withMessage('You must supply a passoword')
], 
validateRequest,
(req: Request, res: Response) => {

    res.send("Hi there sign in...");
});

export { router as signinRouter };