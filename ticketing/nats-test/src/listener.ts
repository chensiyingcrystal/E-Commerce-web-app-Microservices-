import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();
//connect to nats streaming server with a randomly generated client ID
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');
//gracefully close the client
//will inform the nats server that this client will be closed
  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });
//equal to the following code
  new TicketCreatedListener(stan).listen();
//set options
//manual ack mode: manually inform the nats server that a client will be closed instead of automatically acknowledged through timeout setting
//deliverallavailable: deliver all past events to a newly started client
//durablename: set a identifier to a subscriber, and record all events that has been received by the subscribers associated with this identifier. In this way, a subscriber will not repeatedly receive past events that it may have been received before it restarts.
  // const options = stan
  //   .subscriptionOptions()
  //   .setManualAckMode(true)
  //   .setDeliverAllAvailable()
  //   .setDurableName('accounting-service');
//queue-group function: one is for sending only one event to any of the replicas of the same subscriber
//another is not deleting the records for a durable name asscociated with some subscribers even if all of its replicas are closed at some time
  // const subscription = stan.subscribe(
  //   'ticket:created',
  //   'queue-group-name',
  //   options
  // );

//   subscription.on('message', (msg: Message) => {
//     const data = msg.getData();

//     if (typeof data === 'string') {
//       console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
//     }
// //send ack message back to the nats server
//     msg.ack();
//   });
});
//signal before a client closing
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());



