import notifee from '@notifee/react-native'
import { Alert, Platform } from 'react-native'
import i18n from '../../i18n/i18n'
import {
  saveAndroidBackgroundRestrictions,
  getAndroidBackgroundRestrictions,
} from '../../local-storage'
import { ANDROID_BACKGROUND_RESTRICTIONS, ANDROID } from './constants'

const { BATTERY_OPTIMIZATION, POWER_MANAGER } = ANDROID_BACKGROUND_RESTRICTIONS

export class AndroidBackgroundRestrictions {
  async checkBatteryOptimization() {
    await this.checkRestriction(
      BATTERY_OPTIMIZATION,
      async () => await notifee.isBatteryOptimizationEnabled(),
      async () => await notifee.openBatteryOptimizationSettings()
    )
  }

  async checkPowerManagerRestrictions() {
    await this.checkRestriction(
      POWER_MANAGER,
      async () => {
        const powerManagerInfo = await notifee.getPowerManagerInfo()
        return powerManagerInfo.activity !== null
      },
      async () => await notifee.openPowerManagerSettings()
    )
  }

  async checkAllRestrictions() {
    if (Platform.OS !== ANDROID) return

    await this.checkBatteryOptimization()
    await this.checkPowerManagerRestrictions()
  }

  // Internal helper - Common logic for checking restrictions
  async checkRestriction(restrictionType, checkFunction, settingsAction) {
    if (Platform.OS !== ANDROID) return
    if (await this.shouldSkipAlert(restrictionType)) return

    const hasRestriction = await checkFunction()

    if (hasRestriction) {
      await this.showAlert(restrictionType, settingsAction)
    }
  }

  // Cache/Decision logic
  async shouldSkipAlert(restrictionType) {
    const restrictionValue = await getAndroidBackgroundRestrictions(
      restrictionType
    )

    if (!restrictionValue) return false

    try {
      return JSON.parse(restrictionValue) === true
    } catch {
      return false
    }
  }

  // Data persistence
  async saveRestrictionValue(restrictionType, isCancelled) {
    const value = JSON.stringify(isCancelled)
    await saveAndroidBackgroundRestrictions(restrictionType, value)
  }

  getTranslation(restrictionType) {
    const TRANSLATION_PREFIX = 'notifications.androidBackgroundRestrictions'

    const t = (key) => i18n.t(`${TRANSLATION_PREFIX}.${key}`)

    const { title, text, openSettings, cancel } = {
      title: t(`${restrictionType}.title`),
      text: t(`${restrictionType}.text`),
      openSettings: t('cta.openSettings'),
      cancel: t('cta.cancel'),
    }

    return { title, text, openSettings, cancel }
  }

  // UI/Presentation
  async showAlert(restrictionType, settingsAction) {
    const { title, text, openSettings, cancel } =
      this.getTranslation(restrictionType)

    return new Promise((resolve) => {
      Alert.alert(
        title,
        text,
        [
          {
            text: openSettings,
            onPress: () => {
              settingsAction()
              // Don't store anything - allow checking again next time
              resolve()
            },
          },
          {
            text: cancel,
            onPress: () => {
              this.saveRestrictionValue(restrictionType, true)
              resolve()
            },
            style: 'cancel',
          },
        ],
        { cancelable: false }
      )
    })
  }
}

export default new AndroidBackgroundRestrictions()
