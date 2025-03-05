import { ParsingError } from 'js-ini';

export function isParsingError(value: unknown): value is ParsingError {
  return value instanceof ParsingError;
}
