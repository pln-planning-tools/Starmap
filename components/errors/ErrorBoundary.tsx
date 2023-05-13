import { Component } from 'react'

export class ErrorBoundary extends Component<{children: any}, {hasError: boolean}> {
  constructor (props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError () {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch (error, errorInfo) {
    console.log('error, errorInfo: ', error, errorInfo)
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  render () {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong. Please try to refresh the page.</h1>
    }

    return this.props.children
  }
}
