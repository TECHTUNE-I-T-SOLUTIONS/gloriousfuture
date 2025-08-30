// Minimal declaration file to satisfy TypeScript when it expects a 'cookie' type library.
declare module 'cookie' {
  export function parse(str: string, options?: any): Record<string, string>;
  export function serialize(name: string, val: string, options?: any): string;
}
