import Realm from 'realm'
import { LocalDate, ChronoUnit } from 'js-joda'
import nodejs from 'nodejs-mobile-react-native'
import fs from 'react-native-fs'
import restart from 'react-native-restart'
import {
  cycleWithFhmMucus,
  longAndComplicatedCycleWithMucus,
  cycleWithTempAndNoMucusShift,
  cycleWithFhmCervix,
  longAndComplicatedCycleWithCervix,
  cycleWithTempAndNoCervixShift
} from './fixtures'
import { saveEncryptionFlag } from '../local-storage'
import dbSchema from './schema'

let db
const realmConfig = {
  schema: dbSchema
}

function getBleedingDaysSortedByDate() {
  return db.objects('CycleDay').filtered('bleeding != null').sorted('date', true)
}
function getTemperatureDaysSortedByDate() {
  return db.objects('CycleDay').filtered('temperature != null').sorted('date', true)
}
function getCycleDaysSortedByDate() {
  return db.objects('CycleDay').sorted('date', true)
}

function saveSymptom(symptom, cycleDay, val) {
  db.write(() => {
    cycleDay[symptom] = val
  })
}

function getOrCreateCycleDay(localDate) {
  let result = db.objectForPrimaryKey('CycleDay', localDate)
  if (!result) {
    db.write(() => {
      result = db.create('CycleDay', {
        date: localDate
      })
    })
  }
  return result
}

function getCycleDay(localDate) {
  return db.objectForPrimaryKey('CycleDay', localDate)
}

function fillWithMucusDummyData() {
  const dummyCycles = [
    cycleWithFhmMucus,
    longAndComplicatedCycleWithMucus,
    cycleWithTempAndNoMucusShift
  ]

  db.write(() => {
    db.deleteAll()
    dummyCycles.forEach(cycle => {
      cycle.forEach(day => {
        const existing = getCycleDay(day.date)
        if (existing) {
          Object.keys(day).forEach(key => {
            if (key === 'date') return
            existing[key] = day[key]
          })
        } else {
          db.create('CycleDay', day)
        }
      })
    })
  })
}

function fillWithCervixDummyData() {
  const dummyCycles = [
    cycleWithFhmCervix,
    longAndComplicatedCycleWithCervix,
    cycleWithTempAndNoCervixShift
  ]

  db.write(() => {
    db.deleteAll()
    dummyCycles.forEach(cycle => {
      cycle.forEach(day => {
        const existing = getCycleDay(day.date)
        if (existing) {
          Object.keys(day).forEach(key => {
            if (key === 'date') return
            existing[key] = day[key]
          })
        } else {
          db.create('CycleDay', day)
        }
      })
    })
  })
}


function deleteAll() {
  db.write(() => {
    db.deleteAll()
  })
}

function getPreviousTemperature(cycleDay) {
  cycleDay.wrappedDate = LocalDate.parse(cycleDay.date)
  const winner = getTemperatureDaysSortedByDate().find(day => {
    const wrappedDate = LocalDate.parse(day.date)
    return wrappedDate.isBefore(cycleDay.wrappedDate)
  })
  if (!winner) return null
  return winner.temperature.value
}

function tryToCreateCycleDay(day, i) {
  try {
    db.create('CycleDay', day)
  } catch (err) {
    const msg = `Line ${i + 1}(${day.date}): ${err.message}`
    throw new Error(msg)
  }
}

function getAmountOfCycleDays() {
  const cycleDaysSortedByDate = getCycleDaysSortedByDate()
  const amountOfCycleDays = cycleDaysSortedByDate.length
  if (!amountOfCycleDays) return 0
  const earliest = cycleDaysSortedByDate[amountOfCycleDays - 1]
  const today = LocalDate.now()
  const earliestAsLocalDate = LocalDate.parse(earliest.date)
  return earliestAsLocalDate.until(today, ChronoUnit.DAYS)
}

function getSchema() {
  return db.schema.reduce((acc, curr) => {
    acc[curr.name] = curr.properties
    return acc
  }, {})
}

function tryToImportWithDelete(cycleDays) {
  db.write(() => {
    db.delete(db.objects('CycleDay'))
    cycleDays.forEach(tryToCreateCycleDay)
  })
}

function tryToImportWithoutDelete(cycleDays) {
  db.write(() => {
    cycleDays.forEach((day, i) => {
      const existing = getCycleDay(day.date)
      if (existing) db.delete(existing)
      tryToCreateCycleDay(day, i)
    })
  })
}

function requestHash(pw) {
  nodejs.channel.send(JSON.stringify({
    type: 'request-SHA512',
    message: pw || 'mypassword'
  }))
}

export async function openDb ({ hash, persistConnection }) {
  if (hash) {
    realmConfig.encryptionKey = hashToInt8Array(hash)
  }

  const connection = await Realm.open(realmConfig)

  if (persistConnection) db = connection
}

export async function changeEncryptionAndRestartApp(hash) {
  let key
  if (hash) key = hashToInt8Array(hash)
  const defaultPath = db.path
  const dir = db.path.split('/')
  dir.pop()
  dir.push('copied.realm')
  const copyPath = dir.join('/')
  const exists = await fs.exists(copyPath)
  if (exists) await fs.unlink(copyPath)
  // for some reason, realm complains if we give it a key with value undefined
  if (key) {
    db.writeCopyTo(copyPath, key)
  } else {
    db.writeCopyTo(copyPath)
  }
  db.close()
  await fs.unlink(defaultPath)
  await fs.moveFile(copyPath, defaultPath)
  await saveEncryptionFlag(key ? true : false)
  restart.Restart()
}

async function deleteDbAndOpenNew() {
  const exists = await fs.exists(Realm.defaultPath)
  if (exists) await fs.unlink(Realm.defaultPath)
  await openDb({ persistConnection: true })
  await saveEncryptionFlag(false)
}

function hashToInt8Array(hash) {
  const key = new Uint8Array(64)
  for (let i = 0; i < key.length; i++) {
    const twoDigitHex = hash.slice(i * 2, i * 2 + 2)
    key[i] = parseInt(twoDigitHex, 16)
  }
  return key
}

export {
  saveSymptom,
  getOrCreateCycleDay,
  fillWithMucusDummyData,
  fillWithCervixDummyData,
  getBleedingDaysSortedByDate,
  getTemperatureDaysSortedByDate,
  getCycleDaysSortedByDate,
  deleteAll,
  getPreviousTemperature,
  getCycleDay,
  getAmountOfCycleDays,
  getSchema,
  tryToImportWithDelete,
  tryToImportWithoutDelete,
  requestHash,
  deleteDbAndOpenNew
}
