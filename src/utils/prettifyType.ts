
/**
 * Type alias for a utility that creates a new type with the same shape as the given type `T`.
 * It's useful for improving the readability of complex types in error messages and IDE tooltips.
 *
 * @template T - The type to prettify.
 * @typedef {Object} Prettify
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};