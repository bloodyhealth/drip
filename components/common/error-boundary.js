import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'

import AppText from './app-text'
import Button from './button'
import logger from '../../common/logger'
import { Colors } from '../../styles'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details to log file
    const errorMessage = `ErrorBoundary caught an error: ${error.toString()}`
    const componentStack =
      errorInfo.componentStack || 'No component stack available'

    // Log error details
    logger.error(`${errorMessage}\nComponent Stack: ${componentStack}`)

    // Store error details in state for display
    this.setState({
      error: error.toString(),
      errorInfo: componentStack,
    })
  }

  handleGoHome = () => {
    // Reset error state
    this.setState({ hasError: false, error: null, errorInfo: null })

    // Navigate to Home screen
    if (this.props.navigate) {
      this.props.navigate('Home')
    }
  }

  handleReportProblem = () => {
    // Reset error state so user can navigate to ReportProblem screen
    this.setState({ hasError: false, error: null, errorInfo: null })

    // Navigate to ReportProblem screen
    if (this.props.navigate) {
      this.props.navigate('ReportProblem')
    }
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <AppText style={styles.title}>Something went wrong</AppText>
            <AppText style={styles.message}>
              The app encountered an unexpected error. The error has been
              logged.
            </AppText>
            <View style={styles.buttonRow}>
              <View style={styles.buttonWrapper}>
                <Button isCTA onPress={this.handleGoHome}>
                  Go to Home
                </Button>
                <Button isCTA onPress={this.handleReportProblem}>
                  Report problem
                </Button>
              </View>
            </View>
            {__DEV__ && this.state.error && (
              <View style={styles.errorContainer}>
                <AppText style={styles.errorText}>{this.state.error}</AppText>
              </View>
            )}
          </View>
        </View>
      )
    }

    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  navigate: PropTypes.func,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.purple,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: Colors.greyDark,
  },
  errorContainer: {
    marginTop: 24,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 24,
    color: Colors.grey,
    fontFamily: 'monospace',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 24,
  },
  buttonWrapper: {
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
  },
})

export default ErrorBoundary
