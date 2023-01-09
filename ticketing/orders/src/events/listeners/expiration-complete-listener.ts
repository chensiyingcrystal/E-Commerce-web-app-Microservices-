import { Message } from "node-nats-streaming";
import { Subjects, Listener, ExpirationCompleteEvent, OrderStatus } from "@crystaltickets/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName: string = queueGroupName;
//first arg: data from inside our event, second arg: message from nats server(underlying property and built-in property)
    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket');
        
        if (!order) {
            throw new Error('Order not found');
        }

        order.set({
            status: OrderStatus.Cancelled,
        });

        await order.save();
        new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id,
                price: order.ticket.price
            }
        });

        msg.ack();
    }
}