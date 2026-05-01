# Quick Start Guide

## Starting the Application

```bash
# Make sure you're in the project directory
cd "D:\Programs_Projects_and_Code\Iqrah - Urdu TTS"

# Start the development server
npm run dev
```

Wait for the message: `✓ Ready in X seconds`

Then open: **http://localhost:3000**

## What You Should See

### 1. Header
- Green gradient header
- Logo (either PNG or SVG fallback with Urdu letter)
- "Iqrah - Urdu TTS" title
- Urdu subtitle: "اردو ٹیکسٹ ٹو اسپیچ"

### 2. Model Tabs
Three tabs at the top:
- **Standard** - Basic model
- **Phoneme** - Experimental model
- **Char-Phoneme** - Advanced model (recommended)

### 3. Translation Mode Toggle
Two buttons:
- **AI-Based** - Uses Groq AI for translation
- **Character-Based** - Real-time transliteration

### 4. Text Input Area
- Large text box for typing
- Placeholder text explaining the mode
- Help text below

### 5. Sample Sentences
- Clickable sample sentences in Urdu
- Click to auto-fill the text box

### 6. Synthesize Button
- Green button to generate speech
- Disabled if no text entered

## Testing Features

### Test 1: Character-Based Translation

1. Click **"Character-Based"** button
2. Start typing: `salam`
3. Watch it convert in real-time to Urdu
4. Continue typing: `kaise hain`
5. Should see Urdu text appearing

**Expected**: Real-time conversion as you type

### Test 2: AI Translation

1. Click **"AI-Based"** button
2. Type: `mujhe khana pasand hai`
3. Click **"Translate to Urdu via AI"** button
4. Wait 2-5 seconds
5. Should see: `مجھے کھانا پسند ہے`

**Expected**: Translated Urdu text appears in the box

### Test 3: Content Moderation

1. In AI mode, type something inappropriate
2. Click translate
3. Should see error: "We cannot process this request..."

**Expected**: Error message about inappropriate content

### Test 4: Rate Limiting

1. In AI mode, make 6 translation requests quickly
2. 6th request should fail
3. Error should say: "Rate limit exceeded: 5 requests per minute. Please wait X seconds."

**Expected**: Rate limit enforced

### Test 5: Model Switching

1. Enter some Urdu text (or use sample)
2. Click **"Standard"** tab
3. Click **"Synthesize Speech"**
4. Wait for audio
5. Play audio
6. Switch to **"Char-Phoneme"** tab
7. Click **"Synthesize Speech"** again
8. Compare audio quality

**Expected**: Different audio from different models

### Test 6: Audio Progress Bar

1. Generate audio (any model)
2. Click play
3. Watch the progress bar
4. Should move smoothly without jumping

**Expected**: Smooth progress bar animation

## Common First-Time Issues

### Logo Not Showing
- **What you'll see**: SVG fallback logo (green book with Urdu letter)
- **Why**: PNG might not load on first run
- **Fix**: Refresh page (Ctrl+R) or use the SVG (it looks good!)

### Translation Button Disabled
- **Why**: No text entered or wrong mode
- **Fix**: Type some text first

### "Unable to connect" Error
- **Why**: Internet connection or API issue
- **Fix**: Check internet, wait a moment, try again

### Rate Limit Hit Immediately
- **Why**: You tested too many times
- **Fix**: Open browser console (F12), run:
  ```javascript
  localStorage.clear();
  location.reload();
  ```

## Browser Console

### Opening Console
- Press **F12**
- Or right-click → "Inspect" → "Console" tab

### What to Check
- Look for red errors
- Check network tab for failed requests
- Verify environment variables loaded:
  ```javascript
  console.log(process.env.NEXT_PUBLIC_GROQ_API_KEY);
  ```

## Feature Checklist

After starting the app, verify:

- [ ] Page loads without errors
- [ ] Header shows with logo/icon
- [ ] Three model tabs visible
- [ ] Translation mode toggle works
- [ ] Can type in text box
- [ ] Character mode converts in real-time
- [ ] AI mode translate button appears
- [ ] Sample sentences clickable
- [ ] Synthesize button works
- [ ] Audio generates and plays
- [ ] Progress bar moves smoothly
- [ ] No console errors

## Quick Commands

### Restart Server
```bash
# Press Ctrl+C to stop
# Then:
npm run dev
```

### Clear Cache
```bash
# Stop server, then:
rmdir /s /q .next
npm run dev
```

### Check for Errors
```bash
npm run build
```

### Reset Rate Limits
In browser console (F12):
```javascript
localStorage.clear();
location.reload();
```

## Expected Behavior Summary

| Feature | Expected Behavior |
|---------|------------------|
| **Logo** | PNG or SVG fallback displays |
| **Model Tabs** | 3 tabs, clickable, shows info |
| **Translation Toggle** | 2 modes, switches smoothly |
| **Character Mode** | Real-time conversion |
| **AI Mode** | Translate button, 2-5 sec wait |
| **Content Moderation** | Blocks bad content |
| **Rate Limiting** | 5/min, 24/hour, 60/day |
| **Synthesis** | Generates audio in 10-30 sec |
| **Audio Player** | Smooth progress bar |
| **Sample Sentences** | Click to auto-fill |

## Performance Expectations

- **Page Load**: < 3 seconds
- **AI Translation**: 2-5 seconds
- **Character Translation**: Instant
- **Audio Synthesis**: 10-30 seconds (depends on model/text length)
- **Audio Playback**: Immediate

## Next Steps

Once everything works:

1. Try all three models
2. Test with longer text
3. Try different sample sentences
4. Test on mobile (if available)
5. Check different browsers

## Need Help?

1. Check **TROUBLESHOOTING.md** for common issues
2. Review **docs/TESTING_GUIDE.md** for detailed tests
3. Check browser console for errors
4. Verify `.env.local` exists and has API key

---

**Ready to start?**

```bash
npm run dev
```

Then open: http://localhost:3000

🎉 Enjoy testing!
