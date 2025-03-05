import { TextDocument } from 'vscode-languageserver-textdocument';
import { Hover, Position, Range } from 'vscode-languageserver-types';

export class HoverService {
  async doHover(document: TextDocument, position: Position): Promise<Hover | null> {
    return {
      range: Range.create(position, position),
      contents: {
        kind: 'plaintext',
        value: 'Hello world',
      },
    };
  }
}
