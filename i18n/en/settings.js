import links from './links'

export default {
  customization: {
    title: 'Customization',
    trackingCategories: 'Tracking categories',
    subheaderSymptoThermalMethod: 'Sympto-thermal method settings',
  },
  tempScale: {
    segmentTitle: 'Temperature scale',
    segmentExplainer:
      'Change the minimum and maximum value for the temperature chart.',
    min: 'Min',
    max: 'Max',
    loadError: 'Could not load saved temperature scale settings',
    saveError: 'Could not save temperature scale settings',
    disabled: 'Disabled',
    disabledMessage:
      'To use the temperature scale please first enable temperature tracking above.',
  },

  tempReminder: {
    title: 'Temperature reminder',
    noTimeSet: 'Set a time for a daily reminder to take your temperature',
    timeSet: (time) => `Daily reminder set for ${time}`,
    notification: 'Record your morning temperature',
    alertNoTempReminder: {
      title: 'Temperature turned off',
      message:
        'To use the temperature reminder please first enable the temperature tracking category in the customization settings.',
    },
  },
  fertilityTracking: {
    title: 'Fertility phases calculation',
    disabledTitle: 'Disabled',
    disabled:
      'To use fertility phases calculation please enable both temperature tracking and either cervical mucus or cervix tracking above.',
    message:
      'If you enter menstrual bleeding, temperature and cervical mucus or cervix data according to the sympto-thermal method, drip will calculate cycle phases with the provided data.',
    on: 'If you switch this off, drip will not show fertility related information.',
    off: 'If you switch this on, drip will show fertility related information.',
  },
  secondarySymptom: {
    title: 'Secondary symptom',
    switch:
      'Please choose your preferred secondary symptom for fertility detection according to the sympto-thermal method:',
    disabled: {
      title: 'Disabled',
      message:
        'To set a secondary symptom please first enable the cervical mucus or cervix tracking category as well as temperature and fertility phases calculation above.',
      noSecondaryEnabled:
        'To switch the secondary symptom both cervical mucus and cervix need to be enabled above.',
    },
    mucus: 'cervical mucus',
    cervix: 'cervix',
  },
  periodPrediction: {
    title: 'Period predictions',
    on: 'drip predicts your 3 next menstrual bleedings based on statistics if you previously tracked at least 3 complete cycles.',
    off: 'There are no predictions for menstrual cycles displayed. If turned on, the calendar and the home screen will display period predictions.',
  },
  passwordSettings: {
    title: 'App password',
    explainerDisabled:
      "Encrypt the app's database with a password. You need to enter the password every time the app is started.",
    explainerEnabled:
      'Password protection and database encryption is currently enabled',
    setPassword: 'Set password',
    savePassword: 'Save password',
    changePassword: 'Change password',
    deletePassword: 'Delete password',
    enterCurrent: 'Please enter your current password',
    enterNew: 'Please enter a new password',
    confirmPassword: 'Please confirm your password',
    passwordsDontMatch: "Password and confirmation don't match",
    backupReminder: {
      title: 'Read this before making changes to your password',
      message: `
Just to be safe, please backup your data using the export function before making any changes to your password.\n
Longer passwords are better! Consider using a passphrase.\n
Please also make sure you do not lose your password. There is no way to recover your data if you do.\n
Making any changes to your password setting will keep your data as it was before.\n`,
    },
    deleteBackupReminder: {
      title: 'Read this before deleting your password',
      message: `
Deleting your password means your data will no longer be encrypted.\n
Just to be safe, please backup your data using the export function before deleting your password.\n
Making any changes to your password setting will keep your data as it was before and restart the app.\n    
    `,
    },
    backupReminderAppendix: {
      android:
        'After the password is updated the app will automatically restart.',
      ios: 'After the password is updated the app will automatically close. Please reopen it manually.',
    },
  },
  website: {
    title: 'Website',
  },
}
