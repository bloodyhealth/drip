import { Alert, Platform } from 'react-native'
import i18n from '../../../i18n/i18n'

export default function showBackUpReminder(okHandler, cancelHandler, isDelete) {
  const { t } = i18n
  const translationKey = `password.${
    isDelete ? 'backupReminderDeletePassword' : 'backupReminderChangePassword'
  }`

  const appendix = t(
    `password.backupReminder.${Platform.OS === 'ios' ? 'ios' : 'android'}`
  )

  Alert.alert(
    t(`${translationKey}.title`),
    t(`${translationKey}.text`) + appendix,
    [
      {
        text: t('shared.cancel'),
        onPress: cancelHandler,
        style: 'cancel',
      },
      {
        text: t('shared.ok'),
        onPress: okHandler,
      },
    ],
    { onDismiss: cancelHandler }
  )
}
