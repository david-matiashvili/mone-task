export class SuccessResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    timestamp: string;

    constructor(message: string, data?: T) {
        this.success = true;
        this.message = message;
        this.data = data;
        this.timestamp = new Date().toISOString();
    }
}
