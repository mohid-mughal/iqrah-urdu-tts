# SampleSentences Component Demo

## Overview
The SampleSentences component displays a grid of clickable sample sentence cards. Each card shows both Urdu text and Roman transliteration, styled with Pakistan-inspired design elements.

## Usage

```tsx
import SampleSentences from '@/components/SampleSentences';
import { SAMPLE_SENTENCES } from '@/config/samples';
import { useState } from 'react';

function MyPage() {
  const [inputText, setInputText] = useState('');

  const handleSampleSelect = (sentence: string) => {
    setInputText(sentence);
  };

  return (
    <div>
      <SampleSentences 
        sentences={SAMPLE_SENTENCES} 
        onSelect={handleSampleSelect} 
      />
    </div>
  );
}
```

## Features

- **Clickable Cards**: Each sample sentence is displayed in a clickable card
- **Bilingual Display**: Shows both Urdu script and Roman transliteration
- **Pakistan-Inspired Design**: 
  - Uses Pakistan green color scheme
  - Includes decorative corner elements inspired by Islamic geometric patterns
  - Hover effects with green borders and shadows
- **Responsive Grid**: 1 column on mobile, 2 columns on desktop
- **Accessibility**: Proper ARIA labels and keyboard focus indicators

## Props

- `sentences`: Array of SampleSentence objects (from config/samples.ts)
- `onSelect`: Callback function that receives the selected Urdu text

## Design Elements

- Border decorations in corners that appear on hover
- Smooth transitions for hover states
- Focus ring for keyboard navigation
- Color transitions from gray to Pakistan green on hover

## Requirements Satisfied

- ✅ 6.1: Displays list of sample sentences
- ✅ 6.2: Includes Mohid's NUST sentence
- ✅ 6.3: Includes Ahmed's NUST sentence
- ✅ 6.4: Click handler populates TextInput
- ✅ 6.5: Enables synthesize button (handled by parent component)
