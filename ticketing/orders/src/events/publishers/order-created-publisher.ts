import { Publisher, OrderCreatedEvent, Subjects, OrderStatus } from '@crystaltickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    
}