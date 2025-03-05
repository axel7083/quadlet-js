import { $Errors, ParsingError } from './errors';
import type { IIniObject } from './interfaces/ini-object';
import type { IIniObjectSection } from './interfaces/ini-object-section';
import { autoType } from './helpers/auto-type';
import type { ICustomTyping } from './interfaces/custom-typing';
import { $Metadata } from './metadata';
import type { IniValue } from './types/ini-value';

export interface IParseConfig {
  comment?: string | string[];
  delimiter?: string;
  nothrow?: boolean;
  autoTyping?: boolean | ICustomTyping;
}

// Regex to capture section names in [section] lines.
const sectionNameRegex = /\[(.*)]$/;

export function parse(
  data: string,
  params: IParseConfig & { nothrow: true },
): IIniObject & {
  [$Errors]: ParsingError[];
};
export function parse(data: string, params?: IParseConfig): IIniObject;

export function parse(data: string, params: IParseConfig = {}): IIniObject {
  const { delimiter = '=', comment = ';', nothrow = false, autoTyping = true } = { ...params };

  // Determine the type parser function to use.
  const typeParser: ICustomTyping =
    typeof autoTyping === 'function' ? autoTyping : autoTyping ? autoType : (val: string): string => val;

  // Prepare the initial state.
  const lines: string[] = data.split(/\r?\n/g);
  let lineNumber = 0;
  let currentSection: string | undefined = undefined;
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

        // Initialize the section if it hasn't been set yet.
        if (!(currentSection in result)) {
          result[currentSection] = {
            [$Metadata]: {
              lineNumber,
            },
          };
        }
        continue;
      }
    }

    /**
     * Do not allow entry at root level
     */
    if (!currentSection) {
      recordError(new ParsingError(line, lineNumber));
      continue;
    }

    // Process key-value pair lines.
    if (line.includes(delimiter)) {
      const posOfDelimiter: number = line.indexOf(delimiter);
      const name: string = line.slice(0, posOfDelimiter).trim();
      const rawVal: string = line.slice(posOfDelimiter + 1).trim();

      let val: boolean | number | string | undefined;
      try {
        val = typeParser(rawVal, currentSection, name);
      } catch (err: unknown) {
        const error =
          err instanceof Error ? new ParsingError(line, lineNumber, err.message) : new ParsingError(line, lineNumber);
        recordError(error);
        continue;
      }

      // raise an error for undefined value (forbid empty entry)
      if (val === undefined) {
        recordError(new ParsingError(line, lineNumber));
        continue;
      }

      const iniValue: IniValue = {
        value: val,
        [$Metadata]: {
          lineNumber,
        },
      };

      const section: IIniObjectSection = result[currentSection];

      // Merge the key-value pair based on the selected strategy.
      if (name in section) {
        const oldVal = section[name];
        section[name] = Array.isArray(oldVal) ? [...oldVal, iniValue] : [oldVal, iniValue];
      } else {
        section[name] = iniValue;
      }
      continue;
    }

    // If the line doesn't match any valid pattern, record an error.
    recordError(new ParsingError(line, lineNumber));
  }

  return result;
}

export const decode = parse;
