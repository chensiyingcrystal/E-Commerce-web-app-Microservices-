import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subject';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName: string = 'payments-service';
  
    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log('event data received', data);
  
        msg.ack();
    }
  }