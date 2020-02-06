import { LocalDate, ChronoUnit } from 'js-joda'
const { DAYS } = ChronoUnit

export const getDiffInDays = (fromDate, toDate) => {
  return LocalDate.parse(fromDate).until(
    LocalDate.parse(toDate),
    DAYS
  )
}

export const getPrecedingDate = (sortedDates, date) => {
  return sortedDates.find(d => d <= date)
}