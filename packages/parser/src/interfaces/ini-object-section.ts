import type { IniValue } from '../types/ini-value';
import type { $Metadata } from '../metadata';

export interface IIniObjectSection {
  [index: string]: IniValue | Array<IniValue>;
  [$Metadata]: { lineNumber: number };
}
