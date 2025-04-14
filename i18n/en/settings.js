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
    notification: 'Record your morning temperature',
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
  website: {
    title: 'Website',
  },
}
