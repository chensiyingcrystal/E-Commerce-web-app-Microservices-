import { CustomError } from "./custom-error";

export class NotAuthroizedError extends CustomError {
    statusCode = 401;

    constructor() {
        super('Not authroized');
        Object.setPrototypeOf(this, NotAuthroizedError.prototype);
    }
    
    serializeErrors() {
        return [{ message: "Not authorized "}];
    }
}