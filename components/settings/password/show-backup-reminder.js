import { Alert } from 'react-native'
import { shared } from '../../../i18n/en/labels'
import labels from '../../../i18n/en/settings'

export default function showBackUpReminder(okHandler, cancelHandler, isDelete) {
  let title, message
  if (isDelete) {
    title = labels.passwordSettings.deleteBackupReminderTitle
    message = labels.passwordSettings.deleteBackupReminder
  } else {
    title = labels.passwordSettings.backupReminderTitle
    message = labels.passwordSettings.backupReminder
  }

  Alert.alert(
    title,
    message,
    [
      {
        text: shared.cancel,
        onPress: cancelHandler,
        style: 'cancel',
      },
      {
        text: shared.ok,
        onPress: okHandler,
      },
    ],
    { onDismiss: cancelHandler }
  )
}
