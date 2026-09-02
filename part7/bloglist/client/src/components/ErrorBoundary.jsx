import { Component } from 'react'
import { Alert, Box, Button, Typography } from '@mui/material'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error">
            <Typography variant="subtitle1">Something went wrong.</Typography>
            <Typography variant="body2">{this.state.error.message}</Typography>
          </Alert>
          <Button
            sx={{ mt: 2 }}
            variant="outlined"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            try again
          </Button>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
