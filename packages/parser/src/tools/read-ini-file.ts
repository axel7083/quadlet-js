import { promises as fs } from 'node:fs';
import type { IIniObject, IParseConfig } from '../index';
import { parse } from '../index';

export async function readIniFile(path: string, config: IParseConfig): Promise<IIniObject> {
  const data = await fs.readFile(path, 'utf-8');
  return parse(data, config);
}
