import getFertilityStatus from 'sympto'
import { getCycleModule, getDataVersion } from '../db'
import {
  fertilityTrackingObservable,
  useCervixAsSecondarySymptomObservable,
} from '../local-storage'
import i18n from '../i18n/i18n'

const isFertilityTrackingEnabled = fertilityTrackingObservable.value

let statusCache = new Map()
let statusCacheValidFor = null

export function getFertilityStatusForDay(dateString) {
  if (!isFertilityTrackingEnabled) {
    return
  }

  const status = getCycleStatusForDay(dateString)
  if (!status)
    return {
      status: i18n.t('cycleDay.fertilityStatus.fertile'),
      phase: null,
      statusText: i18n.t('cycleDay.fertilityStatus.unknown'),
    }

  const phases = Object.keys(status.phases)
  const phaseNameForDay = phases.find((phaseName) => {
    const phase = status.phases[phaseName]
    const dayIsAfterPhaseStart = dateString >= phase.start.date
    let dayIsBeforePhaseEnd
    if (phase.end) {
      dayIsBeforePhaseEnd = dateString <= phase.end.date
    } else {
      dayIsBeforePhaseEnd = true
    }
    return dayIsAfterPhaseStart && dayIsBeforePhaseEnd
  })

  // if there's only cycle data for the pre phase and the target day is after its end,
  // the day is in the peri phase
  if (phases.length === 1 && phases[0] === 'preOvulatory' && !phaseNameForDay) {
    return formatStatus('periOvulatory', dateString, {
      phases: { periOvulatory: {} },
    })
  }

  return formatStatus(phaseNameForDay, dateString, status)
}

export function getCycleStatusForDay(dateString, opts = {}) {
  if (!isFertilityTrackingEnabled) {
    return
  }

  const cycleStart = getCycleModule().getLastMensesStartForDay(dateString)
  if (!cycleStart) return null

  const secondarySymptom = useCervixAsSecondarySymptomObservable.value
    ? 'cervix'
    : 'mucus'
  const excludeEarlierCycles = Boolean(opts.excludeEarlierCycles)
  const key = [cycleStart.date, secondarySymptom, excludeEarlierCycles].join()
  const cache = getStatusCache()
  if (!cache.has(key)) {
    cache.set(
      key,
      computeCycleStatus(
        cycleStart.date,
        secondarySymptom,
        excludeEarlierCycles
      )
    )
  }
  return cache.get(key)
}

function getStatusCache() {
  const validFor = [getDataVersion(), getTodayDate()].join()
  if (validFor !== statusCacheValidFor) {
    statusCache = new Map()
    statusCacheValidFor = validFor
  }
  return statusCache
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10)
}

function computeCycleStatus(
  cycleStartDate,
  secondarySymptom,
  excludeEarlierCycles
) {
  const { getCycleForDay, getCyclesBefore, getPreviousCycle } = getCycleModule()

  const cycle = getCycleForDay(cycleStartDate)
  if (!cycle) return null

  const cycleInfo = { cycle: formatCycleForSympto(cycle), secondarySymptom }

  const previousCycle = getPreviousCycle(cycleStartDate)

  if (previousCycle) {
    cycleInfo.previousCycle = formatCycleForSympto(previousCycle)
  }
  if (previousCycle && !excludeEarlierCycles) {
    const earlierCycles = getCyclesBefore(previousCycle[0])
    if (earlierCycles) {
      cycleInfo.earlierCycles = earlierCycles.map(formatCycleForSympto)
    }
  }

  return getFertilityStatus(cycleInfo)
}

function formatStatus(phaseNameForDay, dateString, status) {
  const mapping = {
    preOvulatory: () => {
      return {
        status: i18n.t('cycleDay.fertilityStatus.infertile'),
        phase: 1,
        statusText: i18n.t('cycleDay.fertilityStatus.preOvu'),
      }
    },
    periOvulatory: (dateString, status) => {
      //there might not actually be any data for the phase
      const phaseEnd = status.phases.periOvulatory?.end

      if (phaseEnd && phaseEnd.date === dateString) {
        return {
          status: i18n.t('cycleDay.fertilityStatus.fertileUntilEvening'),
          phase: 2,
          statusText: i18n.t('cycleDay.fertilityStatus.periOvuUntilEvening', {
            rule: status.temperatureShift.rule,
          }),
        }
      }
      return {
        status: i18n.t('cycleDay.fertilityStatus.fertile'),
        phase: 2,
        statusText: i18n.t('cycleDay.fertilityStatus.periOvu'),
      }
    },
    postOvulatory: (_, status) => {
      return {
        status: i18n.t('cycleDay.fertilityStatus.infertile'),
        phase: 3,
        statusText: i18n.t('cycleDay.fertilityStatus.postOvu', {
          rule: status.temperatureShift.rule,
        }),
      }
    },
  }

  return mapping[phaseNameForDay](dateString, status)
}

function formatCycleForSympto(cycle) {
  // we get earliest last, but sympto wants earliest first
  return cycle.map(formatDayForSympto).reverse()
}

function formatDayForSympto(day) {
  const { date, bleeding, temperature, mucus, cervix } = day
  const formatted = { date }
  if (isIncluded(bleeding)) formatted.bleeding = bleeding.value
  if (isIncluded(temperature)) formatted.temperature = temperature.value
  // nfp-mucus returns null for incomplete mucus values
  if (isIncluded(mucus) && mucus.value !== null) formatted.mucus = mucus.value
  if (isIncluded(cervix) && isCompleteCervixValue(cervix)) {
    formatted.cervix = { opening: cervix.opening, firmness: cervix.firmness }
  }
  return formatted
}

function isIncluded(symptom) {
  return Boolean(symptom) && !symptom.exclude
}

function isCompleteCervixValue(cervix) {
  return (
    typeof cervix.opening === 'number' && typeof cervix.firmness === 'number'
  )
}
