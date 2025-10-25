import RNFS from 'react-native-fs'
import { LOG_CONFIG, LOG_LEVELS } from './constants'

class Logger {
  isInitialized = false
  async init() {
    // Return existing promise if initialization is already in progress
    if (this.isInitialized) {
      return
    }

    try {
      await this.createDir()
      await this.createFile()
      this.isInitialized = true
    } catch (error) {
      console.error('Logger: Failed to initialize logger:', error)
      throw error
    }
  }

  // Main logging function
  log(level, message) {
    // Check if this log level should be written
    if (LOG_LEVELS[level] > LOG_CONFIG.currentLevel) {
      return
    }

    // Convert message to string if it's not already
    const messageStr =
      typeof message === 'string' ? message : JSON.stringify(message)

    // Write to file asynchronously (don't await to avoid blocking)
    this.writeToFile(level, messageStr).catch((error) => {
      console.error('Logger error:', error)
    })
  }

  async createDir() {
    const logDir = LOG_CONFIG.logDirectory

    const dirExists = await RNFS.exists(logDir)

    // PicturesDirectoryPath should already exist, but we check anyway
    // If it doesn't exist, we'll try to create it (though this shouldn't be necessary)
    if (!dirExists) {
      try {
        // Note: mkdir might not create parent directories
        // But PicturesDirectoryPath should already exist on both platforms
        await RNFS.mkdir(logDir)
      } catch (mkdirError) {
        // Directory might have been created by another process, or mkdir failed
        // If PicturesDirectoryPath doesn't exist, that's unusual, but we'll continue
        console.warn(
          'Logger: Could not create log directory (may already exist):',
          mkdirError
        )
      }
    }
  }

  async createFile() {
    // Check if log file exists, create if it doesn't
    const fileExists = await RNFS.exists(LOG_CONFIG.path)
    if (!fileExists) {
      try {
        await RNFS.writeFile(LOG_CONFIG.path, '', 'utf8')
      } catch (error) {
        console.error('Logger: Failed to create file:', error)
        throw error
      }
    }
  }

  // Write log entry to file
  async writeToFile(level, message) {
    try {
      // Ensure initialization before writing
      await this.init()
      if (!this.isInitialized) {
        console.error('Logger: Not initialized, cannot write log')
        return
      }

      const logEntry = this.formatLogEntry(level, message)

      // Append to log file
      await RNFS.appendFile(LOG_CONFIG.path, logEntry, 'utf8')

      // Also log to console in development
      if (__DEV__) {
        const consoleMethod =
          level === 'ERROR' ? 'error' : level === 'WARN' ? 'warn' : 'log'
        // eslint-disable-next-line no-console
        console[consoleMethod](`[${level}] ${message}`)
      }
    } catch (error) {
      console.error('Logger: Failed to write to log file:', error)
    }
  }

  formatLogEntry(level, message, timestamp = new Date()) {
    const timestampStr = timestamp.toISOString()
    const levelStr = level.padEnd(5)
    return `[${timestampStr}] ${levelStr} ${message}\n`
  }
}

const logger = new Logger()

// Export the logger object with methods
export default {
  error: (message) => logger.log('ERROR', message),
  warn: (message) => logger.log('WARN', message),
  info: (message) => logger.log('INFO', message),
  debug: (message) => logger.log('DEBUG', message),
}
