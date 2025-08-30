// Minimal local declaration to satisfy TypeScript when @types/minimatch isn't resolved.
// This mirrors the typical exported function signature used by downstream packages.

declare module 'minimatch' {
  interface IMinimatchOptions {
    nocase?: boolean;
    dot?: boolean;
    flipNegate?: boolean;
  }

  function minimatch(path: string, pattern: string, options?: IMinimatchOptions): boolean;
  namespace minimatch {
    export function makeRe(pattern: string, options?: IMinimatchOptions): RegExp | false;
    export const GLOBSTAR: symbol;
  }

  export = minimatch;
}
