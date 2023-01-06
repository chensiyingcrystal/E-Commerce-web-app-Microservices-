import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@crystaltickets/common';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post('/api/orders', requireAuth, [
    body('ticketId').not().isEmpty().custom((input: string) => mongoose.Types.ObjectId.isValid(input)) //a valid ticket id
        .withMessage('TicketId is required')
], validateRequest, async (req: Request, res: Response) => {
    //find the ticket in the database
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
        throw new NotFoundError();
    }
    //make sure that this ticket is not already reserved
    //add isReserved function into ticket
    const isReserved = await ticket.isReserved();

    if (isReserved) {
        throw new BadRequestError('Ticket is already reserved');;
    }
    //calculate the expiration date for the order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    //build the order and save it to the database
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket: ticket
    });
    await order.save();

    //publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(), //utc time form
        ticket: {
            id: ticket.id,
            price: ticket.price,
        }
    });

    res.status(201).send(order);

});

export { router as newOrderRouter };