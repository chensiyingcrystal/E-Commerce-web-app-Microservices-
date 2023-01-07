import mongoose from "mongoose";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@crystaltickets/common';
import { Order } from './order';

interface TicketAttrs {
    id: string;
    title: string;
    price: number;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
    findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByEvent = (event: { id: string, version: number }) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1,
    });
};

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    //instead of assigning attrs, we need to pass it one by one
    //so that we will not automatically generate a random Id
    //we want ticket _id is copyed from the id property
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price,
    });
};

ticketSchema.methods.isReserved = async function() {
    //this === the ticket document that we just called 'isReserved' on
    const existingOrder = await Order.findOne({
        ticket: this, //has a ticket that is what the ticket we're fetching now
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    });

    return !!existingOrder;
}

//ticket model that allows us to access the whole collection of objects
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };