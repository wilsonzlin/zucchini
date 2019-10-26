export class UserError extends Error {
  constructor (
    message: string,
    readonly extendedMessage?: string,
    readonly specificDetails?: string,
  ) {
    super(message);
  }
}
