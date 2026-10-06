import { LocalDate } from '@js-joda/core';

import i18n from '../../i18n/i18n';

const FULL_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};
const HUMANIZED_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: '2-digit',
  month: 'short',
  day: '2-digit',
};
const SHORT_MONTH_OPTIONS: Intl.DateTimeFormatOptions = { month: 'short' };
const SHORT_TEXT_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
};
const TITLE_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  year: '2-digit',
  month: 'short',
  day: '2-digit',
};

function formatLocalDate(
  date: LocalDate,
  options: Intl.DateTimeFormatOptions
): string {
  const jsDate = new Date(
    date.year(),
    date.monthValue() - 1,
    date.dayOfMonth()
  );
  return new Intl.DateTimeFormat(i18n.language, options).format(jsDate);
}

export function formatDateForShortText(date: LocalDate): string {
  return formatLocalDate(date, SHORT_TEXT_OPTIONS);
}

export function todayToFullDate(): string {
  return formatLocalDate(LocalDate.now(), FULL_DATE_OPTIONS);
}

export function dateToShortMonth(dateString: string): string {
  return formatLocalDate(LocalDate.parse(dateString), SHORT_MONTH_OPTIONS);
}

export function dateToTitle(dateString: string): string {
  const today = LocalDate.now();
  const dateToDisplay = LocalDate.parse(dateString);
  return today.equals(dateToDisplay)
    ? i18n.t('cycleDay.today')
    : formatLocalDate(dateToDisplay, TITLE_OPTIONS);
}

export function humanizeDate(dateString?: string | null): string {
  if (!dateString) return '';

  const today = LocalDate.now();

  try {
    const dateToDisplay = LocalDate.parse(dateString);
    return today.equals(dateToDisplay)
      ? i18n.t('cycleDay.today')
      : formatLocalDate(dateToDisplay, HUMANIZED_DATE_OPTIONS);
  } catch (_: unknown) {
    return '';
  }
}
