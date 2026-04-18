# TextInput Component - Feature Demonstration

## Component Overview
The TextInput component provides a culturally-appropriate textarea for Urdu text input with automatic Roman Urdu transliteration.

## Key Features Demonstrated

### 1. Real-Time Transliteration
**Input**: `mera naam mohid hai`
**Output**: `میرا نام محد ہے`

The component automatically converts Roman Urdu to Urdu script as you type.

### 2. Urdu Script Preservation
**Input**: `میرا نام احمد ہے`
**Output**: `میرا نام احمد ہے` (unchanged)

Existing Urdu text remains untouched during the transliteration process.

### 3. Mixed Content Handling
**Input**: `hello میرا نام world`
**Output**: `حیللو میرا نام ورلد`

Roman characters are converted while Urdu script is preserved.

### 4. Visual Features

#### Font Rendering
- Uses **Noto Nastaliq Urdu** font for authentic Urdu typography
- Culturally appropriate calligraphic style
- Optimized for readability

#### Text Direction
- Right-to-left (RTL) text flow
- Proper alignment for Urdu script
- Natural reading experience for Urdu speakers

#### Styling
- **Border**: 2px gray with rounded corners
- **Focus State**: Pakistan green ring (#01411C)
- **Disabled State**: Gray background
- **Transitions**: Smooth 200ms animations

### 5. Accessibility Features

#### ARIA Support
```html
<textarea
  aria-label="Urdu text input"
  lang="ur"
  dir="rtl"
/>
```

#### Keyboard Navigation
- Full keyboard support
- Tab navigation
- Standard textarea shortcuts

#### Screen Reader Support
- Proper language identification
- Descriptive labels
- State announcements

### 6. User Guidance
Helper text below the textarea:
> "Type in Roman Urdu and it will automatically convert to Urdu script, or paste Urdu text directly."

## Technical Implementation

### Props Interface
```typescript
interface TextInputProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}
```

### Default Placeholder
```
یہاں اردو متن لکھیں یا Roman Urdu میں ٹائپ کریں...
```
Translation: "Write Urdu text here or type in Roman Urdu..."

### CSS Classes Applied
- `font-urdu` - Noto Nastaliq Urdu font
- `urdu-text` - RTL direction and right alignment
- `focus:ring-pakistan-green` - Pakistan-themed focus state
- `resize-y` - Vertical resize capability

## Integration Example

```typescript
'use client';

import { useState } from 'react';
import TextInput from '@/components/TextInput';

export default function ExamplePage() {
  const [text, setText] = useState('');

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Urdu Text Input Demo</h1>
      
      <TextInput
        value={text}
        onChange={setText}
      />
      
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Current Value:</h2>
        <p className="font-urdu text-lg" dir="rtl">{text || 'No text entered'}</p>
      </div>
    </div>
  );
}
```

## Error Handling

### Graceful Degradation
The component uses `safeRomanToUrdu()` which:
- Catches transliteration errors
- Logs errors to console
- Returns original text on failure
- Never blocks user input

### Example Error Scenario
```typescript
// If transliteration service fails
Input: "salam"
Fallback: "salam" (original text preserved)
Console: "Transliteration failed, returning original text: [error]"
```

## Performance Considerations

### Optimization Strategies
1. **Singleton Service**: TransliterationService is instantiated once
2. **Efficient Conversion**: Character-by-character processing
3. **No External API Calls**: All processing happens client-side
4. **Minimal Re-renders**: Controlled component pattern

### Font Loading
- Fonts loaded via Next.js font optimization
- Automatic subsetting for Arabic characters
- CSS variables for consistent application

## Browser Compatibility

### Supported Features
- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ RTL text rendering
- ✅ Unicode Urdu characters (U+0600 to U+06FF)

### Fallback Behavior
- If Noto Nastaliq Urdu fails to load, falls back to system serif font
- Transliteration works independently of font loading

## Testing Coverage

### Unit Tests
- ✅ Rendering with props
- ✅ onChange callback execution
- ✅ RTL direction attribute
- ✅ Language attribute
- ✅ CSS class application
- ✅ Disabled state
- ✅ Value display
- ✅ Error handling

### Manual Testing Checklist
- [ ] Type Roman Urdu and verify conversion
- [ ] Paste Urdu text and verify preservation
- [ ] Test mixed Roman and Urdu content
- [ ] Verify font rendering
- [ ] Check RTL text flow
- [ ] Test focus states
- [ ] Test disabled state
- [ ] Verify on mobile devices
- [ ] Test with screen reader

## Requirements Traceability

| Requirement | Implementation | Status |
|-------------|----------------|--------|
| 1.1 - Accept both scripts | Textarea accepts all input | ✅ |
| 1.2 - Auto-convert Roman | safeRomanToUrdu() on change | ✅ |
| 1.3 - Preserve Urdu script | Service detects and preserves | ✅ |
| 8.3 - Noto Nastaliq font | font-urdu class applied | ✅ |

## Future Enhancements (Not in Current Scope)
- Character counter
- Undo/redo functionality
- Spell checking for Urdu
- Voice input integration
- Copy/paste formatting preservation
