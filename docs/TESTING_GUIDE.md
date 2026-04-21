# Testing Guide for New Features

## Quick Start

```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

## Feature Testing

### 1. Audio Progress Bar Fix

**Test Steps:**
1. Enter some Urdu text (or use a sample sentence)
2. Click "Synthesize Speech"
3. Wait for audio to generate
4. Play the audio
5. Watch the progress bar

**Expected Result:**
- Progress bar should move smoothly without jumping or glitching
- Time display should update smoothly
- Seek bar should be responsive

**Pass Criteria:**
- ✅ No visible glitches or jumps
- ✅ Smooth animation
- ✅ Accurate time display

---

### 2. Voice Cloning Disabled

**Test Steps:**
1. Scroll to where "Voice Cloning" section would be
2. Look for upload/record buttons

**Expected Result:**
- No upload or record buttons visible
- Simple message: "Voice cloning feature is currently disabled. Using default voice for synthesis."

**Pass Criteria:**
- ✅ No voice cloning UI visible
- ✅ Placeholder message displayed
- ✅ Synthesis still works with default voice

---

### 3. Header with Logo

**Test Steps:**
1. Load the page
2. Check the header
3. Resize browser window (mobile, tablet, desktop)

**Expected Result:**
- Logo displays in header
- Gradient background visible
- Responsive sizing works
- Text is readable

**Pass Criteria:**
- ✅ Logo visible and clear
- ✅ Header looks professional
- ✅ Responsive on all screen sizes

---

### 4. AI-Based Translation

**Test Steps:**
1. Select "AI-Based" translation mode
2. Type Roman Urdu: "mujhe khana pasand hai"
3. Click "Translate to Urdu via AI"
4. Wait for translation

**Expected Result:**
- Button shows loading state
- Text translates to: "مجھے کھانا پسند ہے"
- No errors

**Test Inappropriate Content:**
1. Type something abusive or violent
2. Click translate
3. Should see error about inappropriate content

**Test Rate Limiting:**
1. Make 6 rapid translation requests
2. 6th request should be blocked
3. Error message should show wait time

**Pass Criteria:**
- ✅ Translation works correctly
- ✅ Content moderation blocks bad content
- ✅ Rate limiting enforces limits
- ✅ Clear error messages

---

### 5. Character-Based Translation

**Test Steps:**
1. Select "Character-Based" translation mode
2. Start typing Roman Urdu: "salam"
3. Watch as you type

**Expected Result:**
- Text converts in real-time
- No button needed
- Instant feedback

**Pass Criteria:**
- ✅ Real-time conversion
- ✅ No lag
- ✅ Accurate transliteration

---

### 6. Translation Mode Toggle

**Test Steps:**
1. Click "AI-Based" button
2. Verify "Translate to Urdu via AI" button appears
3. Click "Character-Based" button
4. Verify translate button disappears
5. Check placeholder text changes

**Expected Result:**
- Mode switches smoothly
- UI updates appropriately
- Placeholder text is contextual

**Pass Criteria:**
- ✅ Smooth mode switching
- ✅ Correct UI for each mode
- ✅ Contextual help text

---

### 7. Third Model Tab

**Test Steps:**
1. Click on "Standard" tab
2. Click on "Phoneme" tab
3. Click on "Char-Phoneme" tab
4. Check model descriptions
5. Test synthesis with each model

**Expected Result:**
- Three tabs visible
- Each shows different model info
- Synthesis works with all models

**Pass Criteria:**
- ✅ All three tabs functional
- ✅ Correct model information
- ✅ Synthesis works for each

---

### 8. Training Data Display

**Test Steps:**
1. Check each model tab
2. Look for training data information

**Expected Result:**
- Shows "Training Corpus: X samples"
- Not "Training Data: X samples"
- Formatted nicely (17K, 120K, 50K)

**Pass Criteria:**
- ✅ Correct terminology
- ✅ Formatted display
- ✅ Accurate numbers

---

## Rate Limiting Tests

### Test Per-Minute Limit (5 requests)

```javascript
// Open browser console and run:
for (let i = 0; i < 6; i++) {
  console.log(`Request ${i + 1}`);
  // Click translate button manually or trigger via code
}
```

**Expected:**
- First 5 requests succeed
- 6th request shows error
- Error message shows wait time

### Test Per-Hour Limit (24 requests)

**Manual Test:**
1. Make 24 translation requests over time
2. 25th should be blocked
3. Error shows minutes to wait

### Test Per-Day Limit (60 requests)

**Manual Test:**
1. Make 60 translation requests throughout the day
2. 61st should be blocked
3. Error shows hours to wait

### Reset Rate Limits

```javascript
// Open browser console and run:
localStorage.removeItem('iqrah_rate_limit');
localStorage.removeItem('iqrah_device_id');
location.reload();
```

---

## Content Moderation Tests

### Test Cases

1. **Safe Content** ✅
   - Input: "mujhe khana pasand hai"
   - Expected: Translates successfully

2. **Abusive Language** ❌
   - Input: [abusive text]
   - Expected: Error about inappropriate content

3. **Violent Threats** ❌
   - Input: [violent text]
   - Expected: Error about inappropriate content

4. **Hateful Speech** ❌
   - Input: [hateful text]
   - Expected: Error about inappropriate content

5. **Explicit Content** ❌
   - Input: [explicit text]
   - Expected: Error about inappropriate content

---

## Browser Compatibility

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Chrome
- ✅ Mobile Safari

---

## Responsive Design Tests

### Desktop (1920x1080)
- ✅ Header looks good
- ✅ Three tabs fit well
- ✅ All text readable
- ✅ Logo appropriate size

### Tablet (768x1024)
- ✅ Header responsive
- ✅ Tabs stack or shrink appropriately
- ✅ Touch targets adequate
- ✅ Logo scales well

### Mobile (375x667)
- ✅ Header compact
- ✅ Tabs use short labels
- ✅ Touch-friendly buttons
- ✅ Logo visible

---

## Performance Tests

### Translation Speed
- AI translation: < 5 seconds
- Character translation: Instant

### Audio Synthesis
- Standard model: ~10-30 seconds
- Phoneme model: ~10-30 seconds
- Character phoneme model: ~10-30 seconds

### Page Load
- Initial load: < 3 seconds
- Logo loads: < 1 second

---

## Error Handling Tests

### Network Errors
1. Disconnect internet
2. Try AI translation
3. Should see connection error

### API Errors
1. Use invalid API key
2. Try translation
3. Should see API error

### Invalid Input
1. Leave text empty
2. Try to translate
3. Should see validation error

---

## Accessibility Tests

### Keyboard Navigation
- ✅ Tab through all controls
- ✅ Enter/Space activates buttons
- ✅ Focus visible

### Screen Reader
- ✅ ARIA labels present
- ✅ Semantic HTML used
- ✅ Error messages announced

### Color Contrast
- ✅ Text readable
- ✅ Buttons have good contrast
- ✅ Error messages visible

---

## Integration Tests

### Full User Flow - AI Mode
1. Load page
2. Select "AI-Based" mode
3. Type Roman Urdu text
4. Click "Translate to Urdu via AI"
5. Wait for translation
6. Click "Synthesize Speech"
7. Wait for audio
8. Play audio
9. Verify smooth progress bar

### Full User Flow - Character Mode
1. Load page
2. Select "Character-Based" mode
3. Type Roman Urdu (converts in real-time)
4. Click "Synthesize Speech"
5. Wait for audio
6. Play audio
7. Verify smooth progress bar

### Model Switching Flow
1. Select Standard model
2. Enter text and synthesize
3. Switch to Phoneme model
4. Synthesize same text
5. Switch to Character Phoneme model
6. Synthesize same text
7. Compare audio quality

---

## Bug Report Template

If you find issues, report using this format:

```markdown
## Bug Report

**Feature**: [Which feature]
**Browser**: [Browser and version]
**Device**: [Desktop/Mobile/Tablet]
**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Result**:

**Actual Result**:

**Screenshots**: [If applicable]

**Console Errors**: [If any]
```

---

## Success Criteria Summary

All tests should pass:
- ✅ Audio progress bar smooth
- ✅ Voice cloning hidden
- ✅ Logo displays correctly
- ✅ AI translation works
- ✅ Content moderation active
- ✅ Rate limiting enforced
- ✅ Character translation instant
- ✅ Mode toggle functional
- ✅ Three model tabs work
- ✅ Training data displays correctly
- ✅ Responsive on all devices
- ✅ Accessible
- ✅ No console errors
- ✅ Good performance

---

## Automated Testing (Future)

Consider adding:
- Unit tests for services
- Integration tests for components
- E2E tests for user flows
- Performance benchmarks
- Accessibility audits

---

**Last Updated**: April 21, 2026
**Version**: 1.0
