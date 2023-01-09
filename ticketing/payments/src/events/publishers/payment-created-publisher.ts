import { Publisher, Subjects, PaymentCreatedEvent } from '@crystaltickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    
}