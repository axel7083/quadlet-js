import type { TextDocument } from 'vscode-languageserver-textdocument';
import type { Hover, Position } from 'vscode-languageserver-types';
import { Range } from 'vscode-languageserver-types';
import { DocumentsCache } from '../utils/documents-cache';
import { $Metadata } from '@quadlet/parser';

export class HoverService {
  #cache: DocumentsCache;
  constructor() {
    this.#cache = DocumentsCache.getCache();
  }

  async doHover(document: TextDocument, position: Position): Promise<Hover | null> {
    const content = this.#cache.getQuadletDocument(document).document;
    for (let [section] of Object.entries(content)) {
      // check if we hover a section
      if (content[section][$Metadata].lineNumber - 1 === position.line) {
        return {
          range: Range.create(position, position),
          contents: {
            kind: 'plaintext',
            value: `Hover section ${section}`,
          },
        };
      }

      // TODO: check for hovering on values
      /*for (let [, values] of Object.entries(obj)) {

        const iniValue: IniValue | Array<IniValue> = values;
        if(Array.isArray(iniValue)) {
          const target = iniValue.find((value) => value[$Metadata].lineNumber === position.line);
        } else {

        }

      }*/
    }

    return {
      range: Range.create(position, position),
      contents: {
        kind: 'plaintext',
        value: `Hovering nothing :(`,
      },
    };
  }
}
