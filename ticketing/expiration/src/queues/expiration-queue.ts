import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';
import { natsWrapper } from '../nats-wrapper';
//define property in the job(a javascript object)
//use this to let typescript to better check what
//right info needs to be put in the job
interface Payload {
    orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
    //tell queue to use redis
    redis: {
        host: process.env.REDIS_HOST
    }
});
//when redis send back job to us
//we need to process it then publish event(expiration complete)
expirationQueue.process(async( job ) => {
    new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderId: job.data.orderId,
    });

});

export { expirationQueue };