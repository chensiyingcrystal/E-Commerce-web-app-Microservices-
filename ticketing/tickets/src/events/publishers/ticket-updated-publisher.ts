import { Publisher, Subjects, TicketUpdatedEvent } from '@crystaltickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    
}