import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';

export class TicketCreatedListener extends Listener {
    subject = 'ticket:created';
    queueGroupName: string = 'payments-service';
  
    onMessage(data: any, msg: Message): void {
        console.log('event data received', data);
  
        msg.ack();
    }
  }