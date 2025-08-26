import { mergeContainerStyles } from '../../components/helpers/calendar'
jest.mock('../../local-storage', () => ({
  periodPredictionObservable: true,
}))

describe('mergeContainerStyles', () => {
  test('merges styles for existing keys', () => {
    const obj1 = {
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

    const obj2 = {
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

    expect(mergeContainerStyles(obj1, obj2)).toEqual(expected)
  })

  test('handles empty objects', () => {
    const obj1 = {}
    const obj2 = {}

    expect(mergeContainerStyles(obj1, obj2)).toEqual({})
  })

  test('returns original object when second object is empty', () => {
    const obj1 = {
      '2025-06-12': {
        customStyles: {
          container: {
            backgroundColor: '#cf323d',
            paddingTop: 2.7411764705882353,
          },
        },
      },
    }

    const obj2 = {}

    expect(mergeContainerStyles(obj1, obj2)).toEqual(obj1)
  })

  test('returns original object when first object is empty', () => {
    const obj1 = {}
    const obj2 = {
      '2025-06-12': {
        customStyles: {
          container: {
            backgroundColor: '#ffffff',
          },
        },
      },
    }

    expect(mergeContainerStyles(obj1, obj2)).toEqual(obj2)
  })

  test('merges multiple keys correctly', () => {
    const obj1 = {
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

    const obj2 = {
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

    expect(mergeContainerStyles(obj1, obj2)).toEqual(expected)
  })

  test('does not modify original objects', () => {
    const obj1 = {
      '2025-06-12': {
        customStyles: {
          container: {
            backgroundColor: '#cf323d',
          },
        },
      },
    }

    const obj2 = {
      '2025-06-12': {
        customStyles: {
          container: {
            paddingBottom: 10,
          },
        },
      },
    }

    mergeContainerStyles(obj1, obj2)

    expect(obj1).toEqual({
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
