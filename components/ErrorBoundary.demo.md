# ErrorBoundary Component

Error Boundary component that catches React errors and displays a user-friendly fallback UI.

## Purpose

- Prevents the entire application from crashing due to component errors
- Provides a graceful error recovery mechanism
- Logs errors for debugging purposes
- Offers users options to retry or refresh

## Usage

Wrap your application or specific components with ErrorBoundary:

```tsx
import ErrorBoundary from '@/components/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## Features

- Catches JavaScript errors in child component tree
- Displays user-friendly error message
- Provides "Try Again" and "Refresh Page" buttons
- Shows error details in development mode
- Maintains Pakistan-themed design consistency

## Props

- `children`: ReactNode - Components to wrap with error boundary
- `fallback`: ReactNode (optional) - Custom fallback UI to display on error

## Implementation Details

- Uses React's `componentDidCatch` lifecycle method
- Logs errors to console for debugging
- Provides reset functionality to recover from errors
- Responsive design for mobile and desktop
