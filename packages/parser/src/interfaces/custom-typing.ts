export interface ICustomTyping {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (val: string, section: string | symbol, key: string): any;
}
