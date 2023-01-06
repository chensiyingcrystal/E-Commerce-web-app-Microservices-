import { Publisher, OrderCancelledEvent, Subjects } from '@crystaltickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    
}