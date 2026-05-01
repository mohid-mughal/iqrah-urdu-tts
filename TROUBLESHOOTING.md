# Troubleshooting Guide

## Logo Not Showing

### Issue
The logo doesn't appear in the header when running localhost.

### Solutions Implemented
1. **Fallback SVG Logo**: The header now includes a fallback SVG logo that displays if the PNG fails to load
2. **Multiple Logo Paths**: Tries `/iqrah-logo.png` first, then `/logo.png`, then shows SVG fallback
3. **Unoptimized Image**: Added `unoptimized` prop to bypass Next.js image optimization during development

### What You Should See
- Either the Iqrah PNG logo (red Urdu text on black background)
- OR a green book icon with an Urdu "alif" letter (fallback SVG)

### If Still Not Working
1. Check browser console for errors (F12 → Console tab)
2. Verify files exist:
   ```bash
   dir public\logo.png
   dir public\iqrah-logo.png
   ```
3. Clear browser cache (Ctrl+Shift+Delete)
4. Restart dev server:
   ```bash
   npm run dev
   ```

## Translation Features Not Working

### AI Translation

**Common Issues:**

1. **"Translation service is busy" error**
   - The Groq API might be rate-limited
   - Wait a few seconds and try again
   - Check your API key is correct in `.env.local`

2. **"Unable to connect" error**
   - Check internet connection
   - Verify `.env.local` exists and has the API key
   - Restart dev server after adding `.env.local`

3. **Rate limit errors**
   - You've exceeded 5 requests/minute, 24/hour, or 60/day
   - Wait for the specified time
   - Or clear localStorage:
     ```javascript
     // In browser console (F12)
     localStorage.clear();
     location.reload();
     ```

### Character-Based Translation

**Common Issues:**

1. **Not transliterating as I type**
   - Make sure "Character-Based" mode is selected
   - Check that the toggle button is highlighted
   - Try typing Roman Urdu letters (a, b, k, etc.)

2. **Wrong characters appearing**
   - This uses the existing transliteration service
   - Some character mappings might not be perfect
   - Use AI mode for better accuracy

## Build Errors

### TypeScript Errors

**Fixed Issues:**
- ✅ Rate limit service type error (fixed)
- ✅ All components type-checked

**If you see new errors:**
```bash
# Check for errors
npm run build

# If errors, check diagnostics
# Look at the file and line number mentioned
```

## Dev Server Issues

### Server Won't Start

```bash
# Kill any existing processes
taskkill /F /IM node.exe

# Clear Next.js cache
rmdir /s /q .next

# Reinstall dependencies
npm install

# Start fresh
npm run dev
```

### Changes Not Reflecting

1. **Hard refresh**: Ctrl+Shift+R
2. **Clear cache**: Ctrl+Shift+Delete
3. **Restart server**: Stop (Ctrl+C) and `npm run dev`

## Environment Variables Not Loading

### Symptoms
- Translation doesn't work
- "API key not found" errors
- Rate limiting not working

### Solution
1. Verify `.env.local` exists in root directory
2. Check format (no quotes around values):
   ```env
   NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
   NEXT_PUBLIC_RATE_LIMIT_PER_MINUTE=5
   ```
3. Restart dev server (environment variables only load on startup)
4. Check in browser console:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_GROQ_API_KEY);
   ```

## Model Tabs Not Working

### Issue
Can't switch between Standard, Phoneme, and Character Phoneme models.

### Check
1. All three tabs should be visible
2. Clicking should highlight the selected tab
3. Model description should change
4. Check browser console for errors

### If Not Working
- Check `config/models.ts` has all three models defined
- Verify `types/index.ts` includes `'characterPhoneme'` in ModelType
- Check browser console for errors

## Audio Progress Bar Still Glitching

### If you still see glitches:
1. Check browser compatibility (Chrome/Firefox recommended)
2. Try different audio file
3. Check browser console for errors
4. Verify `requestAnimationFrame` is supported:
   ```javascript
   // In browser console
   console.log(typeof requestAnimationFrame);
   // Should show "function"
   ```

## Synthesis Not Working

### Common Issues

1. **"Unable to connect to synthesis service"**
   - Check internet connection
   - Verify model endpoint URLs in `config/models.ts`
   - Try a different model

2. **"Synthesis failed" errors**
   - Text might be too long (try shorter text)
   - Model server might be down (try different model)
   - Check browser console for details

3. **No audio plays**
   - Check browser audio permissions
   - Verify audio player appears
   - Check browser console for errors

## Browser Console Debugging

### How to Open Console
- **Chrome/Edge**: F12 or Ctrl+Shift+I
- **Firefox**: F12 or Ctrl+Shift+K
- **Safari**: Cmd+Option+I

### What to Look For
- Red errors (most important)
- Yellow warnings (less critical)
- Network errors (failed API calls)
- 404 errors (missing files)

### Common Error Messages

**"Failed to load resource: net::ERR_FILE_NOT_FOUND"**
- A file is missing (probably logo)
- Check the file path in the error
- Verify file exists in `public` folder

**"Uncaught TypeError: Cannot read property 'X' of undefined"**
- JavaScript error in component
- Note the file and line number
- Check that component

**"Failed to fetch"**
- Network/API error
- Check internet connection
- Verify API endpoints

## Quick Fixes Checklist

When something doesn't work:

- [ ] Check browser console for errors
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Clear browser cache
- [ ] Restart dev server
- [ ] Verify `.env.local` exists
- [ ] Check internet connection
- [ ] Try different browser
- [ ] Clear localStorage
- [ ] Rebuild project (`npm run build`)

## Getting Help

### Information to Provide

When reporting issues, include:

1. **What you're trying to do**
2. **What's happening instead**
3. **Browser console errors** (screenshot or copy-paste)
4. **Steps to reproduce**
5. **Browser and version**
6. **What you've already tried**

### Example Bug Report

```
Issue: AI translation not working

Steps:
1. Selected "AI-Based" mode
2. Typed "salam"
3. Clicked "Translate to Urdu via AI"
4. Got error: "Unable to connect to translation service"

Browser: Chrome 120
Console Error: "Failed to fetch"

Tried:
- Restarting server
- Checking .env.local (it exists)
- Different text
```

## Still Having Issues?

1. Check all files were created correctly
2. Verify no TypeScript errors: `npm run build`
3. Check all dependencies installed: `npm install`
4. Try the testing guide: `docs/TESTING_GUIDE.md`
5. Review implementation docs: `docs/NEW_FEATURES_IMPLEMENTATION.md`

---

**Last Updated**: April 21, 2026
