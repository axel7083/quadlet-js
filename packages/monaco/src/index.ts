import { fromPosition, toHover, toMarkerData } from 'monaco-languageserver-types';
import { registerMarkerDataProvider } from 'monaco-marker-data-provider';
import type { editor, IDisposable, MonacoEditor } from 'monaco-types';
import { createWorkerManager } from 'monaco-worker-manager';
import type { Diagnostic } from 'vscode-languageserver-types';

import { type YAMLWorker } from './yaml.worker.js';
import { QuadletType } from '@quadlet/types';

export interface MonacoYamlOptions {
  validate?: boolean;
}

export interface MonacoYaml extends IDisposable {
  /**
   * Recondigure `monaco-yaml`.
   */
  update: (options: MonacoYamlOptions) => Promise<undefined>;
}

export const QUADLET_EXTENSIONS = Object.values(QuadletType).map(type => type.toLowerCase());

/**
 * Configure `monaco-yaml`.
 *
 * > **Note**: There may only be one configured instance of `monaco-yaml` at a time.
 *
 * @param monaco
 *   The Monaco editor module. Typically you get this by importing `monaco-editor`. Third party
 *   integrations often expose it as the global `monaco` variable instead.
 * @param options
 *   Options to configure `monaco-yaml`
 * @returns
 *   A disposable object that can be used to update `monaco-yaml`
 */
export function configureMonacoYaml(monaco: MonacoEditor, options?: MonacoYamlOptions): MonacoYaml {
  const createData: MonacoYamlOptions = {
    validate: true,
    ...options,
  };

  // register quadlet language (E.g. .container, .image etc.)
  monaco.languages.register({
    id: 'quadlet',
    extensions: QUADLET_EXTENSIONS.map(extension => `.${extension}`),
    aliases: QUADLET_EXTENSIONS,
  });

  const workerManager = createWorkerManager<YAMLWorker, MonacoYamlOptions>(monaco, {
    label: 'quadlet',
    moduleId: '@quadlet/monaco/yaml.worker',
    createData,
  });

  const diagnosticMap = new WeakMap<editor.ITextModel, Diagnostic[] | undefined>();

  const markerDataProvider = registerMarkerDataProvider(monaco, 'quadlet', {
    owner: 'quadlet',

    async provideMarkerData(model) {
      const worker = await workerManager.getWorker(model.uri);
      const diagnostics = await worker.doValidation(String(model.uri));

      diagnosticMap.set(model, diagnostics);

      return diagnostics?.map(toMarkerData);
    },

    async doReset(model) {
      const worker = await workerManager.getWorker(model.uri);
      await worker.resetSchema(String(model.uri));
    },
  });

  const disposables = [
    workerManager,
    markerDataProvider,

    monaco.languages.registerHoverProvider('quadlet', {
      async provideHover(model, position) {
        console.log('[provideHover]', model.uri);

        const worker = await workerManager.getWorker(model.uri);
        const info = await worker.doHover(String(model.uri), fromPosition(position));

        if (info) {
          return toHover(info);
        }
        return undefined;
      },
    }),

    monaco.languages.setMonarchTokensProvider('quadlet', {
      tokenizer: {
        root: [
          [/^\s*\[.*\]\s*$/, 'keyword'], // Sections
          [/^\s*#.*$/, 'comment'], // Comments
          [/(\w+)(\s*=\s*)(.*)/, ['attribute.name', 'delimiter', 'string']], // Key-value pairs
        ],
      },
    }),

    monaco.languages.setLanguageConfiguration('quadlet', {
      comments: {
        lineComment: '#',
      },
      brackets: [['[', ']']],
      autoClosingPairs: [{ open: '[', close: ']' }],
    }),

    /* monaco.languages.registerCompletionItemProvider('yaml', {
      triggerCharacters: [' ', ':'],

      async provideCompletionItems(model, position) {
        const wordInfo = model.getWordUntilPosition(position)
        const worker = await workerManager.getWorker(model.uri)
        const info = await worker.doComplete(String(model.uri), fromPosition(position))

        if (info) {
          return toCompletionList(info, {
            range: {
              startLineNumber: position.lineNumber,
              startColumn: wordInfo.startColumn,
              endLineNumber: position.lineNumber,
              endColumn: wordInfo.endColumn
            }
          })
        }
        return undefined;
      }
    }),

    monaco.languages.registerDefinitionProvider('yaml', {
      async provideDefinition(model, position) {
        const worker = await workerManager.getWorker(model.uri)
        const locationLinks = await worker.doDefinition(String(model.uri), fromPosition(position))

        return locationLinks?.map(toLocationLink)
      }
    }),

    monaco.languages.registerDocumentSymbolProvider('yaml', {
      displayName: 'yaml',

      async provideDocumentSymbols(model) {
        const worker = await workerManager.getWorker(model.uri)
        const items = await worker.findDocumentSymbols(String(model.uri))

        return items?.map(toDocumentSymbol)
      }
    }),

    monaco.languages.registerDocumentFormattingEditProvider('yaml', {
      displayName: 'yaml',

      async provideDocumentFormattingEdits(model) {
        const worker = await workerManager.getWorker(model.uri)
        const edits = await worker.format(String(model.uri))

        return edits?.map(toTextEdit)
      }
    }),

    monaco.languages.registerLinkProvider('yaml', {
      async provideLinks(model) {
        const worker = await workerManager.getWorker(model.uri)
        const links = await worker.findLinks(String(model.uri))

        if (links) {
          return {
            links: links.map(toLink)
          }
        }
        return undefined;
      }
    }),

    monaco.languages.registerCodeActionProvider('yaml', {
      async provideCodeActions(model, range, context) {
        const worker = await workerManager.getWorker(model.uri)
        const codeActions = await worker.getCodeAction(String(model.uri), fromRange(range), {
          diagnostics:
            diagnosticMap
              .get(model)
              ?.filter((diagnostic) => range.intersectRanges(toRange(diagnostic.range))) || [],
          only: context.only ? [context.only] : undefined,
          triggerKind: fromCodeActionTriggerType(context.trigger)
        })

        if (codeActions) {
          return {
            actions: codeActions.map(toCodeAction),
            dispose() {
              // This is required by the TypeScript interface, but it’s not implemented.
            }
          }
        }
        return undefined;
      }
    }),

    monaco.languages.registerFoldingRangeProvider('yaml', {
      async provideFoldingRanges(model) {
        const worker = await workerManager.getWorker(model.uri)
        const foldingRanges = await worker.getFoldingRanges(String(model.uri))

        return foldingRanges?.map(toFoldingRange)
      }
    }),

    monaco.languages.setLanguageConfiguration('yaml', {
      comments: {
        lineComment: '#'
      },
      brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')']
      ],
      autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" }
      ],
      surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" }
      ]
    }),

    monaco.languages.registerOnTypeFormattingEditProvider('yaml', {
      autoFormatTriggerCharacters: ['\n'],

      async provideOnTypeFormattingEdits(model, position, ch, formattingOptions) {
        const worker = await workerManager.getWorker(model.uri)
        const edits = await worker.doDocumentOnTypeFormatting(
          String(model.uri),
          fromPosition(position),
          ch,
          fromFormattingOptions(formattingOptions)
        )

        return edits?.map(toTextEdit)
      }
    }),

    monaco.languages.registerSelectionRangeProvider('yaml', {
      async provideSelectionRanges(model, positions) {
        const worker = await workerManager.getWorker(model.uri)
        const selectionRanges = await worker.getSelectionRanges(
          String(model.uri),
          positions.map(fromPosition)
        )

        return selectionRanges?.map(toSelectionRanges)
      }
    }) */
  ];

  return {
    dispose() {
      for (const disposable of disposables) {
        disposable.dispose();
      }
    },

    async update(newOptions) {
      workerManager.updateCreateData(Object.assign(createData, newOptions));
      await markerDataProvider.revalidate();
    },
  };
}
