import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@crystaltickets/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName: string = queueGroupName;
//first arg: data from inside our event, second arg: message from nats server(underlying property and built-in property)
    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        //pull ticket info from data and 
        //save it to our local ticket collection(data copy between databases of services)
        //so that we don't need to make sync communication between databases
        const { id, title, price } = data;
        const ticket = Ticket.build({
            id, //ticket id is transformed to JSON in event, so we refer it as 'id' instead of '_id'
            title,
            price,
        });
        await ticket.save();

        msg.ack();
    }
}