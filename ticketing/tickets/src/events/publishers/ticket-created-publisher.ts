import { Publisher, Subjects, TicketCreatedEvent } from '@crystaltickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    
}