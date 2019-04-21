declare module 'frenchkiss' {
  type pluralRule = (count: number) => string;

  type missingVariableHandler = (
    variable: string,
    key: string,
    language: string
  ) => string;

  interface StoreData {
    [key: string]: string | number | StoreData;
  }

  interface CacheData {
    [key: string]: (
      params?: object,
      pluralRule?: pluralRule,
      key?: string,
      language?: string,
      missingVariableHandler?: missingVariableHandler
    ) => string;
  }

  interface CacheItems {
    [key: string]: CacheData;
  }

  interface StoreItems {
    [key: string]: string | number;
  }

  export const cache: CacheItems;
  export const store: StoreItems;
  export function t(key: string, params?: object, language?: string): string;
  export function onMissingKey(
    missingKeyHandler: (key: string) => string
  ): void;
  export function onMissingVariable(
    missingVariableHandler: missingVariableHandler
  ): void;
  export function locale(language?: string): string;
  export function fallback(language: string): string;
  export function unset(language: string): void;
  export function set(language: string, table: StoreData): void;
  export function extend(language: string, table: StoreData): void;
  export function plural(language: string, pluralRule: pluralRule): void;
}
