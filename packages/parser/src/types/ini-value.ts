import type { $Metadata } from '../metadata';

export interface IniValue {
  value: string | number | boolean;
  [$Metadata]: { lineNumber: number };
}
