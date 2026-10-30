export const mergeDeep = (baseObj, overrideObj) => {
  /**
   * Merges the `source` object into the `destination` object.
   * Taken from https://github.com/remeda/remeda/blob/main/packages/remeda/src/mergeDeep.ts
   *
   * @param baseObj - The object to merge into. In general, this object would have it's values overridden.
   * @param overrideObj - The object to merge from. In general, shared keys would be taken from this object.
   * @returns The merged object.
   * @example
   *    R.mergeDeep({ foo: 'bar', x: 1 }, { foo: 'baz', y: 2 }) // => { foo: 'baz', x: 1, y: 2 }
   */

  // Merge objects, but no deep merge yet.
  const result = { ...baseObj, ...overrideObj }
  for (const key in overrideObj) {
    if (!(key in baseObj)) {
      // They don't share this key. Nothing to do.
      continue
    }
    const baseObjValue = baseObj[key]
    if (!isPlainObject(baseObjValue)) {
      // The value in baseObj is not a mergable object so the value from
      // overrideObj (which was already copied in the shallow merge) would be used
      // as-is.
      continue
    }

    const overrideObjValue = overrideObj[key]
    if (!isPlainObject(overrideObjValue)) {
      // The value in overrideObj is not a mergable object either, so it will
      // override the object in baseObj.
      continue
    }

    // Both baseObj and overrideObj have a mergable object for this key, so we
    // recursively merge them.
    result[key] = mergeDeep(baseObjValue, overrideObjValue)
  }

  return result
}

export function isPlainObject(data) {
  // helper function to determine whether the data is a plain object
  if (typeof data !== 'object' || data === null) {
    return false
  }
  const proto = Object.getPrototypeOf(data)
  return proto === null || proto === Object.prototype
}
