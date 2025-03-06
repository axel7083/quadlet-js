import { QuadletDocument } from '../models/quadlet-document';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { QuadletType } from '@quadlet/types';
import { ParserWrapper } from './parser-wrapper';

export class DocumentsCache {
  // static instance (singleton)
  static #instance: DocumentsCache;

  // a mapping of URIs to cached documents
  #cache = new Map<string, QuadletDocument>();
  #parser: ParserWrapper = new ParserWrapper();

  public static getCache(): DocumentsCache {
    if (this.#instance) return this.#instance;
    else return new DocumentsCache();
  }

  public getQuadletDocument(document: TextDocument): QuadletDocument {
    return this.ensureCache(document);
  }

  dispose(): void {
    this.#cache.clear();
  }

  protected fromUri(uri: string): QuadletType {
    const sep = uri.lastIndexOf('.');
    if (sep === -1) throw new Error(`got uri without extension file: ${uri}`);

    const extension = uri.substring(sep + 1);

    const quadletType: QuadletType | undefined = Object.values(QuadletType).find(
      (quadlet: QuadletType) => quadlet.toLowerCase() === extension,
    );
    if (!quadletType) throw new Error(`cannot found corresponding QuadletType for extension ${extension}`);
    return quadletType;
  }

  protected ensureCache(text: TextDocument): QuadletDocument {
    const key = text.uri;
    // try to get the cache
    let entry = this.#cache.get(key);

    // if cache does not exist or is outdated let's update it
    if (!entry || entry.version !== text.version) {
      const type = this.fromUri(key);
      entry = {
        version: text.version,
        document: this.#parser.parse(type, text.getText()),
        type: type,
      };
      this.#cache.set(key, entry);
    }

    // return the entry
    return entry;
  }
}
