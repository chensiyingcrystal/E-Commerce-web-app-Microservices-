import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

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
//set options
//manual ack mode: manually inform the nats server that a client will be closed instead of automatically acknowledged through timeout setting
//deliverallavailable: deliver all past events to a newly started client
//durablename: set a identifier to a subscriber, and record all events that has been received by the subscribers associated with this identifier. In this way, a subscriber will not repeatedly receive past events that it may have been received before it restarts.
  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName('accounting-service');
//queue-group function: one is for sending only one event to any of the replicas of the same subscriber
//another is not deleting the records for a durable name asscociated with some subscribers even if all of its replicas are closed at some time
  const subscription = stan.subscribe(
    'ticket:created',
    'queue-group-name',
    options
  );

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }
//send ack message back to the nats server
    msg.ack();
  });
});
//signal before a client closing
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

abstract class Listener {
  //name of the channel this subscriber is listening to
  abstract subject: string;
  abstract onMessage(data: any, msg: Message): void;
  abstract queueGroupName: string;
  private client: Stan;
  protected ackWait = 5 * 1000; //5s

//a pre-initialized nats client
  constructor(client: Stan) {
    this.client = client;
    
  }

  subscriptionOptions() {
    return this.client.subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );
  }

    subscription.on('message', (msg: Message) => {
      console.log(
        `Message received: ${this.subject} /
        ${this.queueGroupName}`
      );

      const parsedData = this.parseMessage(msg);
//customed function to fun when a message is received
//defined in child class
      this.onMessage(parsedData, msg);
    };

    parseMessage(msg: Message) {
      const data = msg.getData();
      return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf8'));
    }


  }
}