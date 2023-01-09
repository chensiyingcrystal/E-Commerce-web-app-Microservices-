import { Subjects, Publisher, ExpirationCompleteEvent } from "@crystaltickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}