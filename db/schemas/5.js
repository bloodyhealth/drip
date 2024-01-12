const TemperatureSchema = {
  name: 'Temperature',
  properties: {
    value: 'double',
    exclude: 'bool',
    time: {
      type: 'string',
      optional: true,
    },
    note: {
      type: 'string',
      optional: true,
    },
  },
}

const BleedingSchema = {
  name: 'Bleeding',
  properties: {
    value: { type: 'int', optional: true },
    exclude: 'bool',
    pad: { type: 'bool', optional: true },
    tampon: { type: 'bool', optional: true },
    underwear: { type: 'bool', optional: true },
    cup: { type: 'bool', optional: true },
    softTampon: { type: 'bool', optional: true },
    disk: { type: 'bool', optional: true },
    none: { type: 'bool', optional: true },
    other: { type: 'bool', optional: true },
    note: { type: 'string', optional: true },
  },
}

const MucusSchema = {
  name: 'Mucus',
  properties: {
    feeling: { type: 'int', optional: true },
    texture: { type: 'int', optional: true },
    value: { type: 'int', optional: true },
    exclude: 'bool',
  },
}

const CervixSchema = {
  name: 'Cervix',
  properties: {
    opening: { type: 'int', optional: true },
    firmness: { type: 'int', optional: true },
    position: { type: 'int', optional: true },
    exclude: 'bool',
  },
}

const NoteSchema = {
  name: 'Note',
  properties: {
    value: 'string',
  },
}

const DesireSchema = {
  name: 'Desire',
  properties: {
    value: 'int',
  },
}

const SexSchema = {
  name: 'Sex',
  properties: {
    solo: { type: 'bool', optional: true },
    partner: { type: 'bool', optional: true },
    condom: { type: 'bool', optional: true },
    pill: { type: 'bool', optional: true },
    iud: { type: 'bool', optional: true },
    patch: { type: 'bool', optional: true },
    ring: { type: 'bool', optional: true },
    implant: { type: 'bool', optional: true },
    diaphragm: { type: 'bool', optional: true },
    none: { type: 'bool', optional: true },
    other: { type: 'bool', optional: true },
    note: { type: 'string', optional: true },
  },
}

const PainSchema = {
  name: 'Pain',
  properties: {
    cramps: { type: 'bool', optional: true },
    ovulationPain: { type: 'bool', optional: true },
    headache: { type: 'bool', optional: true },
    backache: { type: 'bool', optional: true },
    nausea: { type: 'bool', optional: true },
    tenderBreasts: { type: 'bool', optional: true },
    migraine: { type: 'bool', optional: true },
    other: { type: 'bool', optional: true },
    note: { type: 'string', optional: true },
  },
}

const MoodSchema = {
  name: 'Mood',
  properties: {
    happy: { type: 'bool', optional: true },
    sad: { type: 'bool', optional: true },
    stressed: { type: 'bool', optional: true },
    balanced: { type: 'bool', optional: true },
    fine: { type: 'bool', optional: true },
    anxious: { type: 'bool', optional: true },
    energetic: { type: 'bool', optional: true },
    fatigue: { type: 'bool', optional: true },
    angry: { type: 'bool', optional: true },
    other: { type: 'bool', optional: true },
    note: { type: 'string', optional: true },
  },
}

const CycleDaySchema = {
  name: 'CycleDay',
  primaryKey: 'date',
  properties: {
    date: 'string',
    temperature: {
      type: 'Temperature',
      optional: true,
    },
    isCycleStart: 'bool',
    bleeding: {
      type: 'Bleeding',
      optional: true,
    },
    mucus: {
      type: 'Mucus',
      optional: true,
    },
    cervix: {
      type: 'Cervix',
      optional: true,
    },
    note: {
      type: 'Note',
      optional: true,
    },
    desire: {
      type: 'Desire',
      optional: true,
    },
    sex: {
      type: 'Sex',
      optional: true,
    },
    pain: {
      type: 'Pain',
      optional: true,
    },
    mood: {
      type: 'Mood',
      optional: true,
    },
  },
}

export default {
  schema: [
    CycleDaySchema,
    TemperatureSchema,
    BleedingSchema,
    MucusSchema,
    CervixSchema,
    NoteSchema,
    DesireSchema,
    SexSchema,
    PainSchema,
    MoodSchema,
  ],
  schemaVersion: 5,
  migration: (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 5) {
      const newObjects = newRealm.objects('Bleeding')

      // loop through all objects and assign a default value for new properties
      for (let i = 0; i < newObjects.length; i++) {
        newObjects[i].pad = false
        newObjects[i].tampon = false
        newObjects[i].underwear = false
        newObjects[i].cup = false
        newObjects[i].softTampon = false
        newObjects[i].disk = false
        newObjects[i].none = false
        newObjects[i].other = false
        newObjects[i].note = null
      }
    }
  },
}
