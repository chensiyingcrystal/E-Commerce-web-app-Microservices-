import { Publisher, OrderCreatedEvent, Subjects } from '@crystaltickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    
}