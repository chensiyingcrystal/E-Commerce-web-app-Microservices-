import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }
    try {
        await natsWrapper.connect('ticketing', 'aaa', 'http://nats-srv:4222');
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

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Siying connect to mongodb tickets...");
    } catch (err) {
        console.error(err);
    }

    app.listen(3000, () => {
        console.log('Chensiying is Listening on port 3000!!!');
    });
};

start();


