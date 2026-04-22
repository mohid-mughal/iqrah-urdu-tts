# Iqrah - Urdu Text-to-Speech

Welcome to Iqrah, where we teach computers to speak Urdu better than your cousin who moved abroad and forgot the language. This is a web application that converts Urdu text into natural speech, because sometimes typing is easier than talking, especially when your family is asleep and you need to hear how that Urdu poetry sounds.

## What This Thing Does

Iqrah is a text-to-speech application for Urdu that actually works. You type in Urdu (or Roman Urdu if you're one of those people), and it speaks it back to you. Think of it as Google Translate's cooler cousin who actually understands the nuances of Urdu pronunciation.

We've got two models here, both trained with love, chai, and probably too many late nights at NUST:

**Standard Model**: The reliable one. Trained on 17,000 samples. It's like your dependable friend who always shows up on time. No fancy phoneme processing, just straightforward text-to-speech that gets the job done.

**Phoneme Model**: The experimental one. Trained on 120,000 samples with word-based phonemization. This is the friend who tried something new and learned a valuable lesson. Due to using word-based instead of character-based phonemization during training, it doesn't quite hit the mark. But hey, that's research for you. We're keeping it here as a learning experience and a reminder that not all experiments work out, and that's perfectly fine.

## Features That Actually Matter

**AI Translation**: Type in Roman Urdu and let the AI convert it to proper Urdu script. Uses Groq AI with content moderation to keep things family friendly. Rate limited so nobody can abuse it (we learned this the hard way).

**Text Input**: Type in Urdu script directly if you prefer. The app handles both Roman and Urdu script like a pro.

**Sample Sentences**: Too lazy to type? We've got you covered with pre-written sentences. Just click and synthesize. Includes the mandatory NUST student introductions because we're proud of our university.

**Audio Playback**: Play, pause, and control the synthesized speech. Revolutionary features like "play" and "pause" that you definitely haven't seen anywhere else (we're joking, but ours looks prettier).

**Pakistan-Inspired Design**: Green and white color scheme with Islamic geometric patterns, because why not make it look good while it works well? We're representing the green passport properly.

**Mobile Friendly**: Works on your phone, tablet, laptop, and probably your smart fridge if it has a browser. Responsive design is not optional in 2026.

**Secure**: Your API keys are safe. We moved everything to server-side so nobody can steal credentials from the browser. Security matters, even for hobby projects.

## The Tech Stack (For the Nerds)

Built with modern web technologies that are probably outdated by the time you read this:

- **Next.js 16**: Because we like our React with server-side rendering and App Router
- **React 19**: The latest and greatest, with hooks that actually make sense
- **TypeScript**: For when you want JavaScript to tell you you're wrong before runtime does
- **Tailwind CSS**: Utility-first CSS that makes our Pakistan-themed design look sharp
- **Vercel Analytics**: To see how many people actually use this thing
- **fast-check**: Property-based testing, because regular testing is too mainstream
- **Jest & React Testing Library**: For making sure things don't break when we push to production

## Getting Started (The Easy Way)

### What You Need

- Node.js 18 or higher (if you're still on Node 14, it's time to upgrade)
- npm (comes with Node.js, so you're probably good)
- A Groq API key (for the AI translation feature)
- A computer (obviously)
- Internet connection (to download dependencies and hit the backend APIs)

### Installation

Clone this repository and install dependencies. You know the drill:

```bash
git clone https://github.com/mohid-mughal/iqrah-urdu-tts.git
cd iqrah-urdu-tts
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# Server-side only - NOT exposed to browser (this is important for security)
GROQ_API_KEY=your_groq_api_key_here

# Client-side - safe to expose (just rate limit numbers)
NEXT_PUBLIC_RATE_LIMIT_PER_MINUTE=5
NEXT_PUBLIC_RATE_LIMIT_PER_HOUR=24
NEXT_PUBLIC_RATE_LIMIT_PER_DAY=60
```

Notice the `GROQ_API_KEY` doesn't have `NEXT_PUBLIC_` prefix. That's intentional. It keeps the API key on the server where it belongs, not in the browser where anyone can steal it.

### Running Locally

Start the development server:

```bash
npm run dev
```

Open your browser and go to `http://localhost:3000`. If you see the Iqrah interface, congratulations, you can follow instructions.

### Building for Production

When you're ready to deploy:

```bash
npm run build
npm start
```

This builds an optimized production bundle. It's like the difference between your room when guests are coming versus your room normally.

### Running Tests

We've got tests. They mostly pass:

```bash
npm test
```

For the brave souls who want to see test coverage:

```bash
npm test -- --coverage
```

## Understanding the Two Models

### Standard Model: The Reliable One

This model was trained on 17,000 Urdu speech samples without any phoneme processing. It's straightforward, dependable, and gets the job done. Think of it as the Toyota Corolla of TTS models. Not flashy, but it'll get you where you need to go.

**Backend API**: `https://ahmedjaved812-urdu-tts-backend.hf.space/synthesize`

**When to use it**: When you want consistent, reliable Urdu speech synthesis without any experimental features.

### Phoneme Model: The Learning Experience

This model was trained on 120,000 samples with word-based phonemization. Here's where we learned an important lesson: word-based phonemization doesn't work as well as character-based phonemization for Urdu. The speech quality isn't great, and that's okay. We're keeping it in the app as a testament to the research process. Not every experiment succeeds, and that's how we learn.

**Backend API**: `https://ahmedjaved812-urdu-tts-phonemes-backend.hf.space/synthesize`

**When to use it**: When you want to hear what happens when you try something new in research and it doesn't quite work out. Educational purposes, basically.

**The Technical Explanation**: During training, we used word-based phonemization instead of character-based phonemization. This means the model learned to map entire words to their phonetic representations rather than individual characters. For Urdu, with its complex script and pronunciation rules, this approach didn't capture the nuances needed for natural speech. The result is speech that sounds... well, not great. But that's research. You try things, some work, some don't, and you document both.

## Project Structure (Where Everything Lives)

```
iqrah-urdu-tts/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with fonts and analytics
│   ├── page.tsx           # Main application page
│   └── globals.css        # Global styles and Tailwind imports
├── components/             # React components
│   ├── Layout.tsx         # Main layout wrapper
│   ├── Header.tsx         # Top navigation with branding
│   ├── Footer.tsx         # Footer with credits and links
│   ├── ModelTabs.tsx      # Model selection tabs
│   ├── TextInput.tsx      # Text input with transliteration
│   ├── SampleSentences.tsx # Pre-written sample sentences
│   ├── AudioControls.tsx  # File upload and recording controls
│   ├── SynthesizeButton.tsx # Main synthesis trigger
│   ├── AudioPlayer.tsx    # Audio playback controls
│   ├── ErrorBoundary.tsx  # Error handling wrapper
│   ├── ErrorAlert.tsx     # Error message display
│   └── Toast.tsx          # Toast notifications
├── services/               # Service classes
│   ├── tts.service.ts     # TTS API communication
│   ├── transliteration.service.ts # Roman to Urdu conversion
│   ├── recording.service.ts # Microphone recording
│   └── analytics.service.ts # Usage tracking
├── config/                 # Configuration files
│   ├── models.ts          # Model configurations
│   ├── samples.ts         # Sample sentences
│   └── constants.ts       # App constants
├── utils/                  # Utility functions
│   ├── audioConverter.ts  # Audio format conversion
│   └── errorMessages.ts   # Error message helpers
├── types/                  # TypeScript type definitions
│   └── index.ts           # Shared types
└── __tests__/             # Test files
    ├── *.test.ts          # Unit tests
    └── *.test.tsx         # Component tests
```

## Deploying to Vercel (Making It Live)

This app is configured for Vercel deployment because Vercel and Next.js go together like biryani and raita.

### Prerequisites

- A GitHub account (you probably have one)
- A Vercel account (free tier works fine)
- Your code pushed to GitHub
- A Groq API key (get one from groq.com)

### The Easy Way (Recommended)

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Ready to show the world"
   git push origin main
   ```

2. Go to [vercel.com](https://vercel.com) and sign in

3. Click "Add New Project"

4. Import your GitHub repository (`mohid-mughal/iqrah-urdu-tts`)

5. Vercel will auto-detect Next.js and configure everything. Just click "Deploy"

6. Wait about 2 minutes while Vercel does its magic

7. Your app is now live at `https://your-project.vercel.app`

### The CLI Way (For Terminal Enthusiasts)

```bash
npm install -g vercel
vercel login
vercel --prod
```

Follow the prompts, and you're done.

### Environment Variables (Important)

After your first deployment, you need to add environment variables in Vercel:

1. Go to your project in Vercel Dashboard
2. Navigate to Settings > Environment Variables
3. Add these variables:

**GROQ_API_KEY** (Required for AI translation)
- Value: Your Groq API key
- Environments: Production, Preview, Development
- Important: Do NOT add `NEXT_PUBLIC_` prefix. This keeps it server-side only for security.

**NEXT_PUBLIC_RATE_LIMIT_PER_MINUTE**
- Value: `5`
- Environments: All

**NEXT_PUBLIC_RATE_LIMIT_PER_HOUR**
- Value: `24`
- Environments: All

**NEXT_PUBLIC_RATE_LIMIT_PER_DAY**
- Value: `60`
- Environments: All

After adding environment variables, Vercel will automatically redeploy. The translation feature will work once the redeployment completes.

### Automatic Deployments

Once connected to GitHub, Vercel will automatically:

- Deploy to production when you push to `main`
- Create preview deployments for pull requests
- Run build checks before deploying
- Rollback if something breaks (though hopefully it won't)

### Verifying Your Deployment

After deployment, check that:

- The app loads (seems obvious, but you'd be surprised)
- Both model tabs work
- Text input and transliteration function correctly
- AI translation works (this needs the GROQ_API_KEY environment variable)
- Sample sentences populate the input field
- Audio synthesis works with both models
- Audio playback controls work
- The design looks good on mobile and desktop
- Analytics are tracking (check Vercel Analytics dashboard)

### Troubleshooting

**Build fails**: Check that all dependencies are in `package.json` and run `npm run build` locally first.

**App doesn't load**: Check the browser console for errors. Probably a missing environment variable or API endpoint issue.

**Translation says "not configured"**: You forgot to add the `GROQ_API_KEY` environment variable in Vercel. Go add it and wait for the automatic redeployment.

**Analytics not showing**: Give it a few minutes. Analytics data isn't instant.

## Credits and Acknowledgments

This project was built by a team of NUST students who spent way too much time training models and debugging React components:

**M. Mohid Mughal**: Model training and frontend development. The person who made the interface look good and work smoothly. Also responsible for the Pakistan-themed design that makes you feel patriotic while using a TTS app.

**Ahmed Javed**: Extreme model training and backend development. The person who trained 120,000 samples and learned that word-based phonemization isn't the way to go. Also built the backend APIs that actually do the heavy lifting.

**Abdul Rehman**: Contributing team member who helped make this project possible.

**Daniyal Munib**: Contributing team member who helped make this project possible.

### Backend APIs

Both models are hosted on Hugging Face Spaces, which generously provides free hosting for ML models. The backend is built with FastAPI because Python and machine learning go together like chai and pakoras.

### Special Thanks

- National University of Science and Technology (NUST) for the education and the late-night lab access
- The Urdu language for being beautiful and complex enough to make this project interesting
- Groq AI for providing the translation API
- Vercel for free hosting and analytics
- Next.js team for making React development less painful
- Everyone who tested this and provided feedback

## Contributing

Found a bug? Want to add a feature? Contributions are welcome. Just:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure your code passes the tests and follows the existing code style. We're not picky, but we do appreciate clean code.

## License

MIT License. Use it, modify it, deploy it, just don't blame us if something breaks.

## Final Notes

This project started as a university assignment and turned into something actually useful. If you're using it, we hope it serves you well. If you find bugs (and you probably will), please report them. If you want to contribute, even better.

Remember: The phoneme model doesn't work great, and that's okay. Not every experiment succeeds, and documenting failures is just as important as celebrating successes. That's science, that's engineering, and that's life.

The AI translation feature uses server-side API routes to keep your API keys secure. We learned this lesson after almost exposing credentials to the browser. Security matters, even in hobby projects.

Now go forth and make computers speak Urdu.

---

Built with love (and lots of chai) at NUST, Pakistan

Version 1.0.0 | Last Updated: April 2026
