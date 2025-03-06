export interface ICustomTyping {
  (val: string, section: string, key: string): boolean | number | string | undefined;
}
