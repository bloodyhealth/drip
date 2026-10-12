declare module 'sympto' {
  export interface SymptoCycleInfo {
    cycle: object[]
    previousCycle?: object[]
    earlierCycles?: object[]
    secondarySymptom?: 'mucus' | 'cervix'
    excludePreOvu?: boolean
  }

  export interface SymptoPhase {
    start: { date: string }
    end?: { date: string; time?: string }
    cycleDays: { date: string; temperature?: number }[]
  }

  export interface SymptoStatus {
    phases: {
      preOvulatory?: SymptoPhase
      periOvulatory?: SymptoPhase
      postOvulatory?: SymptoPhase
    }
    temperatureShift?: {
      ltl: number
      rule: number
      firstHighMeasurementDay: { date: string }
      evaluationCompleteDay: { date: string }
    }
  }

  export default function getFertilityStatus(
    cycleInfo: SymptoCycleInfo
  ): SymptoStatus
}
