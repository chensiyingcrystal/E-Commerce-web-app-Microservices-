import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, BadRequestError, NotFoundError } from '@crystaltickets/common';
import { Order } from '../models/order';

const router = express.Router();

router.post('/api/payments', requireAuth, [
    body('token').not().isEmpty().withMessage('Token is required for payments'),
    body('orderId').not().isEmpty().withMessage('Order id is required')
], (req: Request, res: Response) => {
    res.send({ success: true });

});

export { router as createChargeRouter };