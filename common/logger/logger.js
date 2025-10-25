import RNFS from 'react-native-fs'
import { LOG_CONFIG, LOG_LEVELS } from './constants'

let currentFileSize = 0

// Initialize logger
async function initializeLogger() {
  try {
    // Check if log file exists and get its size
    const exists = await RNFS.exists(LOG_CONFIG.path)
    if (exists) {
      const stats = await RNFS.stat(LOG_CONFIG.path)
      currentFileSize = stats.size
    } else {
      currentFileSize = 0
    }
  } catch (error) {
    console.error('Failed to initialize logger:', error)
  }
}

// Format log entry
function formatLogEntry(level, message, timestamp = new Date()) {
  const timestampStr = timestamp.toISOString()
  const levelStr = level.padEnd(5)
  return `[${timestampStr}] ${levelStr} ${message}\n`
}

// Write log entry to file
async function writeToFile(level, message) {
  if (!RNFS.existsSync(LOG_CONFIG.path)) {
    await initializeLogger()
  }

  try {
    const logEntry = formatLogEntry(level, message)
    const entrySize = Buffer.byteLength(logEntry, 'utf8')

    // Check if we need to rotate the log file
    if (currentFileSize + entrySize > LOG_CONFIG.maxFileSize) {
      // TODO: Remove old logs
    }

    // Append to current log file
    await RNFS.appendFile(LOG_CONFIG.path, logEntry, 'utf8')
    currentFileSize += entrySize

    // Also log to console in development
    if (__DEV__) {
      const consoleMethod =
        level === 'ERROR' ? 'error' : level === 'WARN' ? 'warn' : 'log'
      // eslint-disable-next-line no-console
      console[consoleMethod](`[${level}] ${message}`)
    }
  } catch (error) {
    console.error('Failed to write to log file:', error)
  }
}

// Main logging function
function log(level, message) {
  // Check if this log level should be written
  if (LOG_LEVELS[level] > LOG_CONFIG.currentLevel) {
    return
  }

  // Convert message to string if it's not already
  const messageStr =
    typeof message === 'string' ? message : JSON.stringify(message)

  // Write to file asynchronously (don't await to avoid blocking)
  writeToFile(level, messageStr).catch((error) => {
    console.error('Logger error:', error)
  })
}

// Get all log files (including rotated ones)
async function getAllLogFiles() {
  try {
    const logDir = LOG_CONFIG.logDirectory
    const files = await RNFS.readDir(logDir)

    return files
      .filter((file) => file.name.startsWith('app-logs'))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime()) // Sort by modification time, newest first
  } catch (error) {
    console.error('Failed to get log files:', error)
    return []
  }
}

// Clear all log files
async function clearLogs() {
  try {
    const logFiles = await getAllLogFiles()

    for (const file of logFiles) {
      await RNFS.unlink(file.path)
    }

    currentFileSize = 0

    return true
  } catch (error) {
    console.error('Failed to clear logs:', error)
    return false
  }
}

// Initialize logger on module load
initializeLogger()

// Export the logger object with methods
export default {
  // Log level methods
  error: (message) => log('ERROR', message),
  warn: (message) => log('WARN', message),
  info: (message) => log('INFO', message),
  debug: (message) => log('DEBUG', message),
}
