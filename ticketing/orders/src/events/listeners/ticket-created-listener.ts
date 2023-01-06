import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@crystaltickets/common";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName: string = 'orders-service';
//first arg: data from inside our event, second arg: message from nats server
    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        
    }
}