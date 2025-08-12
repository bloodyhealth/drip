import { Alert } from 'react-native'
import i18n from '../../../i18n/i18n'

export default function alertError(msg) {
  Alert.alert(i18n.t('shared.error'), msg)
}
