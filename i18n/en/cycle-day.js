export const mucusNFP = ['t', 'Ø', 'f', 'S', 'S+']
export const intensity = ['low', 'medium', 'high']

export const bleeding = {
  labels: ['spotting', 'light', 'medium', 'heavy'],
  heaviness: {
    header: 'Heaviness',
    explainer: 'How heavy is the bleeding?',
  },
  exclude: {
    header: 'Exclude',
    explainer: "You can exclude this value if it's not menstrual bleeding",
  },
}

export const products = {
  categories: {
    pad: 'pad',
    tampon: 'tampon',
    underwear: 'underwear',
    cup: 'cup',
    softTampon: 'soft tampon',
    disk: 'disk',
    none: 'none',
    other: 'other',
  },
  header: 'period products',
  explainer: 'Did you use period products?',
}

export const cervix = {
  subcategories: {
    opening: 'opening',
    firmness: 'firmness',
    position: 'position',
  },
  opening: {
    categories: ['closed', 'medium', 'open'],
    explainer: 'Is your cervix open or closed?',
  },
  firmness: {
    categories: ['hard', 'soft'],
    explainer: "When it's hard, it might feel like the tip of your nose",
  },
  position: {
    categories: ['low', 'medium', 'high'],
    explainer: 'How high up in the vagina is the cervix?',
  },
  excludeExplainer:
    "You can exclude these values if you don't want to use them for fertility detection.",
}

export const mucus = {
  subcategories: {
    feeling: 'feeling',
    texture: 'texture',
  },
  feeling: {
    categories: ['dry', 'nothing', 'wet', 'slippery'],
    explainer: 'What does your vaginal entrance feel like?',
  },
  texture: {
    categories: ['nothing', 'creamy', 'egg white'],
    explainer:
      'Looking at and touching your cervical mucus, which describes it best?',
  },
  excludeExplainer:
    "You can exclude these values if you don't want to use them for fertility detection",
}

export const desire = {
  header: 'Intensity',
  explainer: 'How would you rate your sexual desire?',
}

export const sex = {
  categories: {
    solo: 'solo',
    partner: 'partner',
  },
  header: 'Activity',
  explainer: 'Were you sexually active today?',
}

export const contraceptives = {
  categories: {
    condom: 'condom',
    pill: 'pill',
    iud: 'iud',
    patch: 'patch',
    ring: 'ring',
    implant: 'implant',
    diaphragm: 'diaphragm',
    none: 'none',
    other: 'other',
  },
  header: 'Contraceptives',
  explainer: 'Did you use contraceptives?',
}

export const pain = {
  categories: {
    cramps: 'cramps',
    ovulationPain: 'ovulation pain',
    headache: 'headache',
    backache: 'backache',
    nausea: 'nausea',
    tenderBreasts: 'tender breasts',
    migraine: 'migraine',
    other: 'other',
  },
  explainer: 'How did your body feel today?',
}

export const mood = {
  categories: {
    happy: 'happy',
    sad: 'sad',
    stressed: 'stressed',
    balanced: 'balanced',
    fine: 'fine',
    anxious: 'anxious',
    energetic: 'energetic',
    fatigue: 'fatigue',
    angry: 'angry',
    other: 'other',
  },
  explainer: 'How did you feel today?',
}

export const temperature = {
  outOfRangeWarning:
    'This temperature value is out of the current range for the temperature chart. You can change the range in the settings.',
  outOfAbsoluteRangeWarning:
    'This temperature value is too high or low to be shown on the temperature chart.',
  temperature: {
    header: 'Temperature',
    explainer:
      'Take your temperature right after waking up, before getting out of bed',
  },
  time: 'Time',
  note: {
    header: 'Note',
    explainer:
      'Is there anything that could have influenced this value, such as bad sleep or alcohol consumption?',
  },
  exclude: {
    header: 'Exclude',
    explainer:
      "You can exclude this value if you don't want to use it for fertility detection",
  },
}

export const noteExplainer = 'Anything you want to add for the day?'

export const general = {
  cycleDayNumber: 'Cycle day ',
  today: 'Today',
}

export const sharedDialogs = {
  cancel: 'Cancel',
  areYouSureTitle: 'Are you sure?',
  areYouSureToDelete: 'Are you sure you want to delete this entry?',
  reallyDeleteData: 'Yes, I am sure',
  save: 'Save',
  delete: 'Delete',
  disabledInfo: 'There is some data missing',
}
