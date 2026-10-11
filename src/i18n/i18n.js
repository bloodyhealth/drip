import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// translation files
import en from './en.json'
import de from './de.json'

const resources = {
  'en-US': { translation: en },
  'de-DE': { translation: de },
}

i18n
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    fallbackLng: 'en-US',

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })

export default i18n
