import { Message } from "node-nats-streaming";
import { Subjects, Listener, OrderCreatedEvent } from "@crystaltickets/common";
import { Ticket } from "../../model/tickets";
import { queueGroupName } from "./queue-group-name";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = queueGroupName;
//first arg: data from inside our event, second arg: message from nats server(underlying property and built-in property)
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        //find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id);
        //if not ticket, throw error
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        //mark the ticket as being reserved by setting its orderId property
        ticket.set({ orderId: data.id });

        //save the ticket
        await ticket.save();

        //publish event to inform ticket service to update the version (sync between ticket database)
        new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id, 
            version: ticket.version,
            title: ticket.title,
            price: ticket.price, 
            userId: ticket.userId, 
            orderId: ticket.orderId, 
        });

        //ack the message
        msg.ack();
    }
}