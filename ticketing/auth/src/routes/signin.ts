import express from 'express';
import { body, validationResult } from 'express-validator';
import { Request, Response } from 'express';

import { RequestValidationError } from '../errors/request-validation-error';

const router = express.Router();

router.post('/api/users/signin', 
[
    body('email').isEmail().withMessage('Email must be valid'), 
    body('password').trim().notEmpty().withMessage('You must supply a passoword')
], 
(req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }


    res.send("Hi there new edition");
});

export { router as signinRouter };