import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subject';

//define generic event
interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
    //name of the channel this subscriber is listening to
    abstract subject: T['subject'];
    abstract onMessage(data: T['data'], msg: Message): void;
    abstract queueGroupName: string;
    protected client: Stan;
    //time for this subscriber to ack a message
    protected ackWait = 5 * 1000; //5s
  
  //a pre-initialized nats client
    constructor(client: Stan) {
      this.client = client;
    }
  //customed subscription options
    subscriptionOptions() {
      return this.client.subscriptionOptions()
        .setDeliverAllAvailable()
        .setManualAckMode(true)
        .setAckWait(this.ackWait)
        .setDurableName(this.queueGroupName);
    }
  //code to set up the subscription
    listen() {
      const subscription = this.client.subscribe(
        this.subject,
        this.queueGroupName,
        this.subscriptionOptions()
      );
    
  
      subscription.on('message', (msg: Message) => {
        console.log(
          `Message received: ${this.subject} /
          ${this.queueGroupName}`
        );
  
        const parsedData = this.parseMessage(msg);
  //customed function to fun when a message is received
  //defined in child class
        this.onMessage(parsedData, msg);
      });
    }
  //parse a message
    parseMessage(msg: Message) {
      const data = msg.getData();
      return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf8'));
    }
  
  }