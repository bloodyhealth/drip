export const isObject = (obj) => {
  const isArray = Array.isArray(obj)
  const isFunction =
    typeof obj === 'function' && obj.constructor.name !== 'Object'

  return obj === Object(obj) && !(isArray || isFunction)
}
