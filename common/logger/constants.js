import RNFS from 'react-native-fs'

const LOG_DIR = RNFS.DocumentDirectoryPath
const LOG_FILE = 'drip-logs.txt'

// Log levels with numeric values for filtering
export const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
}

// Configuration
export const LOG_CONFIG = {
  logDirectory: LOG_DIR,
  path: `${LOG_DIR}/${LOG_FILE}`,
  maxFileSize: 1024 * 1024, // 1MB
  maxFiles: 1,
  currentLevel: __DEV__ ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO, // Debug in dev, Info in production
}
