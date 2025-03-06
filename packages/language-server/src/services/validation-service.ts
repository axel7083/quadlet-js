import type { TextDocument } from 'vscode-languageserver-textdocument';
import type { Diagnostic } from 'vscode-languageserver-types';
import { Range } from 'vscode-languageserver-types';
import { $Metadata, IIniObject, type IIniObjectSection, ParsingError } from '@quadlet/parser';
import { $Errors } from '@quadlet/parser';
import { DocumentsCache } from '../utils/documents-cache';
import { QuadletDocument } from '../models/quadlet-document';
import { IGNORED_SYSTEMD_SECTIONS } from '../utils/constants';
import { QuadletType } from '@quadlet/types';

export class ValidationService {
  #cache: DocumentsCache;

  constructor() {
    this.#cache = DocumentsCache.getCache();
  }

  protected parsingErrorToDiagnostic(errors: Array<ParsingError>): Array<Diagnostic> {
    return errors.map(err => ({
      /**
       * The {@link Diagnostic} uses an LSP range which is different from a monaco.Range
       *
       * - LSP range starts lines at **zero**
       * - monaco.Range starts lines at **one**
       */
      range: Range.create(err.lineNumber - 1, 0, err.lineNumber - 1, err.line.length),
      message: err.message,
      code: err.line,
    }));
  }

  /**
   * Validate the container section
   * @remarks it checks that the mandatory fields are present (Here Image)
   * @param container
   * @protected
   */
  protected validateContainerSection(container: IIniObjectSection): Array<Diagnostic> {
    if (!('Image' in container)) {
      const line = container[$Metadata].lineNumber - 1;
      return [
        {
          range: Range.create(line, 0, line, '[Container]'.length),
          message: 'Missing Image required property',
        },
      ];
    }
    return [];
  }

  protected validate(quadlet: QuadletDocument): Array<Diagnostic> {
    let output: Array<Diagnostic> = [];

    const ini: IIniObject = quadlet.document;

    // Validate sections (E.g. [Image] on Container Quadlets is not allowed)
    for (const [section, content] of Object.entries(ini)) {
      // ignore some systemd sections
      if (IGNORED_SYSTEMD_SECTIONS.has(section)) continue;

      if (section !== quadlet.type) {
        const line = content[$Metadata].lineNumber - 1;
        output.push({
          range: Range.create(line, 0, line, section.length + 2), // We add 2 for the [] around the section name
          message: `Section ${section} not allowed on ${quadlet.type} Quadlet`,
        });
      }
    }

    switch (quadlet.type) {
      case QuadletType.CONTAINER:
        output.push(...this.validateContainerSection(ini[QuadletType.CONTAINER]));
        break;
      case QuadletType.IMAGE:
      case QuadletType.POD:
      case QuadletType.VOLUME:
      case QuadletType.NETWORK:
      case QuadletType.KUBE:
      case QuadletType.BUILD:
        break;
    }

    return output;
  }

  public async doValidation(document: TextDocument): Promise<Diagnostic[]> {
    const quadlet: QuadletDocument = this.#cache.getQuadletDocument(document);
    return [...this.parsingErrorToDiagnostic(quadlet.document[$Errors] ?? []), ...this.validate(quadlet)];
  }
}
