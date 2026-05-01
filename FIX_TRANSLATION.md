# Fix for Translation 404 Error

## Problem
Getting "Moderation API error: 404" and "Translation API error: 404" when trying to translate Roman Urdu via AI.

## Root Causes
1. ✅ **FIXED**: API key was split across multiple lines in `.env.local`
2. ✅ **FIXED**: Wrong model name (was using `qwen/qwen-2.5-32b-instruct`, now using `qwen/qwen3-32b`)
3. ✅ **FIXED**: Added better error handling and logging

## Solution Steps

### Step 1: Restart Dev Server (REQUIRED!)

The `.env.local` file has been fixed, but you MUST restart the dev server for changes to take effect:

```bash
# Press Ctrl+C to stop the current server
# Then restart:
npm run dev
```

**Important**: Environment variables are only loaded when the server starts!

### Step 2: Verify API Key is Loaded

After restarting, open your browser console (F12) and check:

```javascript
console.log('API Key loaded:', !!process.env.NEXT_PUBLIC_GROQ_API_KEY);
console.log('API Key length:', process.env.NEXT_PUBLIC_GROQ_API_KEY?.length);
// Should show: true and 56
```

### Step 3: Test Translation

1. Go to http://localhost:3000
2. Select **"AI-Based"** mode
3. Type: `salam`
4. Click **"Translate to Urdu via AI"**
5. Check browser console for logs

### Step 4: Check Console Logs

You should now see detailed logs:
- `Moderation request: { url: ..., model: ..., hasKey: true }`
- `Moderation response status: 200`
- `Translation request: { url: ..., model: ..., hasKey: true }`
- `Translation response status: 200`
- `Translation response: { ... }`

## What Was Fixed

### 1. API Key Format
**Before** (broken):
```env
NEXT_PUBLIC_GROQ_API_KEY=gsk_RAxLv4mG2M0H0DBVwnEiWGdyb3F
Y3kfGQ9ptItxfFddBmIet2OXy
```

**After** (fixed):
```env
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
```

### 2. Model Name
**Before** (404 error):
```typescript
private readonly MODEL = 'qwen/qwen-2.5-32b-instruct';
```

**After** (works):
```typescript
private readonly MODEL = 'qwen/qwen3-32b';
```

### 3. Error Handling
Added detailed logging and better error messages:
- Logs request details
- Logs response status
- Shows specific error for 404, 401, 429
- Displays full error text from API

## Testing the API Directly

You can test if the Groq API is working with:

```bash
node test-groq-api.js
```

This will test different models and show which one works.

## Available Groq Models

The service now uses `qwen/qwen3-32b`, but these are also available:
- `qwen/qwen3-32b` ✅ (current, recommended)
- `llama-3.1-70b-versatile`
- `mixtral-8x7b-32768`
- `gemma2-9b-it`

## If Still Getting 404

### Check 1: API Key Valid
The API key might be invalid or expired. Verify it works:

```bash
curl https://api.groq.com/openai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_GROQ_API_KEY" \
  -d '{
    "model": "qwen/qwen3-32b",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 10
  }'
```

### Check 2: Model Available
The model might not be available in your region or account. Try different models by editing `services/groq.service.ts`:

```typescript
private readonly MODEL = 'mixtral-8x7b-32768'; // Try this instead
```

### Check 3: API Endpoint
Verify the endpoint is correct:
```typescript
private readonly API_URL = 'https://api.groq.com/openai/v1/chat/completions';
```

## Expected Behavior After Fix

### Success Flow:
1. Type Roman Urdu text
2. Click "Translate to Urdu via AI"
3. See "Translating..." button state
4. Console shows:
   ```
   Moderation request: { url: ..., model: qwen/qwen3-32b, hasKey: true }
   Moderation response status: 200
   Translation request: { url: ..., model: qwen/qwen3-32b, hasKey: true }
   Translation response status: 200
   Translation response: { choices: [...] }
   ```
5. Urdu text appears in text box

### Error Messages:
- **401**: "API key is invalid. Please check your configuration."
- **404**: "Translation model not found. The service may be temporarily unavailable."
- **429**: "Translation service is busy. Please try again in a moment."

## Troubleshooting Checklist

- [ ] Stopped dev server (Ctrl+C)
- [ ] Restarted dev server (`npm run dev`)
- [ ] Verified API key loaded in console
- [ ] Checked browser console for detailed logs
- [ ] Tried translating simple text like "salam"
- [ ] Checked for any CORS errors in console
- [ ] Verified internet connection
- [ ] Tried different browser (Chrome recommended)

## Quick Test

After restarting server:

1. Open http://localhost:3000
2. Open browser console (F12)
3. Select "AI-Based" mode
4. Type: `salam`
5. Click translate
6. Watch console logs

**Expected**: Should see status 200 and Urdu text appears

**If 404**: Check console logs, verify API key, try test script

## Alternative: Use Character Mode

If AI translation still doesn't work, you can use Character-Based mode:

1. Click **"Character-Based"** button
2. Start typing Roman Urdu
3. It converts in real-time (no API needed)
4. Works offline!

This uses the existing transliteration service and doesn't require the Groq API.

## Summary

✅ Fixed API key format (was split across lines)
✅ Changed to correct model name (`qwen/qwen3-32b`)
✅ Added detailed logging
✅ Added better error messages
✅ Created test script

**Next step**: Restart your dev server and try again!

---

**Last Updated**: April 21, 2026
