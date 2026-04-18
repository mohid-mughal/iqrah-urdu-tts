# SynthesizeButton Component

## Overview

The SynthesizeButton component provides a button interface for triggering text-to-speech synthesis. It integrates with the TTSService to make API calls to the backend, handles loading states, and manages the synthesis lifecycle through callback props.

## Features

- **Loading State**: Displays a spinner and "Synthesizing..." text during API calls
- **Disabled State**: Automatically disables when:
  - Input text is empty
  - Synthesis is in progress
  - Explicitly disabled via props
- **Error Handling**: Catches synthesis errors and passes them to parent via callback
- **Accessibility**: Includes ARIA labels and busy states
- **Visual Feedback**: Pakistan green color scheme with hover/active states

## Props

```typescript
interface SynthesizeButtonProps {
  text: string;                                    // Text to synthesize
  referenceAudio: File | Blob | null;              // Optional reference audio for voice cloning
  modelEndpoint: string;                           // Backend API endpoint URL
  onSynthesisStart: () => void;                    // Called when synthesis begins
  onSynthesisComplete: (audioBlob: Blob) => void;  // Called with audio blob on success
  onSynthesisError: (error: Error) => void;        // Called with error on failure
  disabled?: boolean;                              // Optional explicit disable
}
```

## Usage Example

```tsx
import SynthesizeButton from '@/components/SynthesizeButton';
import { MODELS } from '@/config/models';

function MyComponent() {
  const [text, setText] = useState('');
  const [audio, setAudio] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <SynthesizeButton
      text={text}
      referenceAudio={null}
      modelEndpoint={MODELS.standard.endpoint}
      onSynthesisStart={() => {
        setIsLoading(true);
        setError(null);
      }}
      onSynthesisComplete={(audioBlob) => {
        setAudio(audioBlob);
        setIsLoading(false);
      }}
      onSynthesisError={(err) => {
        setError(err.message);
        setIsLoading(false);
      }}
    />
  );
}
```

## Requirements Satisfied

- **1.4**: Disables when input field is empty
- **1.5**: Enables when input field contains valid text
- **3.1**: Sends multipart form-data POST request to backend API
- **3.2**: Displays loading indicator and disables button during synthesis
- **3.5**: Handles synthesis failures and re-enables button

## Design Decisions

1. **Internal Loading State**: Component maintains its own loading state in addition to callbacks for better encapsulation
2. **Text Trimming**: Automatically trims whitespace from text before sending to API
3. **Conditional Reference Audio**: Only includes reference audio in request if provided
4. **Error Propagation**: Converts all errors to Error objects before passing to callback
5. **Pakistan Green Theme**: Uses green-600/700/800 for brand consistency

## Accessibility

- `aria-label`: Describes button purpose
- `aria-busy`: Indicates loading state to screen readers
- `aria-hidden`: Hides decorative icons from screen readers
- Keyboard accessible via native button element
- Clear visual disabled state

## Styling

- Full width button with rounded corners
- Pakistan green color scheme (#16a34a)
- Smooth transitions for hover/active states
- Disabled state with reduced opacity
- Loading spinner animation
- Icon + text layout with gap

