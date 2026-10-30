import { LocalDate } from '@js-joda/core'
import { LocaleConfig } from 'react-native-calendars'

import { Colors, Fonts, Sizes } from '../../styles'
import { getMonthNames, getWeekdayNames } from './format-date'
import { periodPredictionObservable } from '../../local-storage'
import i18n from '../../i18n/i18n'

const { shades } = Colors.iconColors.bleeding

const setCalendarLocale = (language, t) => {
  LocaleConfig.locales[language] = {
    monthNames: getMonthNames('long'),
    monthNamesShort: getMonthNames('short'),
    dayNames: getWeekdayNames('long'),
    dayNamesShort: getWeekdayNames('short'),
    today: t('cycleDay.today'),
  }
  LocaleConfig.defaultLocale = language
}

export const syncCalendarLocaleWithLanguage = () => {
  const onLanguageChanged = (language) => setCalendarLocale(language, i18n.t)
  i18n.on('languageChanged', onLanguageChanged)
  return () => i18n.off('languageChanged', onLanguageChanged)
}

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
    ...Fonts.bold,
    color: Colors.purple,
  },
}

export const calendarTheme = {
  calendarBackground: Colors.turquoiseLight,
  dayTextColor: Colors.greyDark,
  monthTextColor: Colors.purple,
  textDayFontFamily: Fonts.main.fontFamily,
  textMonthFontFamily: Fonts.bold.fontFamily,
  textMonthFontWeight: Fonts.bold.fontWeight,
  textDayHeaderFontFamily: Fonts.bold.fontFamily,
  textDayHeaderFontWeight: Fonts.bold.fontWeight,
  textDayFontSize: Sizes.small,
  textDayFontWeight: Fonts.main.fontWeight,
  textMonthFontSize: Sizes.subtitle,
  textDayHeaderFontSize: Sizes.small,
  textSectionTitleColor: Colors.orange,
}
