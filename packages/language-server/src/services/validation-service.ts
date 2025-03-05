import type { TextDocument } from 'vscode-languageserver-textdocument';
import type { Diagnostic } from 'vscode-languageserver-types';
import { Range } from 'vscode-languageserver-types';
import type { IIniObject } from '@quadlet/parser';
import { $Errors, parse } from '@quadlet/parser';

export class ValidationService {
  public async doValidation(document: TextDocument): Promise<Diagnostic[]> {
    const content: IIniObject = parse(document.getText(), {
      nothrow: true,
      comment: ['#', ';'],
    });

    return (content[$Errors] ?? []).map(err => ({
      range: Range.create(err.lineNumber, 0, err.lineNumber, err.line.length),
      message: err.message,
    }));
  }
}
