import { LocalDate } from '@js-joda/core'

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
            borderColor: shades[3],
            borderStyle: i === middleIndex ? 'solid' : 'dashed',
            borderWidth: 2,
            justifyContent: 'center',
            alignItems: 'center',
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
