import { beforeEach, expect, test } from 'vitest';
import { ValidationService } from './validation-service';
import { TextDocument } from 'vscode-languageserver-textdocument';

let validation: ValidationService;
beforeEach(() => {
  validation = new ValidationService();
});

function fromString(content: string, languageId = 'quadlet'): TextDocument {
  return TextDocument.create('potatoes.container', languageId, 0, content);
}

test('key without section ', async () => {
  const errors = await validation.doValidation(fromString('Annotation=foo=bar'));
  expect(errors).toEqual([
    {
      message: 'Unsupported type of line: [1] "Annotation=foo=bar"',
      range: {
        end: {
          character: 18,
          line: 1,
        },
        start: {
          character: 0,
          line: 1,
        },
      },
    },
  ]);
}, {
  skip: true,
});
