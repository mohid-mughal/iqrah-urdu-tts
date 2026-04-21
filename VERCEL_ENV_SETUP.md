# Vercel Environment Variables Setup

## Security Fix Applied ✅

The Groq API key is now secure! It's been moved to server-side only and will NOT be exposed to the browser.

## Environment Variables to Add in Vercel

Go to your Vercel project dashboard → Settings → Environment Variables, and add these:

### 1. GROQ_API_KEY (Server-side - SECURE)
- **Name**: `GROQ_API_KEY`
- **Value**: Your Groq API key (starts with `gsk_...`)
- **Environment**: Production, Preview, Development (select all)
- **Important**: Do NOT add `NEXT_PUBLIC_` prefix - this keeps it server-side only

### 2. NEXT_PUBLIC_RATE_LIMIT_PER_MINUTE (Client-side - Safe)
- **Name**: `NEXT_PUBLIC_RATE_LIMIT_PER_MINUTE`
- **Value**: `5`
- **Environment**: Production, Preview, Development

### 3. NEXT_PUBLIC_RATE_LIMIT_PER_HOUR (Client-side - Safe)
- **Name**: `NEXT_PUBLIC_RATE_LIMIT_PER_HOUR`
- **Value**: `24`
- **Environment**: Production, Preview, Development

### 4. NEXT_PUBLIC_RATE_LIMIT_PER_DAY (Client-side - Safe)
- **Name**: `NEXT_PUBLIC_RATE_LIMIT_PER_DAY`
- **Value**: `60`
- **Environment**: Production, Preview, Development

## Why This is Secure Now

- **Before**: `NEXT_PUBLIC_GROQ_API_KEY` was exposed in browser JavaScript (anyone could steal it)
- **After**: `GROQ_API_KEY` stays on the server, API calls go through `/api/translate` route
- **Result**: Your API key is protected and never sent to the browser

## After Adding Variables

1. Vercel will automatically redeploy your app
2. The translation feature will work securely
3. No one can steal your API key from the browser

## Testing

After deployment, you can verify the API key is NOT exposed by:
1. Opening your deployed site
2. Opening browser DevTools (F12)
3. Going to Network tab
4. Using the translation feature
5. Checking the requests - you'll see calls to `/api/translate` (your server), not directly to Groq
6. The API key will NOT appear anywhere in the browser

✅ Your API key is now secure!
