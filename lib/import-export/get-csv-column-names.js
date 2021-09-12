import { getSchema } from '../../db'

export default function getColumnNamesForCsv() {
  return getPrefixedKeys('CycleDay')

  function getPrefixedKeys(schemaName, prefix) {
    const schema = getSchema()
    const model = schema[schemaName]
    return Object.keys(model).reduce((acc, key) => {
      // we don't want to include isCycleStart, because that is
      // a derived value
      if (key === 'isCycleStart') return acc
      const prefixedKey = prefix ? [prefix, key].join('.') : key
      const childSchemaName = model[key].objectType
      if (!childSchemaName) {
        acc.push(prefixedKey)
        return acc
      }
      acc.push(...getPrefixedKeys(childSchemaName, prefixedKey))
      return acc
    }, [])
  }
}
