interface ErrorInterface {
  _error: {}
  readonly json: any
  readonly error: string
  readonly errorDescription: string
  readonly statusCode: number
  find(error: string): any
}

export default ErrorInterface
