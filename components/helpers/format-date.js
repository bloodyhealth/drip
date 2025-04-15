import { LocalDate } from '@js-joda/core'
import moment from 'moment'

import i18n from '../../i18n/i18n'

export function formatDateForShortText(date) {
  return moment(date.toString()).format('dddd, MMMM Do')
}

export function dateToTitle(dateString) {
  const today = LocalDate.now()
  const dateToDisplay = LocalDate.parse(dateString)
  return today.equals(dateToDisplay)
    ? i18n.t('cycleDay.today')
    : moment(dateString).format('ddd DD. MMM YY')
}

export function humanizeDate(dateString) {
  if (!dateString) return ''

  const today = LocalDate.now()

  try {
    const dateToDisplay = LocalDate.parse(dateString)
    return today.equals(dateToDisplay)
      ? i18n.t('cycleDay.today')
      : moment(dateString).format('DD. MMM YY')
  } catch (e) {
    return ''
  }
}
