import RNFS from 'react-native-fs'
import { LOG_CONFIG, LOG_LEVELS, getCurrentLogFilePath } from './constants'

class Logger {
  isInitialized = false
  initializationPromise = null

  async init() {
    // Return existing promise if initialization is already in progress
    if (this.initializationPromise) {
      return this.initializationPromise
    }

    if (this.isInitialized) {
      return
    }

    this.initializationPromise = this._doInit()
    try {
      await this.initializationPromise
    } finally {
      this.initializationPromise = null
    }
  }

  async _doInit() {
    try {
      await this.createDir()
      this.isInitialized = true
    } catch (error) {
      console.error('Logger: Failed to initialize logger:', error)
      throw error
    }
  }

  log(level, source, message) {
    if (LOG_LEVELS[level] > LOG_CONFIG.currentLevel) {
      return
    }

    const messageStr =
      typeof message === 'string' ? message : JSON.stringify(message)

    this.writeToFile({ level, source, message: messageStr }).catch((error) => {
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

  async ensureFileExists(filePath) {
    // Check if log file exists, create if it doesn't
    // This handles race conditions by checking again if creation fails
    const fileExists = await RNFS.exists(filePath)
    if (!fileExists) {
      try {
        await RNFS.writeFile(filePath, '', 'utf8')
      } catch (error) {
        // Race condition: file might have been created by another write operation
        // Check again to see if it exists now
        const stillMissing = !(await RNFS.exists(filePath))
        if (stillMissing) {
          console.error('Logger: Failed to create file:', error)
          throw error
        }
      }
    }
  }

  async writeToFile({ level, source, message }) {
    try {
      await this.init()
      if (!this.isInitialized) {
        console.error('Logger: Not initialized, cannot write log')
        return
      }

      const currentLogPath = getCurrentLogFilePath()

      await this.ensureFileExists(currentLogPath)

      const logEntry = this.formatLogEntry({ level, source, message })

      // Append to log file
      await RNFS.appendFile(currentLogPath, logEntry, 'utf8')

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

  formatLogEntry({ level, source, message }) {
    const timestampStr = new Date().toISOString()
    const levelStr = level.padEnd(5)
    return `[${timestampStr}] ${levelStr} ${source} ${message}\n`
  }

  // Get all log files in the log directory
  async getAllLogFiles() {
    try {
      await this.init()
      const logDir = LOG_CONFIG.logDirectory
      const dirExists = await RNFS.exists(logDir)
      if (!dirExists) {
        return []
      }

      const files = await RNFS.readDir(logDir)
      return files.filter(
        (file) =>
          file.name.startsWith('drip-logs-') && file.name.endsWith('.txt')
      )
    } catch (error) {
      console.error('Logger: Failed to get all log files:', error)
      return []
    }
  }

  // Clear all log files
  async clearAllLogFiles() {
    try {
      const logFiles = await this.getAllLogFiles()
      await Promise.all(logFiles.map((file) => RNFS.unlink(file.path)))
      return logFiles.length
    } catch (error) {
      console.error('Logger: Failed to clear log files:', error)
      throw error
    }
  }
}

const logger = new Logger()

// Export the logger object with methods
export default {
  error: (source, message) => logger.log('ERROR', source, message),
  warn: (source, message) => logger.log('WARN', source, message),
  info: (source, message) => logger.log('INFO', source, message),
  debug: (source, message) => logger.log('DEBUG', source, message),
  clearAllLogFiles: () => logger.clearAllLogFiles(),
}
