import { $Errors, ParsingError, ProtoError } from './errors';
import type { IIniObject } from './interfaces/ini-object';
import type { IniValue } from './types/ini-value';
import type { IIniObjectSection } from './interfaces/ini-object-section';
import { autoType } from './helpers/auto-type';
import type { ICustomTyping } from './interfaces/custom-typing';
import { $Proto } from './proto';

export const KeyMergeStrategies = {
  OVERRIDE: 'override',
  JOIN_TO_ARRAY: 'join-to-array',
} as const;
export type KeyMergeStrategyName = (typeof KeyMergeStrategies)[keyof typeof KeyMergeStrategies];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type KeyMergeStrategyFunction = (section: IIniObjectSection, name: string, value: any) => void;

export interface IParseConfig {
  comment?: string | string[];
  delimiter?: string;
  nothrow?: boolean;
  autoTyping?: boolean | ICustomTyping;
  keyMergeStrategy?: KeyMergeStrategyName | KeyMergeStrategyFunction;
  dataSections?: string[];
  protoSymbol?: boolean;
}

// Regex to capture section names in [section] lines.
const sectionNameRegex = /\[(.*)]$/;

export function parse(data: string, params?: IParseConfig): IIniObject {
  const {
    delimiter = '=',
    comment = ';',
    nothrow = false,
    autoTyping = true,
    dataSections = [],
    protoSymbol = false,
    keyMergeStrategy = KeyMergeStrategies.OVERRIDE,
  } = { ...params };

  // Determine the type parser function to use.
  const typeParser: ICustomTyping =
    typeof autoTyping === 'function' ? autoTyping : autoTyping ? autoType : (val: string): string => val;

  // Identify which key merge strategy is in use.
  const isOverrideStrategy = keyMergeStrategy === KeyMergeStrategies.OVERRIDE;
  const isJoinStrategy = !isOverrideStrategy && keyMergeStrategy === KeyMergeStrategies.JOIN_TO_ARRAY;
  const isCustomStrategy = !isOverrideStrategy && !isJoinStrategy && typeof keyMergeStrategy === 'function';

  // Prepare the initial state.
  const lines: string[] = data.split(/\r?\n/g);
  let lineNumber = 0;
  let currentSection = '';
  let isDataSection = false;
  const result: IIniObject = {};
  const commentChars = Array.isArray(comment) ? comment : [comment];

  // Helper to record errors either by throwing or by accumulating.
  function recordError(error: ParsingError): void {
    if (!nothrow) {
      throw error;
    } else if ($Errors in result) {
      (result[$Errors] as ParsingError[]).push(error);
    } else {
      result[$Errors] = [error];
    }
  }

  // Process each line in the input data.
  for (const rawLine of lines) {
    lineNumber++;
    const line = rawLine.trim();

    // Skip empty lines and comments.
    if (line.length === 0 || commentChars.some(char => line.startsWith(char))) {
      continue;
    }

    // Check for section header lines.
    if (line.startsWith('[')) {
      const match = line.match(sectionNameRegex);
      if (match) {
        currentSection = match[1].trim();

        // Special handling for '__proto__' section.
        if (currentSection === '__proto__') {
          if (protoSymbol) {
            currentSection = $Proto as unknown as string;
          } else {
            throw new ProtoError(lineNumber);
          }
        }

        // Determine if this section should be treated as a data section.
        isDataSection = dataSections.includes(currentSection);

        // Initialize the section if it hasn't been set yet.
        if (!(currentSection in result)) {
          // Use an array for data sections; otherwise, use a plain object.
          // eslint-disable-next-line no-null/no-null
          result[currentSection] = isDataSection ? [] : Object.create(null);
        }
        continue;
      }
    }

    // If currently in a data section, simply store the raw line.
    if (isDataSection) {
      (result[currentSection] as IniValue[]).push(rawLine);
      continue;
    }

    // Process key-value pair lines.
    if (line.includes(delimiter)) {
      const posOfDelimiter = line.indexOf(delimiter);
      const name = line.slice(0, posOfDelimiter).trim();
      const rawVal = line.slice(posOfDelimiter + 1).trim();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let val: any;
      try {
        val = typeParser(rawVal, currentSection, name);
      } catch (err: unknown) {
        const error =
          err instanceof Error ? new ParsingError(line, lineNumber, err.message) : new ParsingError(line, lineNumber);
        recordError(error);
        continue;
      }

      // Determine the target section or use the root if not inside any section.
      const section = currentSection !== '' ? (result[currentSection] as IIniObjectSection) : result;

      // Merge the key-value pair based on the selected strategy.
      if (isOverrideStrategy) {
        section[name] = val;
      } else if (isJoinStrategy) {
        if (name in section) {
          const oldVal = section[name];
          section[name] = Array.isArray(oldVal) ? [...oldVal, val] : [oldVal, val];
        } else {
          section[name] = val;
        }
      } else if (isCustomStrategy) {
        keyMergeStrategy(section, name, val);
      }
      continue;
    }

    // If the line doesn't match any valid pattern, record an error.
    recordError(new ParsingError(line, lineNumber));
  }

  return result;
}

export const decode = parse;
