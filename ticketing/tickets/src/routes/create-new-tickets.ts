import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@crystaltickets/common';
import { Ticket } from '../model/tickets';

const router = express.Router();

router.post('/api/tickets', requireAuth, [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
], validateRequest,
    async (req: Request, res: Response) => {
    
    const { title, price } = req.body;

    const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id //tell tp that currentUser is guaranteed to be defined
    });
    await ticket.save();

    res.status(201).send(ticket);

});

export { router as createTicketRouter };