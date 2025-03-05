import type { IIniObjectDataSection } from './ini-object-data-section';
// eslint-disable-next-line import/no-cycle
import type { IIniObjectSection } from '../interfaces/ini-object-section';

export type IniValue = string | number | boolean | IIniObjectSection | IIniObjectDataSection;
