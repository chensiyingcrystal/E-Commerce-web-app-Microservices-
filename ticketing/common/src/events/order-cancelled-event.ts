import { OrderStatus, Subjects } from "..";

export interface OrderCancelledEvent {
    subject: Subjects.OrderCancelled;
    data: {
        id: string;
        version: number;
        ticket: {
            id: string;
            price: number;
        };
    };
}