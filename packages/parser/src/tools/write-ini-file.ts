import { promises as fs } from 'node:fs';
import type { IStringifyConfig } from '../index';
import { stringify } from '../index';
import type { IIniObject } from '../interfaces/ini-object';

export function writeIniFile(path: string, ini: IIniObject, config: IStringifyConfig): Promise<void> {
  const data = stringify(ini, config);
  return fs.writeFile(path, data, 'utf-8');
}
