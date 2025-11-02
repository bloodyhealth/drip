import RNFS from 'react-native-fs'
import { LOG_CONFIG, LOG_LEVELS, getCurrentLogFilePath } from './constants'

export default {
  error: (source, message) => logger.log('ERROR', source, message),
  warn: (source, message) => logger.log('WARN', source, message),
  info: (source, message) => logger.log('INFO', source, message),
  debug: (source, message) => logger.log('DEBUG', source, message),
  clearAllLogFiles: () => logger.clearAllLogFiles(),
  finalize: () => logger.finalize(),
  getCurrentLogFilePath: () => logger.getCurrentLogFilePath(),
}

class Logger {
  tempStorage = []
  isReady = false

  async init() {
    if (this.isReady) {
      return
    }
    await this.createDir()
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

  async isDirectoryReady() {
    const logDir = LOG_CONFIG.logDirectory
    return await RNFS.exists(logDir)
  }

  async createDir() {
    const logDir = LOG_CONFIG.logDirectory

    const dirExists = await RNFS.exists(logDir)

    // DocumentDirectoryPath should already exist, but we check anyway
    // If it doesn't exist, we'll try to create it (though this shouldn't be necessary)
    if (!dirExists) {
      try {
        // Note: mkdir might not create parent directories
        // But DocumentDirectoryPath should already exist on both platforms
        await RNFS.mkdir(logDir)
      } catch (mkdirError) {
        // Directory might have been created by another process, or mkdir failed
        // If DocumentDirectoryPath doesn't exist, that's unusual, but we'll continue
        console.warn(
          'Logger: Could not create log directory (may already exist):',
          mkdirError
        )
      }
    }
  }

  async flushTempStorage() {
    if (this.tempStorage.length === 0) {
      return
    }

    try {
      const currentLogPath = getCurrentLogFilePath()
      await this.ensureFileExists(currentLogPath)

      // Write all temp storage entries to the file
      const allEntries = this.tempStorage.join('')
      await RNFS.appendFile(currentLogPath, allEntries, 'utf8')

      // Clear temp storage after successful write
      this.tempStorage = []
    } catch (error) {
      console.error('Logger: Failed to flush temp storage:', error)
      throw error
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
      const logEntry = this.formatLogEntry({ level, source, message })

      if (!this.isReady) {
        // Directory not ready, store in temp storage
        this.tempStorage.push(logEntry)
        return
      }

      // Directory is ready, flush temp storage first if there's any data
      if (this.tempStorage.length > 0) {
        await this.flushTempStorage()
      }

      // Now write the new log entry
      const currentLogPath = getCurrentLogFilePath()
      await this.ensureFileExists(currentLogPath)
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

  // Get the current log file path if it exists, null otherwise
  async getCurrentLogFilePath() {
    try {
      const currentLogPath = getCurrentLogFilePath()
      const fileExists = await RNFS.exists(currentLogPath)
      return fileExists ? currentLogPath : null
    } catch (error) {
      console.error('Logger: Failed to get current log file path:', error)
      return null
    }
  }

  // Get all log files in the log directory
  async getAllLogFiles() {
    try {
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

  // Finalize the log file by flushing any remaining temp storage
  async finalize() {
    try {
      // Flush temp storage if there's any data
      if (this.tempStorage.length > 0) {
        await this.flushTempStorage()
      }
    } catch (error) {
      console.error('Logger: Failed to finalize log file:', error)
      throw error
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
logger.init()
