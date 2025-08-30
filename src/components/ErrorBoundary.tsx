"use client"

import React from "react"

type Props = {
  children: React.ReactNode
}

type State = {
  hasError: boolean
  error?: Error | null
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // You can log the error to an error reporting service here
    console.error("Unhandled error in UI:", error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-semibold text-red-700">Something went wrong</h2>
          <p className="text-sm text-red-600 mt-2">We&apos;re sorry — an unexpected error occurred while rendering this part of the app.</p>
          <details className="mt-3 text-xs text-red-500">
            {this.state.error && this.state.error.message}
          </details>
          <div className="mt-4">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Dismiss
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
