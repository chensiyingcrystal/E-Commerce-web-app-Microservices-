import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import { OrderStatus, requireAuth, NotAuthroizedError, NotFoundError } from '@crystaltickets/common';


const router = express.Router();
//maybe delete method is not the best choice
//we can use put as we only want to update the order's status to cancelled
router.delete('/api/orders/:orderId', async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthroizedError();
    }

    res.send(order);
});

export { router as deleteOrderRouter };