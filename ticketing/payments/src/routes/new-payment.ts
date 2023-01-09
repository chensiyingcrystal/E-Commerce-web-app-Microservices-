import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, BadRequestError, NotFoundError, NotAuthroizedError, OrderStatus } from '@crystaltickets/common';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

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

    const charge = await stripe.charges.create({
        amount: order.price * 100,
        currency: 'usd',
        source: token, // a token coming into our request handler
    });
    //build a payment object for future search
    const payment = Payment.build({
        orderId, 
        stripeId: charge.id,
    });
    await payment.save();

    //emit an event: successfully finish a payment
    new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId,
    });


    res.status(201).send(payment);

});

export { router as createChargeRouter };