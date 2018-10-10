interface ErrorInterface {
    _error: string;
    find(error: string): any;
    readonly json: any;
    readonly error: string;
    readonly errorDescription: string;
    readonly statusCode: Number;
}

export default ErrorInterface