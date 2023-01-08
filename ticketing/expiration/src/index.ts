import { natsWrapper } from './nats-wrapper';

const start = async () => {
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined');
    }

    if (!process.env.NATS_URL) {
        throw new Error('NATS_URL must be defined');
    }

    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID must be defined');
    }

    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID, 
            process.env.NATS_CLIENT_ID, 
            process.env.NATS_URL
        );
        //after we connect, we are gonna capture any close event
        //and call the function
        natsWrapper.client.on('close', () => {
            console.log('Nats connection closed');
            process.exit();
        })
        //set up two listeners
        //close when signal interrupted or terminated
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

    } catch (err) {
        console.error(err);
    }

};

start();


