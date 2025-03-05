import type { TextDocument } from 'vscode-languageserver-textdocument';
import type { Position, Hover, Diagnostic } from 'vscode-languageserver-types';

export interface LanguageService {
  // configure: (settings: LanguageSettings) => void;
  // doComplete: (document: TextDocument, position: Position, isKubernetes: boolean) => Promise<CompletionList>;
  doValidation: (document: TextDocument) => Promise<Diagnostic[]>;
  doHover: (document: TextDocument, position: Position) => Promise<Hover | null>;
}
