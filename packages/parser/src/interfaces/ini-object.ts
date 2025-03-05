import type { $Errors, ParsingError } from '../errors';
import type { IIniObjectSection } from './ini-object-section';

export interface IIniObject {
  [$Errors]?: Array<ParsingError>;
  [index: string]: IIniObjectSection;
}
