import { Message } from "node-nats-streaming";
import { Subjects, Listener, OrderCreatedEvent } from "@crystaltickets/common";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = queueGroupName;
//first arg: data from inside our event, second arg: message from nats server(underlying property and built-in property)
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime(); //get time in milliseconds
        console.log('Waiting this millisecond to process the job: ', delay);
        //create a new job and queue it up
        await expirationQueue.add({
            orderId: data.id
        }, 
        {
            delay: delay
        }
        );

        msg.ack();
    }
}