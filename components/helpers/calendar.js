import { LocalDate } from '@js-joda/core'
import { verticalScale } from 'react-native-size-matters'

import { Colors, Fonts, Sizes } from '../../styles'
import { periodPredictionObservable } from '../../local-storage'

const { shades } = Colors.iconColors.bleeding

export const toCalFormat = (bleedingDaysSortedByDate) => {
  const todayDateString = LocalDate.now().toString()

  return bleedingDaysSortedByDate.reduce((acc, day) => {
    acc[day.date] = {
      customStyles: {
        container: {
          backgroundColor: shades[day.bleeding.value],
          paddingTop: verticalScale(2),
        },
        text: {
          color: Colors.turquoiseLight,
          ...(day.date === todayDateString && styles.calendarToday),
        },
      },
    }
    return acc
  }, {})
}

export const predictionToCalFormat = (predictedDays) => {
  if (!periodPredictionObservable.value) return {}
  if (!predictedDays.length) return {}
  const todayDateString = LocalDate.now().toString()
  const middleIndex = (predictedDays[0].length - 1) / 2
  return predictedDays.reduce((acc, setOfDays) => {
    setOfDays.reduce((accSet, day, i) => {
      accSet[day] = {
        customStyles: {
          container: {
            borderColor: shades[3], //i === middleIndex ? shades[3] : shades[0],
            borderStyle: i === middleIndex ? 'solid' : 'dashed',
            borderWidth: 2,
          },
        },
      }
      if (day === todayDateString) {
        accSet[day].customStyles.text = styles.calendarToday
      }

      return accSet
    }, acc)
    return acc
  }, {})
}

export const todayToCalFormat = () => {
  const todayDateString = LocalDate.now().toString()
  return {
    [todayDateString]: {
      customStyles: {
        text: styles.calendarToday,
      },
    },
  }
}

export function isPlainObject(data) {
  // helper function to determine whether the data is a plain object
  if (typeof data !== 'object' || data === null) {
    return false
  }
  const proto = Object.getPrototypeOf(data)
  return proto === null || proto === Object.prototype
}

export const mergeContainerStyles = (obj1, obj2) => {
  // merge object, but no deep merge yet
  const result = { ...obj1, ...obj2 }
  for (const key in obj2) {
    if (!(key in obj1)) {
      // they don't share this key. nothing to do.
      continue
    }
    const obj1Value = obj1[key]
    if (!isPlainObject(obj1Value)) {
      // The value in obj1 is not a mergable object so the value from
      // obj2 (which was already copied in the shallow merge) would be used
      // as-is.
      continue
    }

    const obj2Value = obj2[key]
    if (!isPlainObject(obj2Value)) {
      // The value in obj2 is not a mergable object either, so it will
      // override the object in obj1.
      continue
    }

    // Both obj1 and obj2 have a mergable object for this key, so we
    // recursively merge them.
    result[key] = mergeContainerStyles(obj1Value, obj2Value)
  }

  return result
}

// export const mergeContainerStyles = (obj1, obj2) => {
//   const result = { ...obj1 }
//   for (const dayString in obj2) {
//     if (dayString in result) {
//       result[dayString]['customStyles']['container'] = {
//         ...result[dayString].customStyles.container,
//         ...obj2[dayString].customStyles.container,
//       }
//     } else {
//       result[dayString] = obj2[dayString]
//     }
//   }

//   return result
// }

const styles = {
  calendarToday: {
    fontFamily: 'Jost-Bold',
    fontWeight: 'bold',
    color: Colors.purple,
  },
}

export const calendarTheme = {
  calendarBackground: Colors.turquoiseLight,
  dayTextColor: Colors.greyDark,
  monthTextColor: Colors.purple,
  textDayFontFamily: Fonts.main,
  textMonthFontFamily: Fonts.bold,
  textMonthFontWeight: 'bold',
  textDayHeaderFontFamily: Fonts.bold,
  textDayFontSize: Sizes.small,
  textMonthFontSize: Sizes.subtitle,
  textDayHeaderFontSize: Sizes.small,
  textSectionTitleColor: Colors.orange,
}
