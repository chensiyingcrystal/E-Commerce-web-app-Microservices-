import mongoose from "mongoose";

interface TicketAttrs {
    title: string;
    price: number;
    userId: string;

}

//purpose: adding some additional property in the future(mongoose internal)
interface TicketDoc extends mongoose.Document{
    title: string;
    price: number;
    userId: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs) : TicketDoc;

}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String, //used by mongoose //String referred in JavaScript
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    userId: {
        type: String,
        required: true
    }

}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};

//create ticket model
//first: name for the collection; second: schema
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

//used for save and retrieve data
export { Ticket };