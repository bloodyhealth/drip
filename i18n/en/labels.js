export const home = {
  unknown: '?',
  phase: (n) => `${['1st', '2nd', '3rd'][n - 1]} cycle phase`,
}

export const shared = {
  cancel: 'Cancel',
  save: 'Save',
  dataSaved: 'Symptom data was saved',
  dataDeleted: 'Symptom data was deleted',
  errorTitle: 'Error',
  successTitle: 'Success',
  warning: 'Warning',
  incorrectPassword: 'Password incorrect',
  incorrectPasswordMessage: 'That password is incorrect.',
  tryAgain: 'Try again',
  ok: 'OK',
  confirmToProceed: 'Confirm to proceed',
  date: 'Date',
  noDataWarning: "You haven't entered any data yet.",
  noTemperatureWarning: "You haven't entered any temperature data yet.",
  noDataButtonText: 'Start entering data now',
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

export const fertilityStatus = {
  fertile: 'fertile',
  infertile: 'infertile',
  fertileUntilEvening: 'Fertile phase ends in the evening',
  unknown:
    'We cannot show any cycle information because no period data has been added.',
  preOvuText:
    "According to the sympto-thermal method, you may assume 5 days of infertility at the beginning of your cycle, provided you don't observe any fertile cervical mucus or cervix values.",
  periOvuText:
    'We were not able to detect both a temperature shift and cervical mucus or cervix shift.',
  periOvuUntilEveningText: (tempRule) => {
    return (
      'We detected a temperature shift (' +
      ['regular', '1st exception', '2nd exception'][tempRule] +
      ' temperature rule), as well as a cervical mucus/cervix shift according to the sympto-thermal method. In the evening today you may assume infertility, but ' +
      'always remember to double-check for yourself. Make sure the data makes sense to you.'
    )
  },
  postOvuText: (tempRule) => {
    return (
      'We detected a temperature shift (' +
      ['regular', '1st exception', '2nd exception'][tempRule] +
      ' temperature rule), as well as a cervical mucus/cervix shift according to the sympto-thermal method. You may assume infertility, but always remember to ' +
      'double-check for yourself. Make sure the data makes sense to you.'
    )
  },
}
