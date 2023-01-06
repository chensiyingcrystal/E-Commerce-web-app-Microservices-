import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import { OrderStatus, requireAuth } from '@crystaltickets/common';

const router = express.Router();
//maybe delete method is not the best choice
//we can use put as we only want to update the order's status to cancelled
router.delete('/api/orders/:orderId', async (req: Request, res: Response) => {
    res.send({});
});

export { router as deleteOrderRouter };