import { initialize } from 'monaco-worker-manager/worker';
import { TextDocument } from 'vscode-languageserver-textdocument';
import {
  type CodeAction,
  type CodeActionContext,
  type CompletionList,
  type Diagnostic,
  type DocumentLink,
  type DocumentSymbol,
  type FoldingRange,
  type FormattingOptions,
  type Hover,
  type LocationLink,
  type Position,
  type Range,
  type SelectionRange,
  type TextEdit,
} from 'vscode-languageserver-types';

import { type MonacoYamlOptions } from './index.js';
import { getLanguageService } from '@quadlet/language-server';

export interface YAMLWorker {
  /**
   * Validate a document.
   */
  doValidation: (uri: string) => Diagnostic[] | undefined;

  /**
   * Get completions in a YAML document.
   */
  doComplete: (uri: string, position: Position) => CompletionList | undefined;

  /**
   * Get definitions in a YAML document.
   */
  doDefinition: (uri: string, position: Position) => LocationLink[] | undefined;

  /**
   * Get hover information in a YAML document.
   */
  doHover: (uri: string, position: Position) => Hover | null | undefined;

  /**
   * Get formatting edits when the user types in a YAML document.
   */
  doDocumentOnTypeFormatting: (
    uri: string,
    position: Position,
    ch: string,
    options: FormattingOptions,
  ) => TextEdit[] | undefined;

  /**
   * Format a YAML document using Prettier.
   */
  format: (uri: string) => TextEdit[] | undefined;

  /**
   * Reset the schema state for a YAML document.
   */
  resetSchema: (uri: string) => boolean;

  /**
   * Get document symbols in a YAML document.
   */
  findDocumentSymbols: (uri: string) => DocumentSymbol[] | undefined;

  /**
   * Get links in a YAML document.
   */
  findLinks: (uri: string) => DocumentLink[] | undefined;

  /**
   * Get code actions in a YAML document.
   */
  getCodeAction: (uri: string, range: Range, context: CodeActionContext) => CodeAction[] | undefined;

  /**
   * Get folding ranges in a YAML document.
   */
  getFoldingRanges: (uri: string) => FoldingRange[] | null | undefined;

  /**
   * Get selection ranges in a YAML document
   */
  getSelectionRanges: (uri: string, positions: Position[]) => SelectionRange[] | undefined;
}

initialize<YAMLWorker, MonacoYamlOptions>((ctx, _languageSettings) => {
  const withDocument =
    <A extends unknown[], R>(fn: (document: TextDocument, ...args: A) => R) =>
    (uri: string, ...args: A) => {
      const models = ctx.getMirrorModels();
      for (const model of models) {
        if (String(model.uri) === uri) {
          console.log('withDocument', model);
          return fn(TextDocument.create(uri, 'quadlet', model.version, model.getValue()), ...args);
        }
      }
      return undefined;
    };

  const service = getLanguageService();

  return {
    doValidation: withDocument(service.doValidation),

    doComplete: withDocument((document, position) => undefined),

    doDefinition: withDocument((document, position) => undefined),

    doDocumentOnTypeFormatting: withDocument((document, position, ch, options) => undefined),

    doHover: withDocument(service.doHover),

    format: withDocument(() => undefined),

    resetSchema: (): boolean => true,

    findDocumentSymbols: withDocument(() => undefined),

    findLinks: withDocument(() => undefined),

    getCodeAction: withDocument((document, range, context) => undefined),

    getFoldingRanges: withDocument(document => undefined),

    getSelectionRanges: withDocument(() => undefined),
  };
});
