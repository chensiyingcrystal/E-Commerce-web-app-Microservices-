import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import {
    validateRequest,
    NotFoundError, 
    requireAuth,
    NotAuthroizedError
} from '@crystaltickets/common';
import { Ticket } from '../model/tickets';
import { flattenDiagnosticMessageText } from 'typescript';

const router = express.Router();

router.put('/api/tickets/:id', requireAuth, async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
        throw new NotAuthroizedError();
    }

    res.send(ticket);


});

export { router as updateTicketRouter };