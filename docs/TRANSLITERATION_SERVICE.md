# Transliteration Service Documentation

## Overview

The TransliterationService provides Roman Urdu to Urdu script conversion functionality for the Iqrah Urdu TTS application. It intelligently handles mixed text, preserves existing Urdu script, and provides graceful error handling.

## Features

- **Roman to Urdu Conversion**: Converts Roman Urdu text to proper Urdu script
- **Urdu Script Detection**: Identifies and preserves existing Urdu characters
- **Mixed Text Handling**: Correctly processes text containing both Roman and Urdu characters
- **Graceful Degradation**: Returns original text if conversion fails
- **Comprehensive Character Mapping**: Supports consonants, vowels, aspirated sounds, and special combinations

## Usage

### Basic Import

```typescript
import { transliterationService } from '@/services/transliteration.service';
```

### Convert Roman Urdu to Urdu Script

```typescript
const romanText = 'mera naam mohid hai';
const urduText = transliterationService.romanToUrdu(romanText);
// Result: Urdu script equivalent
```

### Check if Text is Urdu Script

```typescript
const text = 'سلام';
const isUrdu = transliterationService.isUrduScript(text);
// Result: true
```

### Safe Conversion with Error Handling

```typescript
const text = 'some text';
const result = transliterationService.safeRomanToUrdu(text);
// Returns converted text or original text if conversion fails
```

## Key Methods

### `romanToUrdu(text: string): string`

Converts Roman Urdu text to Urdu script while preserving existing Urdu characters.

**Parameters:**
- `text`: The input text (Roman Urdu, Urdu script, or mixed)

**Returns:**
- Converted Urdu script text

**Behavior:**
- Preserves existing Urdu script characters
- Converts Roman characters to Urdu equivalents
- Maintains spaces and punctuation
- Handles multi-character combinations (e.g., 'kh' → 'خ')

### `isUrduScript(text: string): boolean`

Checks if text contains Urdu script characters.

**Parameters:**
- `text`: The text to check

**Returns:**
- `true` if text contains Urdu characters, `false` otherwise

### `safeRomanToUrdu(text: string): string`

Safe wrapper around `romanToUrdu` with error handling.

**Parameters:**
- `text`: The input text

**Returns:**
- Converted text on success, original text on failure

## Character Mapping

The service supports comprehensive Roman to Urdu character mapping:

### Special Combinations
- `kh` → `خ`
- `gh` → `غ`
- `sh` → `ش`
- `ch` → `چ`
- `th` → `ٹھ`
- And many more...

### Basic Consonants
- `a` → `ا`
- `b` → `ب`
- `p` → `پ`
- `t` → `ت`
- And full alphabet support...

### Numbers
- `0-9` → `۰-۹` (Urdu numerals)

## Requirements Satisfied

This service fulfills the following requirements:

- **Requirement 1.1**: Accepts both Urdu script and Roman Urdu characters
- **Requirement 1.2**: Automatically converts Roman Urdu to Urdu script without modifying existing Urdu script
- **Requirement 1.3**: Preserves pasted Urdu script text without modification

## Examples

### Example 1: Pure Roman Urdu
```typescript
const input = 'assalam o alaikum';
const output = transliterationService.romanToUrdu(input);
// Output: Urdu script equivalent
```

### Example 2: Pure Urdu Script
```typescript
const input = 'میرا نام محد ہے';
const output = transliterationService.romanToUrdu(input);
// Output: 'میرا نام محد ہے' (unchanged)
```

### Example 3: Mixed Text
```typescript
const input = 'Hello میرا نام world';
const output = transliterationService.romanToUrdu(input);
// Output: Urdu script for 'Hello' and 'world', preserves 'میرا نام'
```

### Example 4: With Punctuation
```typescript
const input = 'salam, kya hal hai?';
const output = transliterationService.romanToUrdu(input);
// Output: Urdu script with preserved punctuation
```

## Integration with React Components

### In a Text Input Component

```typescript
import { transliterationService } from '@/services/transliteration.service';

function TextInput() {
  const [text, setText] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    const converted = transliterationService.romanToUrdu(input);
    setText(converted);
  };

  return (
    <textarea
      value={text}
      onChange={handleChange}
      placeholder="Type in Roman Urdu or Urdu script"
    />
  );
}
```

## Testing

The service includes comprehensive test coverage:

- **Unit Tests**: 25 tests covering all methods and edge cases
- **Integration Tests**: 14 tests validating real-world scenarios
- **Requirements Tests**: Explicit validation of all requirements

Run tests with:
```bash
npm test transliteration.service.test.ts
npm test transliteration.integration.test.ts
```

## Error Handling

The service handles errors gracefully:

1. **Invalid Input**: Returns empty string for null/undefined
2. **Conversion Errors**: `safeRomanToUrdu` catches exceptions and returns original text
3. **Library Load Failures**: Designed to work without external dependencies

## Performance Considerations

- **Character-by-character processing**: Efficient for real-time typing
- **No external API calls**: All conversion happens client-side
- **Minimal memory footprint**: Uses static character mapping
- **Fast detection**: Regex-based Urdu script detection

## Future Enhancements

Potential improvements for future versions:

1. Support for more Roman Urdu variations
2. Context-aware character selection
3. Diacritic mark handling
4. Custom mapping configuration
5. Integration with external transliteration libraries if needed

## Notes

- The service uses a mapping-based approach rather than external libraries for reliability
- All conversion happens client-side for privacy and performance
- The character mapping is comprehensive but may not cover all edge cases
- Users can always paste Urdu script directly if automatic conversion is insufficient
