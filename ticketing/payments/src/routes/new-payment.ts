import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, BadRequestError, NotFoundError, NotAuthroizedError, OrderStatus } from '@crystaltickets/common';
import { Order } from '../models/order';

const router = express.Router();

router.post('/api/payments', requireAuth, [
    body('token').not().isEmpty().withMessage('Token is required for payments'),
    body('orderId').not().isEmpty().withMessage('Order id is required')
], validateRequest, async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthroizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
        throw new BadRequestError('Order already cancelled');
    }

    res.status(201).send(order);

});

export { router as createChargeRouter };