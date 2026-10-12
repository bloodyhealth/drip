import getFertilityStatus from 'sympto'

interface SymptoCycleInfo {
  excludePreOvu?: boolean
}

export function countSymptoCallsFromApp(): number {
  return jest
    .mocked(getFertilityStatus)
    .mock.calls.filter(([info]: [SymptoCycleInfo]) => !info.excludePreOvu)
    .length
}
