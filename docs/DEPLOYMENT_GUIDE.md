# Vercel Deployment Guide

## Overview

This document provides comprehensive instructions for deploying the Iqrah Urdu TTS application to Vercel with automatic GitHub integration.

## Prerequisites

- GitHub account with the repository `mohid-mughal/iqrah-urdu-tts`
- Vercel account (free tier is sufficient)
- Code pushed to the main branch

## Deployment Configuration

### vercel.json

The project includes a `vercel.json` configuration file with the following settings:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "regions": ["iad1"],
  "headers": [...]
}
```

**Key Configuration:**
- **Build Command**: `npm run build` - Runs Next.js production build
- **Output Directory**: `.next` - Next.js build output location
- **Framework**: `nextjs` - Enables Vercel's Next.js optimizations
- **Regions**: `iad1` (US East) - Can be changed based on target audience
- **Security Headers**: Includes X-Content-Type-Options, X-Frame-Options, X-XSS-Protection

### Build Settings

The application uses standard Next.js 16 build process:

```bash
npm install          # Install dependencies
npm run build        # Build for production
npm start            # Start production server (Vercel handles this)
```

## Environment Variables

### Required Variables

**None** - The application does not require any environment variables for basic functionality.

### Optional Variables

If you need to customize backend endpoints in the future, you could add:

- `NEXT_PUBLIC_STANDARD_API_URL` - Standard model API endpoint
- `NEXT_PUBLIC_PHONEME_API_URL` - Phoneme model API endpoint

Currently, these are hardcoded in `config/models.ts`.

### Vercel Analytics

Vercel Analytics is automatically enabled when deployed to Vercel. No configuration or environment variables are needed. The `@vercel/analytics` package is already integrated in `app/layout.tsx`.

## Deployment Methods

### Method 1: Vercel Dashboard (Recommended)

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com/dashboard
   - Click "Add New Project"
   - Click "Import Git Repository"
   - Select `mohid-mughal/iqrah-urdu-tts`

3. **Configure Project:**
   - **Project Name**: `iqrah-urdu-tts` (or your preferred name)
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-configured)
   - **Output Directory**: `.next` (auto-configured)
   - **Install Command**: `npm install` (auto-configured)
   - **Environment Variables**: None needed

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (typically 2-3 minutes)
   - Your app will be live at `https://iqrah-urdu-tts.vercel.app` (or your custom domain)

### Method 2: Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

4. **Follow prompts:**
   - Set up and deploy: Yes
   - Which scope: Select your account
   - Link to existing project: No (first time) or Yes (subsequent deploys)
   - Project name: `iqrah-urdu-tts`
   - Directory: `./`
   - Override settings: No

## Automatic Deployments

Once connected to GitHub, Vercel provides:

### Production Deployments
- **Trigger**: Push to `main` branch
- **URL**: `https://iqrah-urdu-tts.vercel.app`
- **Behavior**: Replaces current production deployment

### Preview Deployments
- **Trigger**: Push to any branch or open pull request
- **URL**: Unique URL per deployment (e.g., `https://iqrah-urdu-tts-git-feature-branch.vercel.app`)
- **Behavior**: Creates isolated preview environment

### Build Checks
- Runs on every push and pull request
- Fails deployment if build errors occur
- Maintains previous working version on failure

## Post-Deployment Verification

### Automated Checks

After deployment, verify the following functionality:

1. **Application Loading**
   - [ ] Application loads at Vercel URL
   - [ ] No console errors in browser
   - [ ] All assets load correctly (fonts, styles)

2. **Model Selection**
   - [ ] Standard Model tab is visible and selectable
   - [ ] Phoneme Model tab is visible and selectable
   - [ ] Tab switching works smoothly
   - [ ] Model descriptions display correctly

3. **Text Input**
   - [ ] Text input field accepts Urdu script
   - [ ] Text input field accepts Roman Urdu
   - [ ] Roman Urdu transliteration works (if implemented)
   - [ ] Input field has proper RTL direction for Urdu

4. **Sample Sentences**
   - [ ] All sample sentences display
   - [ ] Clicking a sample populates the input field
   - [ ] Both required NUST student sentences are present

5. **Audio Synthesis**
   - [ ] Synthesize button is enabled with text input
   - [ ] Synthesize button is disabled when empty
   - [ ] Loading indicator appears during synthesis
   - [ ] Audio synthesis completes successfully
   - [ ] Error messages display on failure

6. **Voice Cloning - File Upload**
   - [ ] Upload button opens file picker
   - [ ] File picker accepts WAV, MP3, FLAC, OGG
   - [ ] Selected file name displays
   - [ ] Remove button clears the file
   - [ ] Synthesis includes reference audio

7. **Voice Cloning - Microphone Recording**
   - [ ] Microphone button requests permission
   - [ ] Recording indicator appears when recording
   - [ ] Stop recording saves audio
   - [ ] Recorded audio duration displays
   - [ ] Synthesis uses recorded audio

8. **Audio Playback**
   - [ ] Audio player appears after synthesis
   - [ ] Play button starts playback
   - [ ] Pause button stops playback
   - [ ] Seek controls work
   - [ ] Volume controls work
   - [ ] New audio replaces previous audio

9. **Responsive Design**
   - [ ] Mobile layout works (< 768px)
   - [ ] Desktop layout works (> 768px)
   - [ ] Touch controls work on mobile
   - [ ] All buttons are touch-friendly

10. **Analytics**
    - [ ] Vercel Analytics is active (check dashboard)
    - [ ] Events are being tracked
    - [ ] No analytics errors in console

### Manual Testing

Test the following scenarios manually:

1. **End-to-End Flow:**
   - Enter Urdu text → Synthesize → Play audio
   - Select sample → Synthesize → Play audio
   - Upload reference audio → Enter text → Synthesize → Play audio
   - Record audio → Enter text → Synthesize → Play audio

2. **Error Scenarios:**
   - Synthesize with empty input (should be disabled)
   - Synthesize with very long text (should handle gracefully)
   - Upload invalid file type (should show error)
   - Deny microphone permission (should show error)

3. **Cross-Browser Testing:**
   - Chrome/Edge (Chromium)
   - Firefox
   - Safari (if available)
   - Mobile browsers (Chrome, Safari)

## Troubleshooting

### Build Failures

**Symptom**: Deployment fails during build phase

**Solutions**:
1. Check build logs in Vercel dashboard
2. Run `npm run build` locally to reproduce
3. Verify all dependencies are in `package.json`
4. Check for TypeScript errors: `npm run lint`
5. Ensure Node.js version compatibility (18.x+)

**Common Issues**:
- Missing dependencies: Add to `package.json` and redeploy
- TypeScript errors: Fix type issues in code
- Environment variables: Verify they're set in Vercel dashboard

### Runtime Errors

**Symptom**: Application loads but features don't work

**Solutions**:
1. Check browser console for errors
2. Check Vercel function logs in dashboard
3. Verify backend API endpoints are accessible
4. Test API endpoints directly with curl/Postman

**Common Issues**:
- CORS errors: Backend must allow requests from Vercel domain
- API timeouts: Backend may be slow or down
- Network errors: Check internet connectivity

### Microphone Not Working

**Symptom**: Microphone recording fails or permission denied

**Solutions**:
1. Verify site is served over HTTPS (Vercel provides this)
2. Check browser permissions for microphone
3. Test on different browsers
4. Check browser console for permission errors

**Common Issues**:
- HTTP instead of HTTPS: Vercel always uses HTTPS
- Browser doesn't support MediaRecorder API
- User denied permission: Instruct to enable in browser settings

### Analytics Not Tracking

**Symptom**: No data in Vercel Analytics dashboard

**Solutions**:
1. Wait 5-10 minutes for data to appear
2. Verify `@vercel/analytics` is installed
3. Check that `<Analytics />` component is in `app/layout.tsx`
4. Test with multiple page views/interactions

**Common Issues**:
- Analytics takes time to appear (not instant)
- Ad blockers may block analytics
- Development mode doesn't track (only production)

### Performance Issues

**Symptom**: Slow loading or synthesis

**Solutions**:
1. Check Vercel Analytics for performance metrics
2. Run Lighthouse audit in Chrome DevTools
3. Optimize images and assets
4. Check backend API response times

**Common Issues**:
- Large bundle size: Analyze with `npm run build`
- Slow backend API: Contact backend maintainers
- Network latency: Consider CDN or edge functions

## Rollback Procedure

If a deployment introduces issues:

1. **Via Vercel Dashboard:**
   - Go to Deployments tab
   - Find previous working deployment
   - Click "..." menu → "Promote to Production"

2. **Via Git:**
   ```bash
   git revert HEAD
   git push origin main
   ```
   This will trigger a new deployment with reverted changes.

## Custom Domain Setup

To use a custom domain:

1. Go to Project Settings → Domains
2. Add your domain (e.g., `iqrah.example.com`)
3. Configure DNS records as instructed by Vercel
4. Wait for DNS propagation (up to 48 hours)
5. Vercel automatically provisions SSL certificate

## Monitoring and Maintenance

### Regular Checks

- **Weekly**: Check Vercel Analytics for usage patterns
- **Monthly**: Review error logs in Vercel dashboard
- **Quarterly**: Update dependencies: `npm update`

### Dependency Updates

```bash
# Check for outdated packages
npm outdated

# Update all dependencies
npm update

# Update Next.js specifically
npm install next@latest react@latest react-dom@latest

# Test locally
npm run build
npm run dev

# Deploy
git add package.json package-lock.json
git commit -m "Update dependencies"
git push origin main
```

### Security Updates

Vercel automatically notifies you of security vulnerabilities. To fix:

```bash
npm audit
npm audit fix
```

## Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Vercel Support**: https://vercel.com/support
- **GitHub Issues**: https://github.com/mohid-mughal/iqrah-urdu-tts/issues

## Conclusion

The Iqrah Urdu TTS application is now configured for seamless deployment to Vercel with automatic GitHub integration. Follow this guide for initial deployment and ongoing maintenance.
