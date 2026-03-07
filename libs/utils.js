/**
 * Compares if 2 arrays are equal using === on each element
 * @template T
 * @param {T[]} arr1
 * @param {T[]} arr2
 * @return {boolean} Whether the arrays are equal
 */
export function arrEq(arr1, arr2) {
  return arr1.length == arr2.length
    && arr1.every((v, i) => v === arr2[i])
}

/**
 * Creates a 2-element Tuple
 * @template T,U
 * @overload
 * @param {T} e1 The first element
 * @param {U} e2 The second element
 * @return {[T, U]} The Tuple
 */
/**
 * Creates a 3-element Tuple
 * @template T,U,V
 * @overload
 * @param {T} e1 The first element
 * @param {U} e2 The second element
 * @param {V} e3 The third element
 * @return {[T, U]} The Tuple
 */
/**
 * @param  {...any} args
 */
export function tup(...args) {
  return Object.freeze(args)
}
