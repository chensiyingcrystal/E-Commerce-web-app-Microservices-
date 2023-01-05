export enum OrderStatus {
    //the order created, but the ticket associated with it has not been reserved 
    Created = 'created',
    //the ticket it is trying to order has already been reserved
    //or the user cancelled the order
    Cancelled = 'cancelled',
    //the order has successfully order the ticket
    AwaitingPayment = 'awaiting:payment',
    //the order has xxx the ticket and payment is set 
    Complete = 'complete'
}