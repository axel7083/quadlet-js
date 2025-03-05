export interface ICustomTyping {
  (val: string, section: string | symbol, key: string): boolean | number | string | undefined;
}
