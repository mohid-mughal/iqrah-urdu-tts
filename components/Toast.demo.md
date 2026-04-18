# Toast Component

Toast notification component for displaying temporary messages.

## Purpose

- Display temporary notifications to users
- Auto-dismiss after specified duration
- Support multiple notification types (error, success, warning, info)
- Non-intrusive user experience

## Usage

```tsx
import Toast from '@/components/Toast';

<Toast
  message="Synthesis completed successfully!"
  type="success"
  duration={5000}
  onClose={() => console.log('Toast closed')}
/>
```

## Props

- `message`: string - The message to display
- `type`: 'error' | 'success' | 'warning' | 'info' (default: 'error') - Type of notification
- `duration`: number (default: 5000) - Duration in milliseconds before auto-dismiss
- `onClose`: () => void (optional) - Callback when toast is closed

## Features

- Auto-dismisses after specified duration
- Manual dismiss with close button
- Smooth enter/exit animations
- Color-coded by notification type
- Responsive design
- Fixed positioning (top-right)
- Accessible with ARIA attributes

## Notification Types

- **Error**: Red theme for error messages
- **Success**: Green theme for success messages
- **Warning**: Yellow theme for warning messages
- **Info**: Blue theme for informational messages
