import { mergeDeep } from '../../common/object'
jest.mock('../../local-storage', () => ({
  periodPredictionObservable: true,
}))

describe('merge container styles', () => {
  test('merges styles for existing keys', () => {
    const baseObj = {
      '2025-06-12': {
        customStyles: {
          container: {
            backgroundColor: '#cf323d',
            paddingTop: 2.7411764705882353,
          },
          text: {
            color: '#E9F2ED',
          },
        },
      },
    }

    const overrideObj = {
      '2025-06-12': {
        customStyles: {
          container: {
            backgroundColor: '#ffffff',
            paddingBottom: 10,
          },
        },
      },
    }

    const expected = {
      '2025-06-12': {
        customStyles: {
          container: {
            backgroundColor: '#ffffff', // Merged
            paddingTop: 2.7411764705882353,
            paddingBottom: 10, // Added
          },
          text: {
            color: '#E9F2ED',
          },
        },
      },
    }

    expect(mergeDeep(baseObj, overrideObj)).toEqual(expected)
  })

  test('handles empty objects', () => {
    const baseObj = {}
    const overrideObj = {}

    expect(mergeDeep(baseObj, overrideObj)).toEqual({})
  })

  test('returns original object when second object is empty', () => {
    const baseObj = {
      '2025-06-12': {
        customStyles: {
          container: {
            backgroundColor: '#cf323d',
            paddingTop: 2.7411764705882353,
          },
        },
      },
    }

    const overrideObj = {}

    expect(mergeDeep(baseObj, overrideObj)).toEqual(baseObj)
  })

  test('returns original object when first object is empty', () => {
    const baseObj = {}
    const overrideObj = {
      '2025-06-12': {
        customStyles: {
          container: {
            backgroundColor: '#ffffff',
          },
        },
      },
    }

    expect(mergeDeep(baseObj, overrideObj)).toEqual(overrideObj)
  })

  test('merges multiple keys correctly', () => {
    const baseObj = {
      '2025-06-12': {
        customStyles: {
          container: {
            backgroundColor: '#cf323d',
          },
        },
      },
      '2025-05-12': {
        customStyles: {
          container: {
            paddingTop: 2.7411764705882353,
          },
        },
      },
    }

    const overrideObj = {
      '2025-06-12': {
        customStyles: {
          container: {
            paddingBottom: 10,
          },
        },
      },
      '2025-05-12': {
        customStyles: {
          container: {
            backgroundColor: '#ffffff',
          },
        },
      },
    }

    const expected = {
      '2025-06-12': {
        customStyles: {
          container: {
            backgroundColor: '#cf323d', // Original value remains
            paddingBottom: 10, // Added
          },
        },
      },
      '2025-05-12': {
        customStyles: {
          container: {
            paddingTop: 2.7411764705882353,
            backgroundColor: '#ffffff', // Merged
          },
        },
      },
    }

    expect(mergeDeep(baseObj, overrideObj)).toEqual(expected)
  })

  test('does not modify original objects', () => {
    const baseObj = {
      '2025-06-12': {
        customStyles: {
          container: {
            backgroundColor: '#cf323d',
          },
        },
      },
    }

    const overrideObj = {
      '2025-06-12': {
        customStyles: {
          container: {
            paddingBottom: 10,
          },
        },
      },
    }

    mergeDeep(baseObj, overrideObj)

    expect(baseObj).toEqual({
      '2025-06-12': {
        customStyles: {
          container: {
            backgroundColor: '#cf323d',
          },
        },
      },
    })
  })
})
