import type { IIniObject } from '@quadlet/parser';
import type { QuadletType } from '@quadlet/types';

export interface QuadletDocument {
  version: number;
  document: IIniObject;
  type: QuadletType;
}
