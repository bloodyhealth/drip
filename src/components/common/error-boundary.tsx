import React, { Component, ErrorInfo, ReactNode } from 'react'

import { ErrorView } from './error-view'

type Props = {
  children?: ReactNode
}

type State = {
  error: Error | null
}

// Error boundaries have to be class components — there is no hook equivalent.
// This one only holds the error; ErrorView renders it so that the fallback can
// use hooks like useTranslation.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // drip ships no crash reporting, so this only reaches the dev console.
    // Reporting a crash stays the user's choice via the contact buttons.
    console.error(error, errorInfo.componentStack)
  }

  onRetry = () => this.setState({ error: null })

  render() {
    const { error } = this.state

    if (error) return <ErrorView error={error} onRetry={this.onRetry} />

    return this.props.children
  }
}
