import Queue from 'bull';
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
    console.log('I want to publish an expiration:complete event for orderId', 
        job.data.orderId);

});

export { expirationQueue };