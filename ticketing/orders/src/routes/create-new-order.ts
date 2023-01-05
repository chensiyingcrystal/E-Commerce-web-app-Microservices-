import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@crystaltickets/common';

const router = express.Router();

router.post('/api/orders', requireAuth, [
    body('ticketId').not().isEmpty().custom((input: string) => mongoose.Types.ObjectId.isValid(input)) //a valid ticket id
        .withMessage('TicketId is required')
], validateRequest, async (req: Request, res: Response) => {
    
    res.send({});

});

export { router as newOrderRouter };