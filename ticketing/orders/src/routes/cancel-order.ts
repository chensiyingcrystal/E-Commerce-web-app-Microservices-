import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import { OrderStatus, requireAuth, NotAuthroizedError, NotFoundError } from '@crystaltickets/common';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();
//maybe delete method is not the best choice
//we can use put as we only want to update the order's status to cancelled
router.delete('/api/orders/:orderId', async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) {
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthroizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    //publish an event saying that the order was cancelled
    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        ticket: {
            id: order.ticket.id,
            price: order.ticket.price
        }
    });

    res.status(204).send(order);
});

export { router as deleteOrderRouter };