import links from './links'

export default {
  title: 'Settings',
  menuItems: {
    reminders: {
      name: 'Reminders',
      text: 'turn on/off reminders',
    },
    nfpSettings: {
      name: 'NFP settings',
      text: 'define how you want to use NFP',
    },
    dataManagement: {
      name: 'Data',
      text: 'import, export or delete your data',
    },
    password: {
      name: 'Password',
      text: '',
    },
    about: 'About',
    license: 'License',
    settings: 'Settings',
  },
  export: {
    errors: {
      noData: 'There is no data to export',
      couldNotConvert: 'Could not convert data to CSV',
      problemSharing: 'There was a problem sharing the data export file',
    },
    title: 'My drip. data export',
    subject: 'My drip. data export',
    button: 'Export data',
    segmentExplainer:
      'Export data in CSV format for backup or so you can use it elsewhere',
  },
  import: {
    button: 'Import data',
    title: 'Keep existing data?',
    message: `There are two options for the import:
1. Keep existing cycle days and replace only the ones in the import file.
2. Delete all existing cycle days and import cycle days from file.`,
    replaceOption: 'Import and replace',
    deleteOption: 'Import and delete existing',
    errors: {
      couldNotOpenFile: 'Could not open file',
      postFix: 'No data was imported or changed',
      futureEdit: 'Future dates may only contain a note, no other symptoms',
    },
    success: {
      message: 'Data successfully imported',
    },
    segmentExplainer: 'Import data in CSV format',
  },
  deleteSegment: {
    title: 'Delete app data',
    explainer: 'Delete app data from this phone',
    question: 'Do you want to delete app data from this phone?',
    message:
      'Please note that deletion of the app data is permanent and irreversible. We recommend exporting existing data before deletion.',
    confirmation: 'Delete app data permanently',
    errors: {
      couldNotDeleteFile: 'Could not delete data',
      postFix: 'No data was deleted or changed',
      noData: 'There is no data to delete',
    },
    success: {
      message: 'App data successfully deleted',
    },
  },
  tempScale: {
    segmentTitle: 'Temperature scale',
    segmentExplainer:
      'Change the minimum and maximum value for the temperature chart',
    min: 'Min',
    max: 'Max',
    loadError: 'Could not load saved temperature scale settings',
    saveError: 'Could not save temperature scale settings',
  },
  tempReminder: {
    title: 'Temperature reminder',
    noTimeSet: 'Set a time for a daily reminder to take your temperature',
    timeSet: (time) => `Daily reminder set for ${time}`,
    notification: 'Record your morning temperature',
  },
  periodReminder: {
    title: 'Next period reminder',
    reminderText:
      'Get a notification 3 days before your next period is likely to start.',
    notification: (daysToEndOfPrediction) =>
      `Your next period is likely to start in 3 to ${daysToEndOfPrediction} days.`,
  },
  useCervix: {
    title: 'Secondary symptom',
    cervixModeOn:
      'Cervix values are being used for symptothermal fertility detection. You can switch here to use cervical mucus values for symptothermal fertility detection',
    cervixModeOff:
      'By default, cervical mucus values are being used for symptothermal fertility detection. You can switch here to use cervix values for symptothermal fertility detection',
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
    backupReminderTitle: 'Read this before making changes to your password',
    backupReminder:
      'Just to be safe, please backup your data using the export function before making changes to your password.\n\nLonger passwords are better! Consider using a passphrase.\n\nPlease also make sure you do not lose your password. There is no way to recover your data if you do.\n\nMaking any changes to your password setting will keep your data as it was before. After the password is updated the app will automatically close. At the new app launch please use the new password.',
    deleteBackupReminderTitle: 'Read this before deleting your password',
    deleteBackupReminder:
      'Deleting your password means your data will no longer be encrypted.\n\nJust to be safe, please backup your data using the export function before deleting your password.\n\nMaking any changes to your password setting will keep your data as it was before and restart the app. . After the password is updated the app will automatically close. At the new app launch you will not be prompted to enter the password.',
  },
  aboutSection: {
    title: 'About',
    text: `Please note that your data is stored locally on your phone and not on a server. This means your data cannot be read by anyone else unless they have access to your phone. We want to ensure that you stay in control of your own data. If you are planning to switch or reset your phone, please remember to export your data before doing so. You can reinstall the app afterwards and import your data.\n\nIf you encounter any technical issues, don't hesitate to contact us via email. You can also contribute to the code base on Gitlab and visit our website.`,
  },
  philosophy: {
    title: 'Remember to think for yourself',
    text: `drip. makes period predictions for you and helps you apply NFP fertility awareness rules. But please remember that this app is made by humans, and humans make mistakes. Always think for yourself: "Does this make sense?" Remember, you don't need an app to understand your cycle! However, drip. wants to support you and make period tracking easier, more transparent and secure.`,
  },
  version: {
    title: 'Version',
  },
  website: {
    title: 'Website',
  },
  preOvu: {
    title: 'Infertile days at cycle start',
    note: `drip. applies NFP's rules for calculating infertile days at the start of the cycle (see ${links.wiki.url} for more info). However, drip. does not currently apply the so called 20-day-rule, which determines infertile days at the cycle start from past cycle lengths in case no past symptothermal info is available.`,
  },
  credits: {
    title: 'Credits',
    note: `We love the drip. team. Thanks and lots of <3 to all of our condriputors. Thanks to Paula Härtel for the symptom tracking icons. All the other icons are made by ${links.smashicons.url}, ${links.pause08.url}, ${links.kazachek.url} & ${links.freepik.url} from ${links.flaticon.url}.`,
  },
  donate: {
    title: 'Buy us a coffee!',
    note: `The drips are always grateful for donations, big or small, that help us maintain this app and develop new features. You can donate via Ko-fi. Thank you! You're awesome.`,
  },
}
