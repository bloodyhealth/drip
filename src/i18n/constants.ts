export const Languages = ['en-US', 'de-DE'] as const
export type Language = (typeof Languages)[number]

export function isLanguage(value: string | null): value is Language {
  return Languages.some((language) => language === value)
}
