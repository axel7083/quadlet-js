import type { $Errors, ParsingError } from '../errors';
import type { IIniObjectSection } from './ini-object-section';
import type { $Proto } from '../proto';

export interface IIniObject extends IIniObjectSection {
  [$Errors]?: ParsingError[];
  [$Proto]?: IIniObjectSection;
}
