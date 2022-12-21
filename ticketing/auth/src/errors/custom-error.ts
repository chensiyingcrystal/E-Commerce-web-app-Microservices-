export abstract class CustomError extends Error {
    abstract statusCode: number; //abstract: subclass must implement this 

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    abstract serializeErrors(): {
        message: string;
        field?: string
    }[];
}