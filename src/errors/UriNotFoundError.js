export class UriNotFoundError extends Error {
  constructor(message, request) {
    super(message);
    this.request = request;
  }
}
