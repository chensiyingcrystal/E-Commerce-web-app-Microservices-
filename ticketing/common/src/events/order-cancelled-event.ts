import { OrderStatus, Subjects } from "..";

export interface OrderCancelledEvent {
    subject: Subjects.OrderCancelled;
    data: {
        id: string;
        ticket: {
            id: string;
            price: number;
        };
    };
}