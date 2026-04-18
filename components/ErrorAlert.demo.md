# ErrorAlert Component

Inline error alert component for displaying contextual error messages.

## Purpose

- Display inline error messages within the application flow
- Provide contextual error information
- Allow users to dismiss errors
- Maintain visual consistency with error styling

## Usage

```tsx
import ErrorAlert from '@/components/ErrorAlert';

<ErrorAlert
  message="Unable to connect to the synthesis service."
  title="Connection Error"
  onDismiss={() => setError(null)}
/>
```

## Props

- `message`: string - The error message to display
- `title`: string (default: 'Error') - Title of the error alert
- `onDismiss`: () => void (optional) - Callback when alert is dismissed
- `className`: string (optional) - Additional CSS classes

## Features

- Red-themed error styling
- Icon for visual identification
- Optional dismiss button
- Responsive text wrapping
- Accessible with ARIA role="alert"
- Consistent with design system

## Use Cases

- API errors during synthesis
- Recording permission errors
- File upload validation errors
- Network connectivity issues
- Input validation errors

## Design

- Red border on left side
- Red background tint
- Error icon
- Bold title
- Descriptive message
- Optional close button
