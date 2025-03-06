import { IIniObject, parse } from '@quadlet/parser';
import { QuadletType } from '@quadlet/types';
import { IGNORED_SYSTEMD_SECTIONS } from './constants';

/**
 * Wrapper around {@link import('@quadlet/parser').parse} to validate fields
 * TODO: might be interesting to move this logic to the parser package?
 */
export class ParserWrapper {
  protected autoTypeContainer(key: string, val: string): boolean | number | string {
    switch (key) {
      case 'Image':
        return val;
      case 'Annotation':
        if (!val.includes('=')) throw new Error('format should be Annotation=name=value');
        return val;
      default:
        throw new Error(`unknown key ${key}`);
    }
  }

  protected autoType(type: QuadletType, val: string, section: string, key: string): boolean | number | string {
    // ignore some systemd sections
    if (IGNORED_SYSTEMD_SECTIONS.has(section)) return val;

    // redirect to appropriate section
    switch (type) {
      case QuadletType.CONTAINER:
        return this.autoTypeContainer(key, val);
      case QuadletType.IMAGE:
      case QuadletType.POD:
      case QuadletType.VOLUME:
      case QuadletType.NETWORK:
      case QuadletType.KUBE:
      case QuadletType.BUILD:
        throw new Error('not supported');
    }
  }

  public parse(type: QuadletType, content: string): IIniObject {
    return parse(content, {
      nothrow: true,
      comment: ['#', ';'],
      autoTyping: this.autoType.bind(this, type),
    });
  }
}
