import type { IIniObject} from '@quadlet/parser';
import { parse } from '@quadlet/parser';
import {
  QuadletType,
  CONTAINER_KEYS,
  IMAGE_KEYS,
  POD_KEYS,
  NETWORK_KEYS,
  VOLUMES_KEYS,
  BUILD_KEYS,
  KUBE_KEYS,
  type ALL_KEYS,
} from '@quadlet/types';
import { IGNORED_SYSTEMD_SECTIONS } from './constants';

/**
 * Wrapper around {@link import('@quadlet/parser').parse} to validate fields
 * TODO: might be interesting to move this logic to the parser package?
 */
export class ParserWrapper {
  protected autoTypeContainer(key: string, val: string): boolean | number | string {
    // ensure the key is expected
    if (!CONTAINER_KEYS.has(key as ALL_KEYS)) throw new Error(`${key} cannot be use under Container section`);

    // additional synthax checks
    switch (key) {
      case 'Annotation':
        if (!val.includes('=')) throw new Error('format should be Annotation=name=value');
        return val;
      default:
        return val;
    }
  }

  protected autoTypeImage(key: string, val: string): boolean | number | string {
    // ensure the key is expected
    if (!IMAGE_KEYS.has(key as ALL_KEYS)) throw new Error(`${key} cannot be use under Image section`);

    return val;
  }

  protected autoTypePod(key: string, val: string): boolean | number | string {
    // ensure the key is expected
    if (!POD_KEYS.has(key as ALL_KEYS)) throw new Error(`${key} cannot be use under Pod section`);

    return val;
  }

  protected autoTypeVolume(key: string, val: string): boolean | number | string {
    // ensure the key is expected
    if (!VOLUMES_KEYS.has(key as ALL_KEYS)) throw new Error(`${key} cannot be use under Volume section`);

    return val;
  }
  protected autoTypeNetwork(key: string, val: string): boolean | number | string {
    // ensure the key is expected
    if (!NETWORK_KEYS.has(key as ALL_KEYS)) throw new Error(`${key} cannot be use under Network section`);

    return val;
  }
  protected autoTypeKube(key: string, val: string): boolean | number | string {
    // ensure the key is expected
    if (!KUBE_KEYS.has(key as ALL_KEYS)) throw new Error(`${key} cannot be use under Kube section`);

    return val;
  }
  protected autoTypeBuild(key: string, val: string): boolean | number | string {
    // ensure the key is expected
    if (!BUILD_KEYS.has(key as ALL_KEYS)) throw new Error(`${key} cannot be use under Build section`);

    return val;
  }

  protected autoType(type: QuadletType, val: string, section: string, key: string): boolean | number | string {
    // ignore some systemd sections
    if (IGNORED_SYSTEMD_SECTIONS.has(section)) return val;

    // redirect to appropriate section
    switch (type) {
      case QuadletType.CONTAINER:
        return this.autoTypeContainer(key, val);
      case QuadletType.IMAGE:
        return this.autoTypeImage(key, val);
      case QuadletType.POD:
        return this.autoTypePod(key, val);
      case QuadletType.VOLUME:
        return this.autoTypeVolume(key, val);
      case QuadletType.NETWORK:
        return this.autoTypeNetwork(key, val);
      case QuadletType.KUBE:
        return this.autoTypeKube(key, val);
      case QuadletType.BUILD:
        return this.autoTypeBuild(key, val);
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
