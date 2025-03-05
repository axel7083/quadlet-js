import { expect, test, describe } from 'vitest';
import type { IIniObject } from './interfaces/ini-object';
import { parse } from './parse';
import { $Errors, ParsingError } from './errors';
import { $Metadata } from './metadata';

describe('parsing successfully', () => {
  interface TestCase {
    content: string;
    expected: IIniObject;
    name: string;
  }

  test.each<TestCase>([
    {
      content: '[foo]',
      expected: {
        foo: {
          [$Metadata]: {
            lineNumber: 1,
          },
        },
      },
      name: 'empty section',
    },
    {
      content: '\n[foo]',
      expected: {
        foo: {
          [$Metadata]: {
            lineNumber: 2,
          },
        },
      },
      name: 'empty section starting at line 2',
    },
    {
      content: '[foo]\n[bar]',
      expected: {
        foo: {
          [$Metadata]: {
            lineNumber: 1,
          },
        },
        bar: {
          [$Metadata]: {
            lineNumber: 2,
          },
        },
      },
      name: 'consecutive empty section',
    },
    {
      content: '[foo]\nfoo=bar',
      expected: {
        foo: {
          foo: {
            value: 'bar',
            [$Metadata]: {
              lineNumber: 2,
            },
          },
          [$Metadata]: {
            lineNumber: 1,
          },
        },
      },
      name: 'section with single entry',
    },
    {
      content: '[foo]\nfoo=bar\n[bar]\nhello=world',
      expected: {
        foo: {
          foo: {
            value: 'bar',
            [$Metadata]: {
              lineNumber: 2,
            },
          },
          [$Metadata]: {
            lineNumber: 1,
          },
        },
        bar: {
          [$Metadata]: {
            lineNumber: 3,
          },
          hello: {
            value: 'world',
            [$Metadata]: {
              lineNumber: 4,
            },
          },
        },
      },
      name: 'multi section',
    },
    {
      content: '[foo]\nfoo=bar\nfoo=bor',
      expected: {
        foo: {
          foo: [
            {
              value: 'bar',
              [$Metadata]: {
                lineNumber: 2,
              },
            },
            {
              value: 'bor',
              [$Metadata]: {
                lineNumber: 3,
              },
            },
          ],
          [$Metadata]: {
            lineNumber: 1,
          },
        },
      },
      name: 'section with repeating entry',
    },
  ])('$name', ({ content, expected }) => {
    expect(parse(content)).toEqual(expected);
  });
});

interface ErrorTestCase {
  content: string;
  errors: Array<ParsingError>;
  name: string;
}

describe.each<ErrorTestCase>([
  {
    content: 'foo=bar',
    name: 'entry at root level',
    errors: [new ParsingError('foo=bar', 1)],
  },
])('parsing error', ({ errors, content }) => {
  test('validating $name', () => {
    // ensure we have at least one error in the array
    expect(errors.length).toBeGreaterThan(0);
  });

  test('using nothrow - $name', () => {
    const result = parse(content, { nothrow: true });
    expect(result[$Errors]).toEqual(errors);
  });

  test('should throw the first error - $name', () => {
    expect(() => {
      parse(content);
    }).toThrowError(errors[0]);
  });
});
