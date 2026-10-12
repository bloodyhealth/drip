import getFertilityStatus from 'sympto'

export function countSymptoCallsFromApp(): number {
  return jest
    .mocked(getFertilityStatus)
    .mock.calls.filter(([info]) => !info.excludePreOvu).length
}
