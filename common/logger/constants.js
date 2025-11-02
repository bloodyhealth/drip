import RNFS from 'react-native-fs'

const LOG_DIR = RNFS.DocumentDirectoryPath

/**
 * Generate log file name with current date (e.g., drip-logs-2025-12-01.txt)
 * @returns {string}
 */
export function getLogFileName() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `drip-logs-${year}-${month}-${day}.txt`
}

/**
 * Get current log file path based on current date
 * @returns {string}
 */
export function getCurrentLogFilePath() {
  return `${LOG_DIR}/${getLogFileName()}`
}

export const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
}

export const LOG_CONFIG = {
  logDirectory: LOG_DIR,
  maxFileSize: 1024 * 1024, // 1MB
  currentLevel: __DEV__ ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO,
}
