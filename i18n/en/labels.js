export const home = {
  unknown: '?',
  phase: (n) => `${['1st', '2nd', '3rd'][n - 1]} cycle phase`,
}

export const shared = {
  cancel: 'Cancel',
  save: 'Save',
  errorTitle: 'Error',
  warning: 'Warning',
  ok: 'OK',
  date: 'Date',
  enter: 'Enter',
  remove: 'Remove',
  learnMore: 'Learn more',
}

export const bleedingPrediction = {
  predictionInFuture: (startDays, endDays) =>
    `Your next period is likely to start in ${startDays} to ${endDays} days.`,
  predictionStartedXDaysLeft: (numberOfDays) =>
    `Your period is likely to start today or within the next ${numberOfDays} days.`,
  predictionStarted1DayLeft:
    'Your period is likely to start today or tomorrow.',
  predictionStartedNoDaysLeft: 'Your period is likely to start today.',
  predictionInPast: (startDate, endDate) =>
    `Based on your documented data, your period was likely to start between ${startDate} and ${endDate}.`,
}
