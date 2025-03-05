import { beforeEach, test, expect } from 'vitest';
import { ValidationService } from './validation-service';
import { TextDocument } from 'vscode-languageserver-textdocument';

let validation: ValidationService;
beforeEach(() => {
  validation = new ValidationService();
});

function fromString(content: string, languageId = ''): TextDocument {
  return TextDocument.create('fake-uri', languageId, 0, content);
}

test(
  'key without section ',
  async () => {
    const errors = await validation.doValidation(fromString('Annotation=foo=bar', 'container'));
    expect(errors).toHaveLength(1);
  },
  {
    skip: true,
  },
);

test('simple ini ', async () => {
  const errors = await validation.doValidation(fromString('[Container]\nAnnotation=foo=bar', 'container'));
  expect(errors).toHaveLength(0);
});
